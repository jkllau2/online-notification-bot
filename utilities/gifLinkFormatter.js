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
  console.log('Url', options[i].url)
  return options[i].url
}

const gifLinkFormatter = () => {
  return randomizer(dataSource)
}

function sortByProb(a, b) {
  if (a.probability < b.probability) {
    return -1
  }
  if (a.probability > b.probability) {
    return 1
  }
  return 0
}

module.exports = gifLinkFormatter
