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
        const userIdsOnline = membersOnline.map(m => m.id)
        const loggedTime = Date.now()
        const ttl = 60 * 60
        // for each member in whitelist, send notification to each person
        whiteListIds.forEach((whiteListId) => {
          // If id does not exist in Cache yet
          if (!nodeCache.get(`${whiteListId}`)) {
            for (let i = 0; i < userIdsOnline.length; i++) {
              if (whiteListId !== userIdsOnline[i]) {
                nodeCache.set(`${whiteListId}`, { loggedTime }, ttl)
                console.log(`Saved in cache for userId: ${whiteListId} at UnixTimeStamp: ${loggedTime}`)
                client.users.cache.get(whiteListId).send(`We have a ${usernamesOnline.length} stack! More than ${minTargetOnlineMembersCount} members are online in ${channelName}! ${usernamesOnline.join(', ')}`)
              } else {
                console.log(`Unable to send notification for ${whiteListId}`)
              }
            }
          }
          // If 30mins has passed since last timestamp in Cache, then we send another notification
          else if ((Date.now() - nodeCache.get(`${whiteListId}`) >= 30 * 60 * 1000)) {
            for (let i = 0; i < userIdsOnline.length; i++) {
              if (whiteListId !== userIdsOnline[i]) {
                console.log('time passed - ', Date.now() - nodeCache.get(`${whiteListId}` >= 30 * 60 * 1000))
                console.log(`More than 30mins has passed, sending msg for id: ${whiteListId}`)
                client.users.cache.get(whiteListId).send(`More than ${minTargetOnlineMembersCount} members are online in ${channelName}! ${usernamesOnline.join(', ')}`)
                console.log('Updating cache with new timestamp')
                nodeCache.set(`${whiteListId}`, { loggedTime }, ttl)
              } else {
                console.log(`Unable to send notification for ${whiteListId}`)
              }
            }

          } else {
            console.log(`It\'s too soon to send a notification for member: ${whiteListId}`)
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