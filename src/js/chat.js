const Session = require('./session_');
const User = require('./user')

class Chat {
    constructor() {
        this.sessions = new Map()
        this.users = new Map()
        this.clients = new Map()
    }

    addUser(name) {
        for (const user of this.users) {
            if (user[1].name === name) {
                return ""
            }
        }
        const user = new User(name)
        this.users.set(user.id, user)
        return user.id
    }

    deleteUser(userID) {
        const user = this.users.get(userID)
        if (user === undefined) {
            return
        }
        for (const session of this.sessions) {
            let index1 = session[1].users.indexOf(userID)
            if (index1 !== -1) {
                 this.sessions.delete(session[0])
            }
        }
        this.users.delete(userID)
    }

    getUsers() {
        return Array.from(this.users, ([key, value]) => ((key, value)))
    }

    createSession(userID_1, userID_2) {
        for (const session of this.sessions) {
            let index1 = session[1].users.indexOf(userID_1)
            let index2 = session[1].users.indexOf(userID_2)
            if (index1 !== -1 && index2 !== -1) {
                return session[0]
            }
        }
        const session = new Session(userID_1, userID_2)
        this.sessions.set(session.id, session)
        return session.id
    }

    sessionMessages(sessionID, messageIndex) {
        return this.sessions.get(sessionID).getMessages(messageIndex)
    }

    addMessage(sessionID, userID, message) {
        return this.sessions.get(sessionID).addMessages(userID, message)
    }

    addClient(userID, client) {
        this.clients.set(userID, client)
    }

    getClient(userID) {
        return this.clients.get(userID)
    }
}

module.exports = Chat

