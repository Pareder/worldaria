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

const server = http.createServer(app).listen(process.env.PORT || 5000, () => {
  console.log("Express server listening on port 5000");
})

const io = socket.listen(server)

const USERS = {}
const ONLINE_USERS = {}
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
    ONLINE_USERS[data] = socket.id
    io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })
  socket.on('enterOnlineMode', () => {
    socket.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })
  socket.on('sendInvite', (data) => {
    io.to(ONLINE_USERS[data.opponentName]).emit('getInvite', data)
  })
  socket.on('cancelInvite', (data) => {
    io.to(ONLINE_USERS[data.opponentName]).emit('declineInvite')
  })
  socket.on('makeDecision', (data) => {
    if (data.status) {
      if (socket.room) {
        delete USERS[socket.room]
        socket.room = null
      }
      socket.room = `room${ROOM_NUMBER}`
      USERS[socket.room] ? USERS[socket.room] = USERS[socket.room] : USERS[socket.room] = []
      USERS[socket.room].push(data.myName)
      socket.join(socket.room)
      delete ONLINE_USERS[socket.username]
      io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
    }
    io.to(ONLINE_USERS[data.opponentName]).emit('opponentsDecision', data.status)    
  })
  socket.on('createGame', (data) => {
    socket.room = `room${ROOM_NUMBER}`
    USERS[socket.room] ? USERS[socket.room] = USERS[socket.room] : USERS[socket.room] = []
    USERS[socket.room].unshift(data)
    socket.join(socket.room)
    if (USERS[socket.room].length === 2) {
      io.sockets.in(socket.room).emit('startGame', { users: USERS[socket.room], countries: [...COUNTRIES.sort(compareRandom)] })
      delete ONLINE_USERS[socket.username]
      io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
      ROOM_NUMBER++
    }
  })
  socket.on('countryClick', (data) => {
    socket.broadcast.to(socket.room).emit('checkAnswer', data)
  })
  socket.on('userLeft', () => {
    io.sockets.in(socket.room).emit('endMatch')    
    delete USERS[socket.room]
    socket.leave(socket.room)
    ONLINE_USERS[socket.username] = socket.id
    io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })
  socket.on('revenge', (data) => {
    socket.broadcast.to(socket.room).emit('opponentsRevenge')
  })
  socket.on('revengeDecision', () =>{
    io.sockets.in(socket.room).emit('revengeGame', [...COUNTRIES.sort(compareRandom)])
  })
  socket.on('disconnect', () => {
    io.sockets.in(socket.room).emit('endMatch')
    delete USERS[socket.room]
    if (ONLINE_USERS[socket.username]) {
      delete ONLINE_USERS[socket.username]
      io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
    }
    socket.leave(socket.room)
  })
  socket.on('signOut', () => {
    delete ONLINE_USERS[socket.username]
    io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })
})