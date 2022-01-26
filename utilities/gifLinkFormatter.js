function gifLinkFormatter(userList) {
  if (!Array.isArray(userList) || userList.length === 0) {
    return `https://gfycat.com/memorableoilyamericanmarten`
  }
  // brooklyn 99
  if (userList >= 5) {
    return (
      `https://gfycat.com/antiquecomplicatedelkhound`
    )
  }
  // lotr
  return (
    `https://gfycat.com/memorableoilyamericanmarten`
  )
}

module.exports = gifLinkFormatter
