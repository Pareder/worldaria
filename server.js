const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const compression = require('compression')

const app = express()
const staticFileMiddleware = express.static(path.join(__dirname + "/dist"), {
  maxAge: 604800000,
  setHeaders: function (res, path) {
    res.setHeader('X-FRAME-OPTIONS', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com 'unsafe-inline' 'unsafe-eval'")
    res.setHeader('Cache-Control', 'max-age=604800000')
    res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString())
  }
})

app.use(compression())
app.use(staticFileMiddleware)
app.use(history())
app.use(staticFileMiddleware)

var port = process.env.PORT || 5000;
app.listen(port);
