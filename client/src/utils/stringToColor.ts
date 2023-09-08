export default function stringToColor(str: unknown = '') {
  if(typeof str !== 'string') {
    return '#000000'
  }
  let hash = 0
  for(let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for(let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    color += ('00' + value.toString(16)).substr(-2)
  }

  return color
}
