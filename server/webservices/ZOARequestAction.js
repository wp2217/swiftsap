function getWebService() {
  var fs = require('fs')
  const path = require('path')
  const INIT_WS_FILE = path.join(__dirname, './ZOARequestAction.wsdl')
  const { mysql } = require('../qcloud')

  var zoaRequestAction = {
    ZOARequestAction: {
      ZOARequestAction_HttpPort: {

        createRequest: function (args) {
          if (args.requestJSON == undefined) {
            console.log('传入参数Header部分(requestJSON)不能为空\r\n');
            return { out: 'E|' + "传入参数Header部分(requestJSON)不能为空" }
          }

          var cdate = new Date().toLocaleDateString()
          var ctime = new Date().toLocaleTimeString()
          console.log(`\r\n Web service triger Start at ${cdate + ' ' + ctime}.. \r\n`)

          //数据定义
          // var requestJSON = {
          //   appid: '226677',
          //   uuid: '228900000000',
          //   applevel: '01',
          //   requestid: 'INV22337788',
          //   Category: 'FICO',
          //   subcategory: 'E-invoice',
          //   requester: { email: '312186657@qq.com', sapid: 'IBMDEV48', name1: 'WangPP' },
          //   approvers: [{ email: '312186657@qq.com', sapid: 'IBMDEV48', name1: 'WangPP' },
          //   { email: 'wp217@qq.com', sapid: 'IBMDEV48', name1: 'WangPP' }]
          // }

          // var reqJSON = {
          //   headJSON: '{"REQID": "123456", "SO": "8899900"}',
          //   itemJSON: '{}'
          // }


          var requestJSON = args.requestJSON  //Header 信息
          var reqJSON = {
            headJSON: args.headJSON,
            itemJSON: args.itemJSON,
            historyJSON: args.historyJSON,
            attachJSON: args.attachJSON,
          }

          if (reqJSON['itemJSON'] == undefined) {
            delete reqJSON['itemJSON']
          }

          if (reqJSON['historyJSON'] == undefined) {
            delete reqJSON['historyJSON']
          }

          if (reqJSON['attachJSON'] == undefined) {
            delete reqJSON['attachJSON']
          }
          var allUser = new Array();
          allUser = allUser.concat(requestJSON.approvers);

          var reqInapp = false //单据创建者是审批者标志
          var requesterIdx = ''   //单据创建者在数组中的Index

          //检查单据创建者是否在审批者数组中
          for (const idx in allUser) {
            if (allUser[idx].email == requestJSON.requester.email) {
              reqInapp = true
              requesterIdx = idx
            }
          }
          //单据创建者不在审批者数组中则加入并返回index
          if (!reqInapp) {
            requesterIdx = allUser.push(requestJSON.requester) - 1
          }

          var lastIdx = allUser.length - 1
          var userIDs = new Array()
          //var requesterID = ''  //保存/查询到数据库后的用户主键
          var approverIDs = new Array()

          //用户和审批者创建，不用放在Transaction里面
          for (const idx in allUser) {
            mysql('USER').select('iduser').where({ email: allUser[idx].email })
              .then((objs) => {
                if (objs.length != 0) { //存在该用户
                  if (idx == requesterIdx) {
                    //requesterID = objs[0].iduser
                    if (reqInapp) {
                      approverIDs.push(objs[0].iduser)
                    }
                  } else {
                    approverIDs.push(objs[0].iduser)
                  }
                  userIDs.push(objs[0].iduser)

                } else {  //不存在则需要插入该用户到User表
                  mysql('USER').insert(allUser[idx], 'iduser')
                    .then((ids) => {
                      if (ids[0] > 0) {
                        if (idx == requesterIdx) {
                          //requesterID = ids[0]
                          if (reqInapp) {
                            approverIDs.push(ids[0])
                          }
                        } else {
                          approverIDs.push(ids[0])
                        }
                        userIDs.push(ids[0])
                      }
                    })
                    .then(() => {
                      if (lastIdx == idx && userIDs.length > 0) {
                        console.log('USER保存/查询成功，ID：' + userIDs[requesterIdx] + '\r\n')
                        zcreateRequest()
                      }
                    })
                    .catch(function (error) {
                      console.log(`\r\n报错详细信息${cdate + ' ' + ctime}---->开始\r\n`)
                      console.log(error)
                      console.log(`\r\n报错详细信息${cdate + ' ' + ctime}<----结束\r\n`)
                    })
                }
              }).then(() => { //最后更新单据
                if (lastIdx == idx && userIDs.length > 0) {
                  console.log('USER保存/查询成功，ID：' + userIDs[requesterIdx] + '\r\n')
                  zcreateRequest()
                }
              })
              .catch(function (error) {
                console.log(`\r\n报错详细信息${cdate + ' ' + ctime}---->开始\r\n`)
                console.log(error)
                console.log(`\r\n报错详细信息${cdate + ' ' + ctime}<----结束\r\n`)
              })
          }

          function zcreateRequest() {
            //Using trx as a transaction object:
            mysql.transaction(function (trx) {
              var request = requestJSON    //单据信息
              delete request['requester']  //删除用户信息
              delete request['approvers']  //删除审批者信息
              request['idreqjson'] = ''
              request['iduser'] = ''
              request['cdate'] = ''
              request['ctime'] = ''

              request.iduser = userIDs[requesterIdx];
              //request.iduser = requesterID;

              //单据处理 Request 和 Reqjson创建
              if (request.iduser != '') {
                mysql.insert(reqJSON, 'idreqjson').into('REQJSON').transacting(trx)
                  .then(function (ids) {
                    if (ids[0] > 0) {
                      request.idreqjson = ids[0]
                      request.cdate = new Date().toLocaleDateString()
                      request.ctime = new Date().toLocaleTimeString()
                      return mysql.insert(request, 'idrequest').into('REQUEST').transacting(trx)
                    } else {
                      console.log('REQJSON create failed!\r\n')
                    }
                  })
                  .then(trx.commit)
                  .catch(trx.rollback)

              } else {
                console.log('iduser of Request is null!\r\n')
              }
            })//创建Approver 单据和审批者映射
              .then(function (inserts) {
                console.log('Request 创建成功，ID 是：' + inserts[0] + '\r\n')
                for (const idx in approverIDs) {
                  var approver = {
                    idrequest: inserts[0],
                    iduser: approverIDs[idx]
                  }
                  mysql.insert(approver).into('APPROVER').then((inserts) => {
                    console.log('Approver 创建成功，ID 是：' + inserts[0] + '\r\n')
                  })
                }
                console.log('Web service triger End.. \r\n')
              })
              .catch(function (error) {
                console.log(`\r\n报错详细信息${cdate + ' ' + ctime}---->开始\r\n`)
                console.log(error)
                console.log(`\r\n报错详细信息${cdate + ' ' + ctime}<----结束\r\n`)
              })
          }

          return { out: 'S|' + '方法已调用' }

        }//createRequest方法结束

      }
    }
  }

  if (fs.existsSync(INIT_WS_FILE)) {
    var xml = fs.readFileSync(INIT_WS_FILE, 'utf8')
    return { xml: xml, ws: zoaRequestAction }
  } else {
    console.log(`No such file ${INIT_WS_FILE}`)
  }
}

module.exports = getWebService