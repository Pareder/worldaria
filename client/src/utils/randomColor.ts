function getRandomNumber(range: number) {
  return Math.floor(Math.random() * range)
}

export default function randomColor() {
  return `rgb(${getRandomNumber(255)},${getRandomNumber(255)},${getRandomNumber(255)})`
}
