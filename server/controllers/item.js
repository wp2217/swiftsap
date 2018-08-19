module.exports = async (ctx, next) => {
  const Request = require('../models/Request');
  let subCates = [];
  let argus = {iduser: 1, category: 'FICO'}

  await Request.getItem(argus).then((result) => {
    subCates = result;
  }).catch((err) => {
    subCates = null;
    subCates = err;
  })

  ctx.state.data = subCates;
}