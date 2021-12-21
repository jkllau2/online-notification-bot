module.exports = {
  name: 'message',
  execute(message) {
    if (message.content === "ping") {
      message.reply("pong");
    }
    message.guild.channels.cache.get(channelToWatchId).members.forEach((member) => {
      console.log(member.user)
    })
  }
}
