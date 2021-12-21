const { channelToWatchId, targetOnlineMembers } = require('../config.json')
const client = require('../index')

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const { username } = newState.member.user
    if (oldState.channelId === null && newState.channelId === channelToWatchId) {
      console.log(`${username} joined specific channel`, newState.channelId)

    } else if (oldState.channelId === null && newState.channelId !== channelToWatchId) {
      console.log(`${username} joined nonspecific channel`, newState.channelId)

    } else if (newState.channelId === null) {
      console.log(`${username} left channel`, oldState.channelId)
    }

    const memberList = (newState.guild.channels.cache.get(channelToWatchId).members).map((member => member))
    const { name: channelName } = newState.guild.channels.cache.get(channelToWatchId)

    if (memberList.length >= targetOnlineMembers) {

      let membersOnline = []
      memberList.map((member) => {
        const { user: { id, username } } = member
        membersOnline.push({ id, username })
      })
      const usernamesOnline = membersOnline.map(m => m.username)
      const whiteList = [
        '111985731932561408',
        '786088508049195018'
      ]
      whiteList.map((id) => {
        client.users.cache.get(id).send(`More than ${targetOnlineMembers} members are online in ${channelName}! ${usernamesOnline.join(', ')}`)
      })
    }
  }
}