const Koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const rest = require('./rest');
const config = require('./config')

const SESS_CONFIG = {
    key: 'koa:sess',
    maxAge: 1000 * 60 * 2,
    overwriter: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
};

const app = new Koa();
app.keys = config.sessionKey;
// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// static file support:
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

// session
app.use(session(SESS_CONFIG, app));

// parse request body:
app.use(bodyParser());


// bind .rest() for ctx:
app.use(rest.restify());

// add controllers:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');