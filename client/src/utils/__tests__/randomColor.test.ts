import randomColor from '../randomColor'

describe('randomColor utils', () => {
  it('Should return string containing rgb', () => {
    expect(randomColor()).toMatch('rgb')
  })

  it('Should return string containing numbers between 0 and 255', () => {
    const colors = randomColor().match(/\((.*)\)/)
    const numbers = ((colors || []).pop() || '').split(',')

    for (const number of numbers) {
      expect(Number(number)).toBeGreaterThanOrEqual(0)
      expect(Number(number)).toBeLessThanOrEqual(255)
    }
  })
})
