import path from 'path'
import App from '../index'
import expressMock from '../__mocks__/ExpressMock'

const CONFIG = {
  nodeMailerOptions: {
    host: 'host.com',
    port: 1,
    secure: false,
    auth: {
      user: 'user',
      pass: 'pass'
    }
  },
  weatherDate: [2019, 1, 1]
}
const getMailer = () => ({
  makeTask: jest.fn()
})

function getModel({config, mailer, express, history, compression} = {}) {
  return new App(
    config || CONFIG,
    mailer || getMailer(),
    express || expressMock,
    history || jest.fn(),
    compression || jest.fn()
  )
}

describe('App', () => {
  describe('create static method', () => {
    it('Should return an instance of App', () => {
      expect(App.create(CONFIG)).toBeInstanceOf(App)
    })
  })

  describe('init method', () => {
    it('Should call cron makeTask with correct parameter', () => {
      const mailer = getMailer()
      const app = getModel({mailer})
      app.init()

      expect(mailer.makeTask).toBeCalledWith(new Date(...CONFIG.weatherDate))
    })

    it('Should call express static with correct parameters', () => {
      const pathname = '/path'
      const express = expressMock
      const app = getModel({express})
      app.init(pathname)

      expect(express.static).toBeCalledWith(
        expect.stringContaining(path.join('worldaria/app/path')),
        expect.any(Object)
      )
    })
  })
})