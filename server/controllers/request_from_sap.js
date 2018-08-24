module.exports = async ctx => {
  // 获取上传之后的结果
  // 具体可以查看：

  var datetime = new Date();

  console.log('requestFromSAP 1' + ctx.request.body + datetime);
  console.log('requestFromSAP 2' + JSON.stringify(ctx.request.body));

  ctx.state.data = { flag: 'OK' };
  ctx.response.body = `<h3>Hello, ${ctx.request.body}!</h3>`;

}

