const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const userRouter = require("./users");
const sessionRouter = require("./session_");
const messageRouter = require("./message");

function api(chat) {
    const appV1 = new Koa();
    appV1.use(bodyParser());
    appV1.use(userRouter(chat).routes())
    appV1.use(messageRouter(chat).routes())

    return appV1
}

function wsRequest(chat, data, ws) {
    let enc = new TextDecoder();
    const requestStructure = JSON.parse(enc.decode(data))
    switch (requestStructure.operation) {
        case 'registration':
            const userID = chat.addUser(requestStructure.name)
            if (userID === "") {
                ws.send(JSON.stringify({operation: 'registration', success: false, error: 'user exists'}))
                break
            }
            chat.addClient(userID, ws)
            ws.send(JSON.stringify({operation: 'registration', success: true, user_id: userID}))

            const usersList_1 = chat.getUsers()
            for (let client of chat.clients) {
                if (client[0] !== userID) {
                    client[1].send(JSON.stringify({operation: 'users-list', success: true, users_list: usersList_1}))
                }
            }
            break
        case 'users-list':
            const usersList_2 = chat.getUsers()
            ws.send(JSON.stringify({operation: 'users-list', success: true, users_list: usersList_2}))
            break
        case 'chat-info':
            const chaSessionID = chat.createSession(requestStructure.user_id, requestStructure.recipient_id)
            const messages = chat.sessionMessages(chaSessionID, -1)
            let chatResp = []
            messages.forEach((m) => {
                chatResp.push({
                    user_id: m.userID,
                    time: m.time,
                    text: m.text,
                })
            })
            ws.send(JSON.stringify({operation: 'chat-info', success: true, messages: chatResp}))
            break
        case 'send-message':
            const sendSessionID = chat.createSession(requestStructure.user_id, requestStructure.recipient_id)
            let messageIndex = chat.addMessage(sendSessionID, requestStructure.user_id, requestStructure.message)
            let message = chat.sessionMessages(sendSessionID, messageIndex)[0]
            let c1 = chat.getClient(requestStructure.user_id)
            let c2 = chat.getClient(requestStructure.recipient_id)
            const resp = {
                operation: 'output-message',
                success: true,
                message: {
                    user_id: message.userID,
                    time: message.time,
                    text: message.text,
                }
            }
            c1.send(JSON.stringify(resp))
            c2.send(JSON.stringify(resp))
            break
        default:
            break
    }

}

function wsClose(chat, ws) {
    for (let client of chat.clients) {
        if (client[1] === ws) {
            chat.deleteUser(client[0])
            chat.clients.delete(client[0])
        }
    }

    const usersList_1 = chat.getUsers()
    for (let client of chat.clients) {
        client[1].send(JSON.stringify({operation: 'users-list', success: true, users_list: usersList_1}))
    }
}


module.exports.httpApi = api
module.exports.wsRequest = wsRequest
module.exports.wsClose = wsClose
