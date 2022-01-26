const { vcMinCount } = global.config
const client = require('../index')
const gifLinkFormatter = require('./gifLinkFormatter')

class MessageSender {
  constructor(channelName, onlineUsersList) {
    this.channelName = channelName || 'general'
    this.onlineUsersList = onlineUsersList || []
  }

  formattedMessage() {
    const channelName = this.channelName
    const usernamesOnline = this.onlineUsersList
    const gifLink = gifLinkFormatter(usernamesOnline)

    return (
      `We have a ${usernamesOnline.length} stack! \n` +
      `More than ${vcMinCount} member(s) are online in ${channelName}! [${usernamesOnline.join(', ')}] \n` +
      '\n' +
      gifLink
    )
  }

  async send(id) {
    const userId = `${id}` || ''
    try {
      await client.users.cache.get(userId).send(this.formattedMessage())
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = MessageSender