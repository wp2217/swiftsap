module.exports = async (ctx, next) => {

  const { mysql } = require('../qcloud');
  const { zutil } = require('../util/zutil.js');

  var zdata = {
    requestList: null,
    cates: [
      {
        title: "采购",
        num: 35
      },
      {
        title: "销售来自后台",
        num: 15,
      },
      {
        title: "物料",
        num: 3,
      },
      {
        title: "人力资源",
        num: 135,
      },
      {
        title: "Product Management",
        num: 3,
      },
      {
        title: "Master Data",
        num: 135,
      },
      {
        title: "其它",
        num: 35,
      }
    ]
  };

  var that = this;

  console.log('\r\n ctx.query--\r\n');
  console.log(ctx.query);

  await mysql('REQUEST')
  .select()
  .then(function(result){
    console.log('\r\n zdate.resultList--\r\n');
    console.log(result);
    that.zdata.requestList = result;
    
    //result = result.sort(zutil.sortBy);
    for (const idx in result) {
      if (zdate.cates.indexOf(result[idx].category) == -1 ) {
        zdate.cates.push(result[idx].category);
      }
    }

    console.log('\r\n zdate.cates--\r\n');
    console.log(zdate.cates);

    that.ctx.state.data = that.zdata;

  })

  

}
