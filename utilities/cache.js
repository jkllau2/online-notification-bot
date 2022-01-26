const NodeCache = require('node-cache')
const voiceChannelCache = new NodeCache({
  stdTTL: 60 * 5,
  checkperiod: 120
})

module.exports = voiceChannelCache