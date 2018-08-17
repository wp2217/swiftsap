const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const soap = require('soap')
const http = require('http')

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())
// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
// app.listen(config.port, () => debug(`listening on port ${config.port}`));
var server = http.createServer(app.callback())
server.listen(config.port, () => debug(`listening on port ${config.port}`))

// 启动WebService监听
const ZOA = require('./webservices/ZOARequestAction.js')
var wsZOA = ZOA()
server = soap.listen(server, '/service/ZOARequestAction', wsZOA.ws, wsZOA.xml)
server.authorizeConnection = function (req) {
    return true // or false
}
