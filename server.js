const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const compression = require('compression')

const app = express()
const staticFileMiddleware = express.static(path.join(__dirname + "/dist"))

app.use(compression())
app.use(staticFileMiddleware)
app.use(history())
app.use(staticFileMiddleware)

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/index.html'))
})

app.listen(5000, function () {
  console.log('Express is serving on 5000!')
})