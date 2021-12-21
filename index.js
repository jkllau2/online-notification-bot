
const { Client, Intents } = require('discord.js')
const { token } = require('./config.json')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
})

module.exports = client

// const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
// for (const file of eventFiles) {
//   const event = require(`./events/${file}`)
//   if (event.once) {
//     client.once(event.name, (...args) => event.execute(...args))
//   } else {
//     client.on(event.name, (...args) => event.execute(...args))
//   }
// }
require('./handler')(client)

client.login(token)
