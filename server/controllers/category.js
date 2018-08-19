module.exports = async (ctx, next) => {
  const Request = require('../models/Request');
  const Approver = require('../models/Approver');
  let cates = [];
  let argus = { iduser: 1 }

  var requestIds = await Approver.getRequestIds(argus);

  if (requestIds) {
    await Request.getCategory(requestIds).then((result) => {
      cates = result;
    }).catch((err) => {
      cates = null;
      cates = err;
    })

  }

  ctx.state.data = cates;

  // let result = await Request.getByIduser(1);

  // for (const idx in result) {
  //   if (cates.indexOf(result[idx].category) == -1) {
  //     cates.push({
  //       title: result[idx].category,
  //       num: 8
  //     });
  //   }
  // }
}