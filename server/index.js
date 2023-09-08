import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import Filter from 'bad-words'
import { readFileSync } from 'fs'

import App from './app'
import Socket from './modules/socket'
import Weather from './modules/weather'
import Geo from './modules/geo'
import DB from './modules/db'
import CONFIG from './config'

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json'))
// TODO: uncomment when Node.js will support JSON modules https://nodejs.org/docs/latest-v18.x/api/esm.html#json-modules
// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }

const weather = Weather.create(CONFIG.weatherAPI, CONFIG.weatherKey)
const app = App.create(CONFIG, weather).getApp()

const server = http.createServer(app).listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port', process.env.PORT || 5000)
})

const io = new Server(server, {
  cors: {
    credentials: true,
    origin: true,
  },
})
new Socket(io, weather, Geo.create(), new Filter(), DB.create(serviceAccount))
