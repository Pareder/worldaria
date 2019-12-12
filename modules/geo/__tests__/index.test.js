import Geo from '../../geo'

const geoData = {
  features: [
    {
      properties: {
        name: 'name1',
        capital: 'capital1'
      }
    },
    {
      properties: {
        name: 'name2',
        capital: 'capital2'
      }
    }
  ]
}

describe('Geo', () => {
  describe('create static method', () => {
    it('Should return an instance of Geo', () => {
      expect(Geo.create()).toBeInstanceOf(Geo)
    })
  })

  describe('getGeoData method', () => {
    it('Should return correct result', () => {
      const geo = new Geo(geoData)

      expect(geo.getGeoData()).toEqual(geoData)
    })
  })

  describe('getCountries method', () => {
    it('Should return correct result', () => {
      const geo = new Geo(geoData)

      expect(geo.getCountries()).toEqual(['name1', 'name2'])
    })
  })

  describe('getCapitals method', () => {
    it('Should return correct result', () => {
      const geo = new Geo(geoData)

      expect(geo.getCapitals()).toEqual(['capital1', 'capital2'])
    })
  })
})