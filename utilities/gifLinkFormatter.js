const dataSource = require('./gifDataSource')

const randomizer = (options) => {
  let i, weights = []

  for (i = 0; i < options.length; i++) {
    weights[i] = options[i].probability + (weights[i - 1] || 0)
  }

  let random = Math.random() * weights[weights.length - 1]

  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random)
      break
  }

  return options[i].url
}

const gifLinkFormatter = () => {
  return randomizer(dataSource)
}

module.exports = gifLinkFormatter
