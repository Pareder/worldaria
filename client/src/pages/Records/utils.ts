import { populationOptions } from '@/config'

export function getTypeIcon(type: 'name' | 'capital' | 'flag' | 'area') {
  switch (type) {
    case 'name':
      return 'mdi-earth'
    case 'capital':
      return 'mdi-city'
    case 'flag':
      return 'mdi-flag'
    case 'area':
      return 'mdi-image-area'
  }
}

export function getSort(sort: string) {
  return populationOptions.find(option => String(option.value) === String(sort))?.title || ''
}

export function getModeColor(mode: 'easy' | 'hard' | 'extreme' | 'impossible') {
  switch (mode) {
    case 'easy':
      return 'green'
    case 'hard':
      return 'yellow'
    case 'extreme':
      return 'orange'
    case 'impossible':
      return 'red'
  }
}
