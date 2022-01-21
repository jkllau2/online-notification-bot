const client = require('../index')
const { vcMinCount } = global.config

class MessageSender {
  constructor(channelName, onlineUsersList) {
    this.channelName = channelName || ''
    this.onlineUsersList = onlineUsersList || []
  }

  formattedMessage() {
    const channelName = this.channelName
    const usernamesOnline = this.onlineUsersList
    return (
      `We have a ${usernamesOnline.length} stack! \nMore than ${vcMinCount} member(s) are online in ${channelName}! [${usernamesOnline.join(', ')}]`
    )
  }

  send(id) {
    const userId = `${id}` || ''
    try {
      client.users.cache.get(userId).send(this.formattedMessage())
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = MessageSender