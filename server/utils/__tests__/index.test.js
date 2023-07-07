import { compareRandom } from '../index'

describe('utils', () => {
  describe('compareRandom method', () => {
    it('Should return number between -0.5 and 0.5', () => {
      const number = compareRandom()

      expect(number).toBeGreaterThanOrEqual(-0.5)
      expect(number).toBeLessThanOrEqual(0.5)
    })
  })
})