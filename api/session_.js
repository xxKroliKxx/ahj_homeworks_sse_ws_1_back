const Router = require('@koa/router');

function SessionRouter(chat) {
    const _Router = new Router();

    _Router.post('/session', (ctx, next) => {
        const req = ctx.request.body
        const id = chat.createSession(req.sender, req.addressee)
        ctx.status = 201;
        ctx.body = {id: id}
    });

    return _Router
}

module.exports = SessionRouter

