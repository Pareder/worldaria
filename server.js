require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')
const Filter = require('bad-words')
const App = require('./app')
const Socket = require('./modules/socket')
const Weather = require('./modules/weather')
const Geo = require('./modules/geo')
const CONFIG = require('./config')

const weather = Weather.create(CONFIG.weatherAPI, CONFIG.weatherKey)
const app = App.create(CONFIG, weather)
const server = http.createServer(app.getApp()).listen(process.env.PORT || 5000, () => {
  console.log("Express server listening on port 5000")
})
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: true
  }
})
Socket.create(io, weather, Geo.create(), new Filter())
