const geoData = require('../../dist/json/full.json')

class Geo {
  constructor(geoData) {
    this._geoData = geoData
    this._countries = []
    this._capitals = []

    this.init()
  }

  static create() {
    return new Geo(geoData)
  }

  init() {
    for (const feature of this._geoData.features) {
      this._countries.push(feature.properties.name)
      this._capitals.push(feature.properties.capital)
    }
  }

  getGeoData() {
    return this._geoData
  }

  getCountries() {
    return this._countries
  }

  getCapitals() {
    return this._capitals
  }
}

module.exports = Geo
