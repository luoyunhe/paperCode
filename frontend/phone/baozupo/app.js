const Koa = require('koa')
const router = require('koa-router')()
const koajwt = require('koa-jwt')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')

const errorHandle = require('./server/middlewares/errorHandle')
const sendHandle = require('./server/middlewares/sendHandle')

const user = require('./server/routes/user')
const secret = 'mysecret'
const app = new Koa()
app.use(koaStatic('./dist'))
app.use(bodyParser())
app.use(sendHandle())
app.use(errorHandle)
app.use(koajwt({
  secret
}).unless({
  path: [/\/api\/register/, /\/api\/login/]
}))

router.use('/api', user.routes())
app.use(router.routes())

app.listen('3001', () => {
  console.log('koa is listening in 3001')
})
