module.exports = async(ctx, next) => {
  const Request = require('../models/Request');
  let cates = [];

  let result = await Request.getByIduser(1);
  
  for (const idx in result) {
    if (cates.indexOf(result[idx].category) == -1) {
      cates.push({
        title: result[idx].category,
        num: 8
      });
    }
  }

  ctx.state.data = cates;
}