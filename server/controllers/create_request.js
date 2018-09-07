module.exports = async (ctx, next) => {
  const {
    mysql
  } = require('../qcloud');

  const Request = require('../models/Request');
  const Approver = require('../models/Approver');
  const User = require('../models/User');

  var args = ctx.request.body;
  var outJson = {};
  ctx.state.data = {};

  if (args.JSON_HEAD == undefined) {
    console.log('传入参数Header部分(JSON_HEAD)不能为空\r\n');
    ctx.state.data = {
      out: 'E|' + "传入参数Header部分(JSON_HEAD)不能为空"
    };
    return;
  }

  var createdate = new Date().toLocaleDateString()
  var createtime = new Date().toLocaleTimeString()
  console.log(`\r\n Web service triger Start at ${createdate + ' ' + createtime}.. \r\n`)

  var JSON_HEAD = args.JSON_HEAD //Header 信息
  var reqJSON = {
    JSON_DATA_FIELD: JSON.stringify(args.JSON_DATA_FIELD),
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
  allUser = allUser.concat(JSON_HEAD.APPROVERS);

  var reqInapp = false //单据创建者是审批者标志
  var requesterIdx = '' //单据创建者在数组中的Index

  //检查单据创建者是否在审批者数组中
  for (const idx in allUser) {
    if (allUser[idx].EMAIL == JSON_HEAD.REQUESTER.EMAIL) {
      reqInapp = true
      requesterIdx = idx
    }
  }
  //单据创建者不在审批者数组中则加入并返回index
  if (!reqInapp) {
    requesterIdx = allUser.push(JSON_HEAD.REQUESTER) - 1
  }

  var lastIdx = allUser.length - 1
  var userIDs = new Array()
  var approverIDs = new Array()

  //用户和审批者创建，不用放在Transaction里面
  for (const idx in allUser) {
    var objs = await User.getUserID({ EMAIL: allUser[idx].EMAIL });
    if (objs.length != 0) { //存在该用户
      if (idx == requesterIdx) {
        if (reqInapp) {
          approverIDs.push(objs[0].IDUSER)
        }
      } else {
        approverIDs.push(objs[0].IDUSER)
      }
      userIDs.push(objs[0].IDUSER)

    } else { //不存在则需要插入该用户到User表
      var ids = await User.saveUser(allUser[idx]);
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
    }

    if (lastIdx == idx && userIDs.length > 0) {
      console.log('USER保存/查询成功，ID：' + userIDs[requesterIdx] + '\r\n')
      await zcreateRequest(ctx.state.data)
    }
  }

  //   mysql('USER').select('IDUSER').where({
  //     EMAIL: allUser[idx].EMAIL
  //   })
  //     .then((objs) => {
  //       if (objs.length != 0) { //存在该用户
  //         if (idx == requesterIdx) {
  //           //requesterID = objs[0].IDUSER
  //           if (reqInapp) {
  //             approverIDs.push(objs[0].IDUSER)
  //           }
  //         } else {
  //           approverIDs.push(objs[0].IDUSER)
  //         }
  //         userIDs.push(objs[0].IDUSER)

  //       } else { //不存在则需要插入该用户到User表


  //         mysql('USER').insert(allUser[idx], 'IDUSER')
  //           .then((ids) => {
  //             if (ids[0] > 0) {
  //               if (idx == requesterIdx) {
  //                 //requesterID = ids[0]
  //                 if (reqInapp) {
  //                   approverIDs.push(ids[0])
  //                 }
  //               } else {
  //                 approverIDs.push(ids[0])
  //               }
  //               userIDs.push(ids[0])
  //             }
  //           })
  //           .then(() => {
  //             if (lastIdx == idx && userIDs.length > 0) {
  //               console.log('USER保存/查询成功，ID：' + userIDs[requesterIdx] + '\r\n')
  //               zcreateRequest(ctx.state.data)
  //             }
  //           })
  //           .catch(function (error) {
  //             console.log(`\r\n报错详细信息${createdate + ' ' + createtime}---->开始\r\n`)
  //             console.log(error)
  //             console.log(`\r\n报错详细信息${createdate + ' ' + createtime}<----结束\r\n`)
  //             ctx.state.data = JSON.stringify(error);
  //           })
  //       }
  //     }).then(() => { //最后更新单据
  //       if (lastIdx == idx && userIDs.length > 0) {
  //         console.log('USER保存/查询成功，ID：' + userIDs[requesterIdx] + '\r\n')
  //         zcreateRequest(ctx.state.data)
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log(`\r\n报错详细信息${createdate + ' ' + createtime}---->开始\r\n`)
  //       console.log(error)
  //       console.log(`\r\n报错详细信息${createdate + ' ' + createtime}<----结束\r\n`)
  //       ctx.state.data = JSON.stringify(error);
  //     })
  // }

  async function zcreateRequest(retdata) {
    //Using trx as a transaction object:
    mysql.transaction(function (trx) {
      var request = JSON_HEAD //单据信息
      delete request['REQUESTER'] //删除用户信息
      delete request['APPROVERS'] //删除审批者信息
      request['IDREQJSON'] = ''
      request['IDUSER'] = ''

      request.IDUSER = userIDs[requesterIdx];
      //request.IDUSER = requesterID;

      //单据处理 Request 和 Reqjson创建
      if (request.IDUSER != '') {
        mysql.insert(reqJSON, 'IDREQJSON').into('REQJSON').transacting(trx)
          .then(function (ids) {
            if (ids[0] > 0) {
              request.IDREQJSON = ids[0]
              return mysql.insert(request, 'IDREQUEST').into('REQUEST').transacting(trx)
            } else {
              console.log('REQJSON create failed!\r\n')
              trx.rollback
            }
          })
          .then(trx.commit)
          .catch(trx.rollback)

      } else {
        console.log('IDUSER of Request is null!\r\n')
        trx.rollback
      }
    }) //创建Approver 单据和审批者映射
      .then(function (inserts) {
        console.log('Request 创建成功，ID 是：' + inserts[0] + '\r\n')
        for (const idx in approverIDs) {
          var approver = {
            IDREQUEST: inserts[0],
            IDUSER: approverIDs[idx]
          }
          mysql.insert(approver).into('APPROVER').then((inserts) => {
            console.log('Approver 创建成功，ID 是：' + inserts[0] + '\r\n')
            retdata = { out: 'S' };
          })
        }
        console.log('Web service triger End.. \r\n')
      })
      .catch(function (error) {
        console.log(`\r\n报错详细信息${createdate + ' ' + createtime}---->开始\r\n`)
        console.log(error)
        console.log(`\r\n报错详细信息${createdate + ' ' + createtime}<----结束\r\n`)
        retdata = JSON.stringify(error)
      })
  }


}