const getRandomNumber = range => {
  return Math.floor(Math.random() * range)
}

exports.compareRandom = () => {
  return Math.random() - 0.5
}

exports.randomColor = () => {
  return `rgb(${getRandomNumber(255)},${getRandomNumber(255)},${getRandomNumber(255)})`
}