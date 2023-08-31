import { compareRandom } from '../../utils'

class Socket {
  constructor(io, weatherAPI, geo, filter) {
    this._io = io
    this._weatherAPI = weatherAPI
    this._geo = geo
    this._filter = filter
    this._availableUsers = {}
    this._rooms = {}
    this._roomNumber = 0
  }

  static create(io, weatherAPI, geo, filter) {
    const socketInstance = new Socket(io, weatherAPI, geo, filter)
    socketInstance.init()

    return socketInstance
  }

  init() {
    // Socket settings
    this._io.on('connection', socket => {
      // Socket query for current weather information
      socket.on('getWeather', async data => {
        try {
          const weather = await this._weatherAPI.getWeatherByCity(data)
          socket.emit('weatherResponse', weather)
        } catch (err) {
          return
        }
      })

      // Socket query for logged in user to become available users
      socket.on('sendName', data => {
        socket.username = data
        this._availableUsers[data] = socket.id
        this._io.emit('getOnlineUsers', Object.keys(this._availableUsers))
      })

      // Socket query for getting the list of available users
      socket.on('enterOnlineMode', () => {
        socket.emit('getOnlineUsers', Object.keys(this._availableUsers))
      })

      // Socket query for sending invite to game from user to another user
      socket.on('sendInvite', data => {
        socket.sortNumber = data.sort
        socket.gameType = data.type
        this._io.to(this._availableUsers[data.opponentName]).emit('getInvite', data)
      })

      // Socket query for cancelling invite from inviting side
      socket.on('cancelInvite', data => {
        this._io.to(this._availableUsers[data.opponentName]).emit('declineInvite')
      })

      // Socket query of invited side for making or declining the game
      socket.on('makeDecision', data => {
        if (data.status) {
          if (socket.room) {
            delete this._rooms[socket.room]
            socket.room = null
          }

          socket.room = `room${this._roomNumber}`
          this._rooms[socket.room] = this._rooms[socket.room] || []
          this._rooms[socket.room].push(data.myName)
          socket.join(socket.room)
          delete this._availableUsers[socket.username]
          this._io.emit('getOnlineUsers', Object.keys(this._availableUsers))
        }

        this._io.to(this._availableUsers[data.opponentName]).emit('opponentsDecision', data.status)
      })

      // Socket query for making the socket room for players
      socket.on('createGame', data => {
        socket.room = `room${this._roomNumber}`
        this._rooms[socket.room] = this._rooms[socket.room] || []
        this._rooms[socket.room].unshift(data.name)
        socket.join(socket.room)

        if (this._rooms[socket.room].length === 2) {
          const sortedSubjects = this._sortSubjects(socket.sortNumber, socket.gameType)
          this._io.sockets.adapter.rooms.get(socket.room).sortedSubjects = sortedSubjects
          this._io.sockets.in(socket.room).emit('startGame', {
            sort: socket.sortNumber,
            type: socket.gameType,
            users: this._rooms[socket.room],
            subjects: sortedSubjects.sort(compareRandom),
          })

          delete this._availableUsers[socket.username]
          this._io.emit('getOnlineUsers', Object.keys(this._availableUsers))
          this._roomNumber++
        }
      })

      // Socket query for clicking the country with the right answer
      socket.on('countryClick', data => {
        socket.broadcast.to(socket.room).emit('checkAnswer', data)
      })

      // Socket query for leaving the game to delete user from game
      socket.on('userLeft', () => {
        this._io.sockets.in(socket.room).emit('endMatch')
        delete this._rooms[socket.room]
        socket.leave(socket.room)

        this._availableUsers[socket.username] = socket.id
        this._io.emit('getOnlineUsers', Object.keys(this._availableUsers))
      })

      // Socket query for making the revenge
      socket.on('revenge', () => {
        if (this._io.sockets.adapter.rooms.get(socket.room).size === 1) {
          this._io.sockets.in(socket.room).emit('opponentLeft')
          return
        }

        socket.broadcast.to(socket.room).emit('opponentsRevenge')
      })

      // Socket query for making the revenge decision
      socket.on('revengeDecision', (data) => {
        if (data) {
          this._io.sockets.in(socket.room).emit(
            'revengeGame',
            [...this._io.sockets.adapter.rooms.get(socket.room).sortedSubjects.sort(compareRandom)],
          )
        } else {
          socket.broadcast.to(socket.room).emit('revengeDecline')
        }
      })

      // Socket query for sending messages to chat
      socket.on('sendMessage', data => {
        const message = {
          user: data.user,
          text: this._filter.clean(data.text),
        }
        this._io.sockets.in(socket.room).emit('getNewMessages', message)
      })

      // Socket query for sending a notification that opponent is typing
      socket.on('typingMessage', (data) => {
        socket.broadcast.to(socket.room).emit('opponentTyping', data)
      })

      // Socket query for disconnect to delete user from available
      socket.on('disconnect', () => {
        this._io.sockets.in(socket.room).emit('endMatch')
        delete this._rooms[socket.room]

        if (this._availableUsers[socket.username]) {
          delete this._availableUsers[socket.username]
          this._io.emit('getOnlineUsers', Object.keys(this._availableUsers))
        }

        socket.leave(socket.room)
      })

      // Socket query for signing out to delete user from available
      socket.on('signOut', () => {
        delete this._availableUsers[socket.username]
        this._io.emit('getOnlineUsers', Object.keys(this._availableUsers))
      })
    })
  }

  _sortSubjects(sort, type) {
    if (sort) {
      const geoData = this._geo.getGeoData()
      const sortedSubjects = []

      for (const feature of geoData.features) {
        if (feature.properties.pop_est && feature.properties.pop_est > sort) {
          sortedSubjects.push(type === 'capital' ? feature.properties.capital : feature.properties.name)
        }
      }

      return sortedSubjects
    }

    return type === 'capital' ? this._geo.getCapitals() : this._geo.getCountries()
  }
}

export default Socket
