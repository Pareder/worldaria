import { readFileSync } from 'fs'
import path from 'path'

const geoData = JSON.parse(readFileSync(path.resolve('../client/public/json/full.json')))
// TODO: uncomment when Node.js will support JSON modules https://nodejs.org/docs/latest-v18.x/api/esm.html#json-modules
// import geoData from 'client/public/json/full.json' assert { type: 'json' }

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

export default Geo
