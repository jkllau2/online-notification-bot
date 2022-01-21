const nodeCache = require('../utilities/cache')
const NotificationVendor = require('../utilities/messageSender')

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const { username: newStateUsername } = newState.member.user
    const {
      channelId,
      vcMinCount,
      vcMaxCount,
      whiteListIds
    } = global.config

    if (oldState.channelId === null && newState.channelId === channelId) {
      console.log(`${newStateUsername} joined specific channel`, newState.channelId)

      const vcMemberList = (newState.guild.channels.cache.get(channelId).members).map((member => member))
      const { name: channelName } = newState.guild.channels.cache.get(channelId)

      // if members in voice channel between min & max number set in config
      if (vcMemberList.length >= vcMinCount && vcMemberList.length <= vcMaxCount) {

        let vcUsersOnline = []
        for (let member of vcMemberList) {
          const { user: { id, username } } = member
          vcUsersOnline.push({ id, username })
        }
        const vcUserNameList = vcUsersOnline.map(m => m.username)
        const currentTime = Date.now()
        const timeThreshold = 30 * 60 * 1000
        const ttl = 60 * 60
        // for each member in whitelist, send notification to each person
        const recipientMap = new Map()
        for (let i = 0; i < whiteListIds.length; i++) {
          const { id, username } = whiteListIds[i]
          if (!recipientMap.has(id)) {
            recipientMap.set(id, { id, username, shouldSend: true })
          }
        }

        for (let { id, username } of vcUsersOnline) {
          if (recipientMap.has(id)) {
            recipientMap.set(id, { ...recipientMap.get(id), username, shouldSend: false })
          }
        }

        const Vendor = new NotificationVendor(channelName, vcUserNameList)
        console.log(recipientMap)
        recipientMap.forEach((recipient) => {
          const { id = '', username = 'unknown', shouldSend } = recipient

          if (shouldSend) {
            if (!nodeCache.get(`${id}`)) {
              nodeCache.set(`${id}`, { loggedTime: currentTime }, ttl)
              console.log(`Saved in cache for user: [${username}] at UnixTimeStamp: ${currentTime}`)
              Vendor.send(id)
            } else if ((currentTime - nodeCache.get(`${id}`) >= timeThreshold)) {
              Vendor.send(id)
              console.log(`Updating cache with new timestamp for user: [${username}]`)
              nodeCache.set(`${id}`, { loggedTime }, ttl)
            } else {
              console.log(`It\'s too soon to send a notification for member: ${username}`)
            }
          } else {
            console.log(`User: [${username}] is already in voice chat, notification will be paused.`)
          }
        })
      }

    } else if (oldState.channelId === null && newState.channelId !== channelId) {
      console.log(`${newStateUsername} joined nonspecific channel`, newState.channelId)

    } else if (newState.channelId === null) {
      console.log(`${newStateUsername} left channel`, oldState.channelId)
    }
  }
}