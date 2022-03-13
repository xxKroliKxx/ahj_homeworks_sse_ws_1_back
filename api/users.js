const Router = require('@koa/router');

function UserRouter(chat) {
    const _Router = new Router();

    _Router.post('/users', (ctx, next) => {
        let req = ctx.request.body
        const id = chat.addUser(req.name)
        if (id === "") {
            ctx.status = 400;
            ctx.body = 'the user exists'
            return
        }
        ctx.status = 201;
        ctx.body = {id: id}
    });

    _Router.get('/users', (ctx, next) => {
        ctx.body = chat.getUsers();
    });

    _Router.del('/users/:id', (ctx, next) => {
        const id = ctx.params.id
        chat.deleteUser(id)
        ctx.status = 200;
    });

    return _Router
}

module.exports = UserRouter

