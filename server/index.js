import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import Filter from 'bad-words'

import App from './app'
import Socket from './modules/socket'
import Weather from './modules/weather'
import Geo from './modules/geo'
import CONFIG from './config'

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
