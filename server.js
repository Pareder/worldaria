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

var port = process.env.PORT || 5000;
app.listen(port);
