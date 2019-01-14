const Koa = require('koa')
const router = require('koa-router')()
const koajwt = require('koa-jwt')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')

const errorHandle = require('./server/middlewares/errorHandle')
const sendHandle = require('./server/middlewares/sendHandle')

const api = require('./server/routes/api')
const jwtConfig = require('./server/config/jwtConfig')
let jwtSecret = jwtConfig.jwtSecret
const app = new Koa()
app.use(koaStatic('./dist'))
app.use(bodyParser())
app.use(sendHandle())
app.use(errorHandle)
app.use(koajwt({
  secret: jwtSecret
}).unless({
  path: [/\/api\/register/, /\/api\/login/]
}))

router.use('/api', api.routes())
app.use(router.routes())

app.listen('3001', () => {
  console.log('koa is listening in 3001')
})
