const Koa = require('koa');
const http = require('http');
const mount = require('koa-mount');
const cors = require('@koa/cors');
const WebSocketServer = require('ws');

const Chat = require('./src/js/chat');
const api = require('./api/api')


const chat = new Chat()

const app = new Koa();
app.use(cors());
app.use(mount('/v1', api.httpApi(chat)));

const port = process.env.PORT || 80
const server = http.createServer(app.callback())
const wsServer = new WebSocketServer.Server({server});

wsServer.on('connection', function connection(ws, req) {
    ws.on('message', function message(data) {
        api.wsRequest(chat, data, ws)
    });

    ws.on('close', () => api.wsClose(chat, ws))
});

server.listen(port);
console.log('server: port: ' + port)
