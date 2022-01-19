const {
  channelId,
  minTargetOnlineMembersCount,
  maxTargetOnlineMembersCount,
  whiteListIds
} = require('../config.json')
const client = require('../index')
const nodeCache = require('../utilities/cache')

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const { username } = newState.member.user

    if (oldState.channelId === null && newState.channelId === channelId) {
      console.log(`${username} joined specific channel`, newState.channelId)

      const memberList = (newState.guild.channels.cache.get(channelId).members).map((member => member))
      const { name: channelName } = newState.guild.channels.cache.get(channelId)

      // if members in voice channel between min & max number set in config
      if (memberList.length >= minTargetOnlineMembersCount && memberList.length <= maxTargetOnlineMembersCount) {

        let membersOnline = []
        memberList.map((member) => {
          const { user: { id, username } } = member
          membersOnline.push({ id, username })
        })
        const usernamesOnline = membersOnline.map(m => m.username)
        const loggedTime = Date.now()
        const ttl = 60 * 60
        // for each member in whitelist, send notification to each person
        whiteListIds.forEach((id) => {
          // If id does not exist in Cache yet
          if (!nodeCache.get(`${id}`)) {
            nodeCache.set(`${id}`, { loggedTime }, ttl)
            console.log(`Saved in cache for userId: ${id} at UnixTimeStamp: ${loggedTime}`)
            client.users.cache.get(id).send(`More than ${minTargetOnlineMembersCount} members are online in ${channelName}! ${usernamesOnline.join(', ')}`)

          }
          // If 30mins has passed since last timestamp in Cache, then we send another notification
          else if ((Date.now() - nodeCache.get(`${id}`) >= 30 * 60 * 1000)) {
            console.log('time passed - ', Date.now() - nodeCache.get(`${id}` >= 30 * 60 * 1000))
            console.log(`More than 30mins has passed, sending msg for id: ${id}`)
            client.users.cache.get(id).send(`More than ${minTargetOnlineMembersCount} members are online in ${channelName}! ${usernamesOnline.join(', ')}`)
            console.log('Updating cache with new timestamp')
            nodeCache.set(`${id}`, { loggedTime }, ttl)

          } else {
            const [
              {
                username
              }
            ] = membersOnline.filter(x => x.id === id)
            console.log(`It\'s too soon to send a notification for member: ${username}`)
          }
        })
      }

    } else if (oldState.channelId === null && newState.channelId !== channelId) {
      console.log(`${username} joined nonspecific channel`, newState.channelId)

    } else if (newState.channelId === null) {
      console.log(`${username} left channel`, oldState.channelId)
    }
  }
}