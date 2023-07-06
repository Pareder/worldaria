import WeatherAPI from '../index'

const weatherAPIMock = 'weather.com'
const weatherKeyMock = 'key'
const response = {
  data: {
    current_condition: [{
      temp_C: 1,
      weatherDesc: [{
        value: 'desc'
      }]
    }]
  }
}
const getFetch = () => jest.fn(() => ({
  json: jest.fn(() => response)
}))

function getModel({ weatherAPI, weatherKey, fetch } = {}) {
  return new WeatherAPI(weatherAPI || weatherAPIMock, weatherKey || weatherKeyMock, fetch || getFetch())
}

describe('WeatherAPI', () => {
  describe('create static method', () => {
    it('Should return an instance of WeatherAPI', () => {
      expect(WeatherAPI.create()).toBeInstanceOf(WeatherAPI)
    })
  })

  describe('getWeatherByCity', () => {
    it('Should call fetch with correct parameters', async () => {
      const fetch = getFetch()
      const model = getModel({ fetch })
      await model.getWeatherByCity('city')

      expect(fetch).toBeCalledWith(`${weatherAPIMock}/weather.ashx?q=city&format=JSON&fx=no&mca=no&key=${weatherKeyMock}`)
    })

    it('Should not call fetch if weather for passed city exists', async () => {
      const fetch = getFetch()
      const model = getModel({ fetch })
      model._weather = {
        city: {
          date: Date.now()
        }
      }
      await model.getWeatherByCity('city')

      expect(fetch).not.toBeCalled()
    })

    it('Should call fetch if weather for passed city exists and its date is more than 1 day ago', async () => {
      const fetch = getFetch()
      const model = getModel({ fetch })
      model._weather = {
        city: {
          date: new Date().setDate(new Date().getDate() - 2)
        }
      }
      await model.getWeatherByCity('city')

      expect(fetch).toBeCalled()
    })

    it('Should return correct result', async () => {
      const model = getModel()
      const result = await model.getWeatherByCity('city')

      expect(result).toEqual({
        c: response.data.current_condition[0].temp_C,
        desc: response.data.current_condition[0].weatherDesc[0].value,
        date: expect.any(Number)
      })
    })
  })
})