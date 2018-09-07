module.exports = async (ctx, next) => {
  const Request = require('../models/Request');
  const Approver = require('../models/Approver');
  const util = require('../util/zutil');

  let args = ctx.query;
  let rawItems = [];
  let items = [];

  var requestIds = await Approver.getRequestIds(args);
  if (requestIds) {
    await Request.getItem({ args: args, requestIds: requestIds }).then((result) => {
      rawItems = result;
      //格式化日期
      for (let idx in rawItems) {
        rawItems[idx].createdate = rawItems[idx].createdate.toLocaleDateString();
      }
      //按日期时间倒序排序
      rawItems.sort(util.sortBy('createdate', 'DESC'));

      //取出日期
      let dates = [];
      for (let idx in rawItems) {
        if (dates.indexOf(rawItems[idx].createdate) == -1) {
          dates.push(rawItems[idx].createdate);
        }
      }

      //处理数据成小程序展示需要的格式
      let tmpItem = {date: '', week:'', records:[]};
      let record = {name:'', time:'', subcategory:'', subject:'',  requestid:'', idrequest:'', idreqjson:''};
      for(let idx in dates){
        tmpItem.date = dates[idx];
        tmpItem.week = new Date(dates[idx]).getDay();
        for (let idx1 in rawItems) {
          if (rawItems[idx1].createdate == dates[idx]) {
            record.name  = rawItems[idx1].name;
            record.time  = rawItems[idx1].createtime;
            record.subcategory  = rawItems[idx1].subcategory;
            record.subject  = rawItems[idx1].subject;
            record.requestid  = rawItems[idx1].requestid;
            record.idrequest  = rawItems[idx1].idrequest;
            record.idreqjson  = rawItems[idx1].idreqjson;
            tmpItem.records.push(record);
            record = { name: '', time: '', subcategory: '', subject: '', requestid: '', idrequest: '', idreqjson: '' }
          }
        }
        //按时间倒序排序
        tmpItem.records.sort(util.sortBy('time', 'DESC'));
        items.push(tmpItem);
        tmpItem = {date: '', week:'', records:[]};
      }

    }).catch((err) => {
      items = null;
      items = err;
    })
  }

  ctx.state.data = items;
}