// @ts-ignore
import colors from 'vuetify/lib/util/colors'

export const MY_COLOR = colors.blue.base
export const ENEMY_COLOR = colors.red.base

function getLuminance(hexColor: string) {
  // Convert the hex color to RGB values
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Calculate luminance using the relative luminance formula
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

// Function to determine contrast color
export function getContrastColor(hexColor: string) {
  const luminance = getLuminance(hexColor)
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
