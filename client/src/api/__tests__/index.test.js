import API from '@/api'

const getHTTP = value => {
  return {
    get: jest.fn(async () => ({
      body: {
        features: value || []
      }
    }))
  }
}
const notifyMock = jest.fn()
const getLocalStorage = value => {
  return {
    getItem: jest.fn(() => value),
    setItem: jest.fn()
  }
}

function getModel({ http, notify, localStorage } = {}) {
  return new API(http || getHTTP(), notify || notifyMock, localStorage || getLocalStorage())
}

describe('API', () => {
  describe('create static method', () => {
    it('Should return an instance of API', () => {
      expect(API.create()).toBeInstanceOf(API)
    })
  })

  describe('getGeoJSON method', () => {
    it('Should call http get with correct parameter', async () => {
      const http = getHTTP()
      const model = getModel({ http })
      await model.getGeoJSON('name')

      expect(http.get).toBeCalledWith('../json/name.json')
    })

    it('Should call notify with correct parameters in case of error', async () => {
      const errorMessage = 'error message'
      const http = {
        get: jest.fn(async () => {
          throw new Error(errorMessage)
        })
      }
      const notify = jest.fn()
      const model = getModel({ http, notify })
      await model.getGeoJSON('name')

      expect(notify).toBeCalledWith({
        group: 'error',
        type: 'error',
        title: 'Something bad happened',
        text: errorMessage
      })
    })

    it('Should return correct result', async () => {
      const value = [1, 2, 3]
      const http = getHTTP(value)
      const model = getModel({ http })
      const result = await model.getGeoJSON('name')

      expect(result).toEqual(value)
    })
  })

  describe('getFullJSON method', () => {
    it('Should call localStorage getItem with correct parameter', async () => {
      const localStorage = getLocalStorage()
      const model = getModel({ localStorage })
      await model.getFullJSON()

      expect(localStorage.getItem).toBeCalledWith('fullJSON')
    })

    it('Should return parsed value if stored in localStorage', async () => {
      const value = 'localStorageValue'
      const localStorage = getLocalStorage(JSON.stringify(value))
      const model = getModel({ localStorage })
      const result = await model.getFullJSON()

      expect(result).toEqual(value)
    })

    it('Should call http get with correct parameter if not stored in localStorage', async () => {
      const http = getHTTP()
      const model = getModel({ http })
      await model.getFullJSON()

      expect(http.get).toBeCalledWith('../json/full.json')
    })

    it('Should call localStorage setItem with correct parameter if not stored in localStorage', async () => {
      const value = [1, 2, 3]
      const http = getHTTP(value)
      const localStorage = getLocalStorage()
      const model = getModel({ http, localStorage })
      await model.getFullJSON()

      expect(localStorage.setItem).toBeCalledWith('fullJSON', JSON.stringify(value))
    })

    it('Should return correct value if not stored in localStorage', async () => {
      const value = [1, 2, 3]
      const http = getHTTP(value)
      const model = getModel({ http })
      const result = await model.getFullJSON()

      expect(result).toEqual(value)
    })
  })

  describe('getMapJSON method', () => {
    it('Should call localStorage getItem with correct parameter', async () => {
      const localStorage = getLocalStorage()
      const model = getModel({ localStorage })
      await model.getMapJSON()

      expect(localStorage.getItem).toBeCalledWith('mapJSON')
    })

    it('Should return parsed value if stored in localStorage', async () => {
      const value = 'localStorageValue'
      const localStorage = getLocalStorage(JSON.stringify(value))
      const model = getModel({ localStorage })
      const result = await model.getMapJSON()

      expect(result).toEqual(value)
    })

    it('Should call http get with correct parameter if not stored in localStorage', async () => {
      const http = getHTTP()
      const model = getModel({ http })
      await model.getMapJSON()

      expect(http.get).toBeCalledWith('../json/map.json')
    })

    it('Should call localStorage setItem with correct parameter if not stored in localStorage', async () => {
      const value = [1, 2, 3]
      const http = getHTTP(value)
      const localStorage = getLocalStorage()
      const model = getModel({ http, localStorage })
      await model.getMapJSON()

      expect(localStorage.setItem).toBeCalledWith('mapJSON', JSON.stringify(value))
    })

    it('Should return correct value if not stored in localStorage', async () => {
      const value = [1, 2, 3]
      const http = getHTTP(value)
      const model = getModel({ http })
      const result = await model.getMapJSON()

      expect(result).toEqual(value)
    })
  })

  describe('getTimezoneJSON method', () => {
    it('Should call localStorage getItem with correct parameter', async () => {
      const localStorage = getLocalStorage()
      const model = getModel({ localStorage })
      await model.getTimezoneJSON()

      expect(localStorage.getItem).toBeCalledWith('timezoneJSON')
    })

    it('Should return parsed value if stored in localStorage', async () => {
      const value = 'localStorageValue'
      const localStorage = getLocalStorage(JSON.stringify(value))
      const model = getModel({ localStorage })
      const result = await model.getTimezoneJSON()

      expect(result).toEqual(value)
    })

    it('Should call http get with correct parameter if not stored in localStorage', async () => {
      const http = getHTTP()
      const model = getModel({ http })
      await model.getTimezoneJSON()

      expect(http.get).toBeCalledWith('../json/timezones.json')
    })

    it('Should call localStorage setItem with correct parameter if not stored in localStorage', async () => {
      const value = [1, 2, 3]
      const http = getHTTP(value)
      const localStorage = getLocalStorage()
      const model = getModel({ http, localStorage })
      await model.getTimezoneJSON()

      expect(localStorage.setItem).toBeCalledWith('timezoneJSON', JSON.stringify(value))
    })

    it('Should return correct value if not stored in localStorage', async () => {
      const value = [1, 2, 3]
      const http = getHTTP(value)
      const model = getModel({ http })
      const result = await model.getTimezoneJSON()

      expect(result).toEqual(value)
    })
  })
})