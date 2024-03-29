import express from 'express'
import path from 'path'
import history from 'connect-history-api-fallback'
import compression from 'compression'

import Cron from '../modules/cron'
import Mailer from '../modules/mailer'

class App {
  constructor(config, cron, express, history, compression) {
    this._config = config
    this._cron = cron
    this._express = express
    this._history = history
    this._compression = compression
    this._app = express()

    this.init()
  }

  static create(config, weather) {
    const mailer = Mailer.create(config)
    const cron = Cron.create(mailer, weather)

    return new App(config, cron, express, history, compression)
  }

  init(pathname = '../client/dist') {
    this._cron.makeTask(new Date(...this._config.weatherDate))

    const staticFileMiddleware = this._express.static(path.resolve(pathname), {
      maxAge: 604800000,
      setHeaders: function (res) {
        res.setHeader('X-FRAME-OPTIONS', 'DENY')
        res.setHeader('X-XSS-Protection', '1; mode=block')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Cache-Control', 'max-age=604800000')
        res.setHeader('Referrer-Policy', 'no-referrer')
        res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString())
      },
    })

    this._app.use(this._compression())
    this._app.use(staticFileMiddleware)
    this._app.use(this._history())
    this._app.use(staticFileMiddleware)
    this._app.use(this._express.json())
    this._app.get('/', (req, res) => {
      res.sendFile(path.resolve(`${pathname}/index.html`))
    })
  }

  getApp() {
    return this._app
  }
}

export default App
