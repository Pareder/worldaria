const getRandomNumber = range => {
  return Math.floor(Math.random() * range)
}

exports.compareRandom = () => {
  return Math.random() - 0.5
}

exports.getCookie = name => {
  const matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)")
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

exports.randomColor = () => {
  return `rgb(${getRandomNumber(255)},${getRandomNumber(255)},${getRandomNumber(255)})`
}