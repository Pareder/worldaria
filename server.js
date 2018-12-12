const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')
const compression = require('compression')
const http = require('http')
const socket = require('socket.io')
const fetch = require('node-fetch')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const fs = require('fs')
const Filter = require('bad-words')
const filter = new Filter()

// Countries' geojson
const GEO = require('./dist/json/full.json')

// WEATHER API from https://www.worldweatheronline.com
let WEATHER_KEY = JSON.parse(fs.readFileSync('WEATHER_API.json', 'utf8')).key
const WEATHER_API_DATE = new Date(2019, 0, 11)

// Mailer settings from https://app.pepipost.com
const transporter = nodemailer.createTransport({
  host: 'smtp.pepipost.com',
  port: 587,
  secure: false,
  auth: {
    user: 'stkrvton',
    pass: 'MailS3rv3r'
  }
})

// Mailer options to send reminder for myself to change WEATHER API key
const mailOptions = {
  from: 'stkrvton@pepisandbox.com',
  to: 'yljfvelk@grr.la',
  subject: 'Weather API date will be ended soon',
  text: 'Hello, the weather API key should be updated today. And dont forget to edit WEATHER_API.json file.',
  html: '<b>Hello, the weather API key should be updated today. And dont forget to edit <h2>WEATHER_API.json file</h2>.</b><br><h1>' + new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() + ' - faster'
}

// Make express app
const app = express()

const staticFileMiddleware = express.static(path.join(__dirname + "/dist"), {
  maxAge: 604800000,
  setHeaders: function (res, path) {
    res.setHeader('X-FRAME-OPTIONS', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'max-age=604800000')
    res.setHeader('Referrer-Policy', 'no-referrer')
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
  console.log("Express server listening on port 5000")
})

const io = socket.listen(server)

// Game variables for online mode
const USERS = {}
const ONLINE_USERS = {}
let ROOM_NUMBER = 0
const COUNTRIES = []
const CAPITALS = []

// Weather information from api
const WEATHER = {}

// Random sort order
const compareRandom = () => {
  return Math.random() - 0.5
}

// Get array of countrie' names
for (let i = 0; i < GEO.features.length; i++) {
  COUNTRIES.push(GEO.features[i].properties.name)
  CAPITALS.push(GEO.features[i].properties.capital)
}

// Socket settings
io.on('connection', (socket) => {

  // Socket query for current weather information
  socket.on('getWeather', (data) => {
    if (WEATHER[data]) {
      if (WEATHER[data].date > new Date(new Date().setDate(new Date().getDate() - 1))) {
        socket.emit('weatherResponse', WEATHER[data])
        return
      }
    }
    fetch(`https://api.worldweatheronline.com/premium/v1/weather.ashx?q=${data}&format=JSON&fx=no&mca=no&key=${WEATHER_KEY}`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        WEATHER[data] = {
          c: json.data.current_condition[0].temp_C,
          desc: json.data.current_condition[0].weatherDesc[0].value,
          date: new Date()
        }
        socket.emit('weatherResponse', WEATHER[data])
      })
  })

  // Socket query for logged in user to be pushed in ONLINE_USERS object
  socket.on('sendName', (data) => {
    socket.username = data
    ONLINE_USERS[data] = socket.id
    io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })

  // Socket query for getting the list of online users
  socket.on('enterOnlineMode', () => {
    socket.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })

  // Socket query for sending invite to game from user to another user
  socket.on('sendInvite', (data) => {
    socket.sortNumber = data.sort
    socket.gameType = data.type
    io.to(ONLINE_USERS[data.opponentName]).emit('getInvite', data)
  })

  // Socket query for cancelling invite from inviting side
  socket.on('cancelInvite', (data) => {
    io.to(ONLINE_USERS[data.opponentName]).emit('declineInvite')
  })

  // Socket query of invited side for making or declining the game
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

  // Socket query for making the socket room for players, deleting them from ONLINE_USERS object and emitting them the sorted countries array
  socket.on('createGame', (data) => {
    socket.room = `room${ROOM_NUMBER}`
    USERS[socket.room] ? USERS[socket.room] = USERS[socket.room] : USERS[socket.room] = []
    USERS[socket.room].unshift(data.name)
    socket.join(socket.room)
    if (USERS[socket.room].length === 2) {
      io.sockets.adapter.rooms[socket.room].sortNumber = socket.sortNumber
      io.sockets.adapter.rooms[socket.room].gameType = socket.gameType
      io.sockets.adapter.rooms[socket.room].sortedSubjects = sortSubjects(io.sockets.adapter.rooms[socket.room].sortNumber, io.sockets.adapter.rooms[socket.room].gameType)
      io.sockets.in(socket.room).emit('startGame', {
        sort: io.sockets.adapter.rooms[socket.room].sortNumber,
        type: io.sockets.adapter.rooms[socket.room].gameType,
        users: USERS[socket.room],
        subjects: [...io.sockets.adapter.rooms[socket.room].sortedSubjects.sort(compareRandom)]
      })
      delete ONLINE_USERS[socket.username]
      io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
      ROOM_NUMBER++
    }
  })

  // Socket query for clicking the country with the right answer
  socket.on('countryClick', (data) => {
    socket.broadcast.to(socket.room).emit('checkAnswer', data)
  })

  // Socket query for leaving the game to delete user from game
  socket.on('userLeft', () => {
    io.sockets.in(socket.room).emit('endMatch')
    delete USERS[socket.room]
    socket.leave(socket.room)
    ONLINE_USERS[socket.username] = socket.id
    io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })

  // Socket query for making the revenge
  socket.on('revenge', (data) => {
    if (io.sockets.adapter.rooms[socket.room].length === 1) {
      io.sockets.in(socket.room).emit('opponentLeft')
      return
    }
    socket.broadcast.to(socket.room).emit('opponentsRevenge')
  })

  // Socket query for making the revenge decision
  socket.on('revengeDecision', (data) => {
    if (data) {
      io.sockets.in(socket.room).emit('revengeGame', [...io.sockets.adapter.rooms[socket.room].sortedSubjects.sort(compareRandom)])
    } else {
      socket.broadcast.to(socket.room).emit('revengeDecline')
    }
  })

  // Socket query for sending messages to chat
  socket.on('sendMessage', (data) => {
    const message = {
      user: data.user,
      text: filter.clean(data.text)
    }
    io.sockets.in(socket.room).emit('getNewMessages', message)
  })

  // Socket query for sending a notification that opponent is typing
  socket.on('typingMessage', (data) => {
    socket.broadcast.to(socket.room).emit('opponentTyping', data)
  })

  // Socket query for disconnecting to delete user from ONLINE_USERS object and the game if it exists
  socket.on('disconnect', () => {
    io.sockets.in(socket.room).emit('endMatch')
    delete USERS[socket.room]
    if (ONLINE_USERS[socket.username]) {
      delete ONLINE_USERS[socket.username]
      io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
    }
    socket.leave(socket.room)
  })

  // Socket query for signing out to delete the user from ONLINE_USERS object
  socket.on('signOut', () => {
    delete ONLINE_USERS[socket.username]
    io.emit('getOnlineUsers', Object.keys(ONLINE_USERS))
  })
})

// Sort countries by population
const sortSubjects = (sort, type) => {
  const sortedSubjects = []
  if (sort) {
    for (let i = 0; i < GEO.features.length; i++) {
      if (GEO.features[i].properties.pop_est && GEO.features[i].properties.pop_est > sort) {
        sortedSubjects.push(type === 'capital' ? GEO.features[i].properties.capital : GEO.features[i].properties.name)
      }
    }
    return sortedSubjects
  }
  return type === 'capital' ? CAPITALS : COUNTRIES
}

// Make cron tasks to remind me to change WEATHER API key every two month
function makeCron (date) {
  const dayBefore = new Date(date).setDate(new Date(date).getDate() - 1)
  const task = cron.schedule(`0 0 ${new Date(dayBefore).getDate()} ${new Date(date).getMonth() + 1} *`, () => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
    })
    console.log(WEATHER_KEY)
    const newDate = new Date().setMonth(new Date().getMonth() + 2)
    makeCron(newDate)
    task.destroy()
  })
  const readApiTask = cron.schedule(`0 0 ${new Date(date).getDate()} ${new Date(date).getMonth() + 1} *`, () => {
    WEATHER_KEY = JSON.parse(fs.readFileSync('WEATHER_API.json', 'utf8')).key
    readApiTask.destroy()
  })
}

makeCron(WEATHER_API_DATE)