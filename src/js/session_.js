const uuid = require('uuid')
const Message = require('./message')

class Session {
    constructor(userID_1, userID_2) {
        this.id = uuid.v4()
        this.users = [userID_1, userID_2]
        this.communication = []
    }

    addMessages(userID, text) {
        const message = new Message(userID, new Date(), text)
        this.communication.push(message)
        return this.communication.length - 1
    }

    getMessages(id) {
        if (id === -1) {
            return this.communication
        }
        return this.communication.slice(id)
    }
}

module.exports = Session