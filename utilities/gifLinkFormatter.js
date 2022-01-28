const dataSource = require('./gifDataSource')

const randomizer = (values) => {
  let pickedUrl, randomNumber = Math.random(), threshold = 0

  for (let i = 0; i < values.length; i++) {
    if (values[i].probability === '*') {
      continue
    }
    threshold += values[i].probability
    if (threshold > randomNumber) {
      pickedUrl = values[i].url
      break
    }

    if (!pickedUrl) {
      // pick a wildcard element
      pickedUrl = values.filter(value => value.probability === '*')
    }
  }
  console.log('pickedURL', pickedUrl)
  return pickedUrl
}

const gifLinkFormatter = () => {
  return randomizer(dataSource.sort(sortByProb))
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
