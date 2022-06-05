import { compareRandom, randomColor } from '../../utils'

describe('utils', () => {
  describe('compareRandom method', () => {
    it('Should return number between -0.5 and 0.5', () => {
      const number = compareRandom()

      expect(number).toBeGreaterThanOrEqual(-0.5)
      expect(number).toBeLessThanOrEqual(0.5)
    })
  })

  describe('randomColor method', () => {
    it('Should return string containing rgb', () => {
      expect(randomColor()).toMatch('rgb')
    })

    it('Should return string containing numbers between 0 and 255', () => {
      const result = randomColor().match(/\((.*)\)/).pop().split(',')

      for (const number of result) {
        expect(Number(number)).toBeGreaterThanOrEqual(0)
        expect(Number(number)).toBeLessThanOrEqual(255)
      }
    })
  })
})