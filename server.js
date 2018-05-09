const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const compression = require('compression')
const http = require('http')
const socket = require('socket.io')
const geo = require('./dist/json/full.json')

const app = express()
const staticFileMiddleware = express.static(path.join(__dirname + "/dist"), {
  maxAge: 604800000,
  setHeaders: function (res, path) {
    res.setHeader('X-FRAME-OPTIONS', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'max-age=604800000')
    res.setHeader('Expires', new Date(Date.now() + 2592000000 * 30).toUTCString())
  }
})

app.use(compression())
app.use(staticFileMiddleware)
app.use(history())
app.use(staticFileMiddleware)

app.get('/', (req, res) => {
  res.render(path.join(__dirname + '/index.html'))
})

app.use(express.json())

const server = app.listen(5000, () => {
  console.log("Express server listening on port 5000");
})

const io = socket.listen(server)

const USERS = {}
let ROOM_NUMBER = 0
const COUNTRIES = []

const compareRandom = () => {
  return Math.random() - 0.5
}

for (let i = 0; i < geo.features.length; i++) {
  COUNTRIES.push(geo.features[i].properties.name)
}

io.on('connection', (socket) => {

  socket.on('sendName', (data) => {
    socket.username = data
    socket.room = `room${ROOM_NUMBER}`
    USERS[socket.room] ? USERS[socket.room] = USERS[socket.room] : USERS[socket.room] = []
    USERS[socket.room].push(data)
    socket.join(socket.room)
    if (USERS[socket.room].length === 2) {
      io.sockets.in(socket.room).emit('startGame', { users: USERS[socket.room], countries: [...COUNTRIES.sort(compareRandom)]})
      ROOM_NUMBER++
    }
  })
  socket.on('countryClick', (data) => {
    io.sockets.in(socket.room).emit('checkAnswer', data)
  })
  socket.on('userLeft', () => {
    io.sockets.in(socket.room).emit('endMatch')
    delete USERS[socket.room]
    socket.leave(socket.room)
  })
  socket.on('gameResult', () => {
    delete USERS[socket.room]
    socket.leave(socket.room)
  })
  socket.on('disconnect', () => {
    io.sockets.in(socket.room).emit('endMatch')
    delete USERS[socket.room]
    socket.leave(socket.room)
  })
})