
const { Client, Intents } = require('discord.js')
const { token } = require('./bot-config.json')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
})

module.exports = client

require('./handler')(client)
client.login(token)
