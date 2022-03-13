const Router = require('@koa/router');


function MessagesRouter(chat) {
    const _Router = new Router();

    _Router.get('/messages', async (ctx) => {
        streamEvents(ctx.req, ctx.res, {
            async fetch(lastEventId) {
                console.log(lastEventId);
                return [];
            },
            stream(sse) {
                sse.sendEvent({data: 'hello world'});
                return () => {
                };
            }
        });
        ctx.respond = false; // koa не будет обрабатывать ответ
    });

    return _Router
}

module.exports = MessagesRouter

