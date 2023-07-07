import { notify } from '@kyvg/vue3-notification'
import type { NotificationsOptions } from '@kyvg/vue3-notification'
import type { FeatureCollection } from 'geojson'

class API {
  constructor(
    private http: typeof fetch,
    private notifyFn: (args: NotificationsOptions | string) => void,
    private storage: Storage
  ) {}

  static create() {
    return new API(fetch, notify, localStorage)
  }

  getGeoJSON(name: string) {
    return new Promise(resolve => {
      this.http(`../json/${name}.json`)
        .then<FeatureCollection>(response => response.json())
        .then(data => {
          resolve(data.features)
        })
        .catch(error => {
          this.notifyFn({
            group: 'error',
            type: 'error',
            title: 'Something bad happened',
            text: error.message
          })
          resolve([])
        })
    })
  }

  async getFullJSON() {
    return await this.getJSONWithStorage('fullJSON', 'full')
  }

  async getMapJSON() {
    return await this.getJSONWithStorage('mapJSON', 'map')
  }

  async getTimezoneJSON() {
    return await this.getJSONWithStorage('timezoneJSON', 'timezones')
  }

  private getJSONWithStorage(itemName: string, jsonName: string) {
    return new Promise(resolve => {
      const json = this.storage.getItem(itemName)

      if (json) {
        resolve(JSON.parse(json))
      } else {
        this.getGeoJSON(jsonName)
          .then(data => {
            this.storage.setItem(itemName, JSON.stringify(data))
            resolve(data)
          })
      }
    })
  }
}

const api = API.create()

export { API }

export default api