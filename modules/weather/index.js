const fetch = require('node-fetch')
const url = require('url')

// WEATHER API from https://www.worldweatheronline.com
class WeatherAPI {
  constructor(weatherAPI, weatherKey, fetch) {
    this._weatherAPI = weatherAPI
    this._weatherKey = weatherKey
    this._fetch = fetch
    this._weather = {}
  }

  static create(weatherAPI, weatherKey) {
    return new WeatherAPI(weatherAPI, weatherKey, fetch)
  }

  async getWeatherByCity(city) {
    if (!this._weather[city] || this._weather[city].date < new Date().setDate(new Date().getDate() - 1)) {
      const response = await this._fetch(url.format({
        host: this._weatherAPI,
        pathname: '/weather.ashx',
        query: {
          q: city,
          format: 'JSON',
          fx: 'no',
          mca: 'no',
          key: this._weatherKey
        }
      }))
      const json = await response.json()
      this._weather[city] = {
        c: json.data.current_condition[0].temp_C,
        desc: json.data.current_condition[0].weatherDesc[0].value,
        date: Date.now()
      }
    }

    return this._weather[city];
  }

  setWeatherKey(weatherKey) {
    this._weatherKey = weatherKey
  }
}

module.exports = WeatherAPI
