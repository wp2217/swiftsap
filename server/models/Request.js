const { mysql } = require('../qcloud');
const { zutil } = require('../util/zutil.js');

const request = {
    async getByIduser(args) {
        let result = await mysql('REQUEST').select();
        return result;
    }
}

module.exports = request;

// var zdata = {
//   requestList: null,
//   cates: [
//     {
//       title: "采购",
//       num: 35
//     },
//     {
//       title: "销售来自后台",
//       num: 15,
//     },
//     {
//       title: "物料",
//       num: 3,
//     },
//     {
//       title: "人力资源",
//       num: 135,
//     },
//     {
//       title: "Product Management",
//       num: 3,
//     },
//     {
//       title: "Master Data",
//       num: 135,
//     },
//     {
//       title: "其它",
//       num: 35,
//     }
//   ]
// };