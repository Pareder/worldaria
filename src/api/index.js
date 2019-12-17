import Vue from 'vue'

class API {
  constructor(http, notify, localStorage) {
    this._http = http
    this._notify = notify
    this._localStorage = localStorage
  }

  static create() {
    return new API(Vue.http, Vue.notify, localStorage)
  }

  getGeoJSON(name) {
    return new Promise(resolve => {
      this._http.get(`../json/${name}.json`)
        .then(response => {
          resolve(response.body.features)
        })
        .catch(error => {
          this._notify({
            group: 'error',
            type: 'error',
            title: 'Something bad happened',
            text: error.message
          })
          resolve()
        })
    })
  }

  async getFullJSON() {
    return await this._getJSONWithLocalStorage('fullJSON', 'full')
  }

  async getMapJSON() {
    return await this._getJSONWithLocalStorage('mapJSON', 'map')
  }

  async getTimezoneJSON() {
    return await this._getJSONWithLocalStorage('timezoneJSON', 'timezones')
  }

  _getJSONWithLocalStorage(itemName, jsonName) {
    return new Promise(resolve => {
      const json = this._localStorage.getItem(itemName)

      if (json) {
        resolve(JSON.parse(json))
      } else {
        this.getGeoJSON(jsonName)
          .then(data => {
            this._localStorage.setItem(itemName, JSON.stringify(data))
            resolve(data)
          })
      }
    })
  }
}

export default API