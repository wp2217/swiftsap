module.exports = async (ctx, next) => {
  const Request = require('../models/Request');
  let cates = [];

  await Request.getByIduser(1).then((result) => {
    for (const idx in result) {
      if (cates.indexOf(result[idx].category) == -1) {
        cates.push({
          title: result[idx].category,
          num: 8
        });
      }
    }
  }).catch((err) => {
    ctx.state.data = err;
  })


  // let result = await Request.getByIduser(1);

  // for (const idx in result) {
  //   if (cates.indexOf(result[idx].category) == -1) {
  //     cates.push({
  //       title: result[idx].category,
  //       num: 8
  //     });
  //   }
  // }

  //ctx.state.data = cates;
}