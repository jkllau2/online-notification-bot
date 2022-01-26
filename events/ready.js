const { whiteListIds } = global.config

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    for (let i = 0; i < whiteListIds.length; i++) {
      const { id, username } = whiteListIds[i]
      try {
        await client.users.fetch(id)
        console.log(`Client data fetched for whitelisted user: ${username}`)
      } catch (error) {
        console.log(error)
      }
    }
    console.log(`Ready! Logged in as ${client.user.tag}`)
  },
}
