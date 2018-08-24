module.exports = async (ctx, next) => {
  const Request = require('../models/Request');
  const Approver = require('../models/Approver');
  let cates = [];
  let args = ctx.query;

  var requestIds = await Approver.getRequestIds(args);

  if (requestIds) {
    await Request.getCategory({args: args, requestIds: requestIds}).then((result) => {
      cates = result;
    }).catch((err) => {
      cates = null;
      cates = err;
    })

  }

  ctx.state.data = cates;
}