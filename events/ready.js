const { whiteListIds } = require('../config.json')

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    whiteListIds.forEach((memberId) => {
      client.users.fetch(memberId)
      console.log(`Client data fetched for memberId: ${memberId}`)
    })
    console.log(`Ready! Logged in as ${client.user.tag}`)
  },
}
