const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const compression = require('compression')
const Cron = require('../modules/cron')
const Mailer = require('../modules/mailer')

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

  init(pathname = '/../dist') {
    this._cron.makeTask(new Date(...this._config.weatherDate))

    const staticFileMiddleware = this._express.static(path.join(__dirname + pathname), {
      maxAge: 604800000,
      setHeaders: function (res) {
        res.setHeader('X-FRAME-OPTIONS', 'DENY')
        res.setHeader('X-XSS-Protection', '1; mode=block')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Cache-Control', 'max-age=604800000')
        res.setHeader('Referrer-Policy', 'no-referrer')
        res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString())
      }
    })

    this._app.use(this._compression())
    this._app.use(staticFileMiddleware)
    this._app.use(this._history())
    this._app.use(staticFileMiddleware)
    this._app.use(this._express.json())
    this._app.get('/', (req, res) => {
      res.render(path.join(__dirname + '/index.html'))
    })
  }

  getApp() {
    return this._app
  }
}

module.exports = App
