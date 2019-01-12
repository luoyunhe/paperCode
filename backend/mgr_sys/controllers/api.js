const model = require('../model')
const APIError = require('../rest').APIError;

module.exports = {
    //login接口
    'POST /api/login': async (ctx, next) => {
        let resp = {};
        let userName = ctx.request.body.userName || '';
        let passwd = ctx.request.body.passwd || '';
        if (userName === '' || passwd === '') {
            resp.code = -1;
            resp.msg = 'param error';
            ctx.rest(resp);
            return
        }
        let usersFound = await model.user.findAll({
            where: { name: userName }
        });
        if (usersFound.length == 0) {
            resp.code = -1;
            resp.msg = 'no this user';
            ctx.rest(resp);
            return
        }
        let userFound = usersFound[0];
        if (userFound.passwd !== passwd) {
            resp.code = -1;
            resp.msg = 'passwd mismatch';
            ctx.rest(resp);
            return
        }
        ctx.rest({
            code: 0,
            msg: 'ok'
        });
        console.log('lol', ctx.session)
        ctx.session.userName = userName;
    },
    //register
    'POST /api/register': async (ctx, next) => {
        let resp = {};
        let userName = ctx.request.body.userName || '';
        let passwd = ctx.request.body.passwd || '';
        if (userName === '' || passwd === '') {
            resp.code = -1;
            resp.msg = 'param error';
            ctx.rest(resp);
            return
        }
        let usersFound = await model.user.findAll({
            where: { name: userName }
        });
        if (usersFound.length > 0) {
            resp.code = -1;
            resp.msg = `userName has been registered`;
            ctx.rest(resp);
            return
        }
        let user = await model.user.create({
            name: userName,
            passwd: passwd
        });
        ctx.rest({
            code: 0,
            msg: 'ok'
        });

    }
};
