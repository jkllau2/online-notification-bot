const { channelId, targetOnlineMembersCount, whiteListIds } = require('../config.json')
const client = require('../index')

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const { username } = newState.member.user
    if (oldState.channelId === null && newState.channelId === channelId) {
      console.log(`${username} joined specific channel`, newState.channelId)

    } else if (oldState.channelId === null && newState.channelId !== channelId) {
      console.log(`${username} joined nonspecific channel`, newState.channelId)

    } else if (newState.channelId === null) {
      console.log(`${username} left channel`, oldState.channelId)
    }

    const memberList = (newState.guild.channels.cache.get(channelId).members).map((member => member))
    const { name: channelName } = newState.guild.channels.cache.get(channelId)

    if (memberList.length >= targetOnlineMembersCount) {

      let membersOnline = []
      memberList.map((member) => {
        const { user: { id, username } } = member
        membersOnline.push({ id, username })
      })
      const usernamesOnline = membersOnline.map(m => m.username)

      whiteListIds.forEach((id) => {
        client.users.cache.get(id).send(`More than ${targetOnlineMembersCount} members are online in ${channelName}! ${usernamesOnline.join(', ')}`)
      })
    }
  }
}