import { compareRandom, randomString } from '../../utils'

class Socket {
  constructor(io, weatherAPI, geo, filter, db) {
    this._io = io
    this._weatherAPI = weatherAPI
    this._geo = geo
    this._filter = filter
    this._db = db
    this._availableUsers = {}
    this._rooms = {}
    this.init()
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
        socket.uid = data.uid
        this._availableUsers[data.uid] = {
          ...data,
          socket_id: socket.id,
        }
        this._io.emit('getOnlineUsers', Object.values(this._availableUsers))
      })

      // Socket query for getting the list of available users
      socket.on('enterOnlineMode', () => {
        socket.emit('getOnlineUsers', Object.values(this._availableUsers))
      })

      // Socket query for sending invite to game from user to another user
      socket.on('sendInvite', data => {
        const room = randomString(16)
        socket.room = room
        socket.join(socket.room)
        this._rooms[room] = {
          count: 0,
          type: data.type,
          sort: data.sort,
          users: [
            {
              ...this._availableUsers[socket.uid],
              color: data.color,
              score: 0,
            },
            {
              ...this._availableUsers[data.to],
              score: 0,
            },
          ],
          subjects: this._sortSubjects(data.sort, data.type).sort(compareRandom),
        }
        this._io.to(this._availableUsers[data.to].socket_id).emit('getInvite', {
          ...data,
          from: this._availableUsers[socket.uid],
          room,
        })
      })

      // Socket query for cancelling invite from inviting side
      socket.on('cancelInvite', to => {
        delete this._rooms[socket.room]
        socket.leave(socket.room)
        socket.room = null
        this._io.to(this._availableUsers[to].socket_id).emit('declineInvite')
      })

      // Socket query of invited side for making or declining the game
      socket.on('makeDecision', data => {
        if (data.status) {
          if (socket.room) {
            this._io.to(this._rooms[socket.room]?.users?.[1]?.socket_id).emit('declineInvite')
            socket.leave(socket.room)
            delete this._rooms[socket.room]
            socket.room = null
          }

          socket.room = data.room
          this._rooms[socket.room].users[1].color = data.color
          socket.join(socket.room)
          setTimeout(() => {
            this._io.sockets.in(socket.room).emit('startGame', this._rooms[socket.room])
          }, 100)
          this._io.sockets.in(socket.room).fetchSockets().then(sockets => {
            sockets.forEach(socket => {
              delete this._availableUsers[socket.uid]
            })
            this._io.emit('getOnlineUsers', Object.values(this._availableUsers))
          })
        } else {
          this._io.sockets.in(socket.room).socketsLeave(socket.room)
          delete this._rooms[data.room]
          socket.broadcast.to(data.room).emit('opponentDeclined')
        }
      })

      // Socket query for clicking the country with the right answer
      socket.on('countryClick', score => {
        const data = this._rooms[socket.room]
        data.users.find(user => user.uid === socket.uid).score += score
        data.count++
        if (data.count === data.subjects.length) {
          this._db.saveOnlineRecord(
            data.users.map(user => user.uid),
            data.users.map(user => user.score),
            data.type,
            data.sort,
          )
        }

        this._io.sockets.in(socket.room).emit('updateScore', this._rooms[socket.room].users)
        socket.broadcast.to(socket.room).emit('checkAnswer', score)
      })

      // Socket query for leaving the game to delete user from game
      socket.on('userLeft', (data) => {
        this._io.sockets.in(socket.room).emit('endMatch')
        delete this._rooms[socket.room]
        socket.leave(socket.room)

        this._availableUsers[data.uid] = {
          ...data,
          socket_id: socket.id,
        }
        this._io.emit('getOnlineUsers', Object.values(this._availableUsers))
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
          this._rooms[socket.room].count = 0
          this._rooms[socket.room].users[0].score = 0
          this._rooms[socket.room].users[1].score = 0
          this._rooms[socket.room].subjects.sort(compareRandom)
          this._io.sockets.in(socket.room).emit('revengeGame', {
            users: this._rooms[socket.room].users,
            subjects: this._rooms[socket.room].subjects,
          })
        } else {
          socket.broadcast.to(socket.room).emit('revengeDecline')
        }
      })

      // Socket query for sending messages to chat
      socket.on('sendMessage', data => {
        let text = data.text
        try {
          text = this._filter.clean(text)
        } catch (e) {
          console.error(e)
        }
        const message = {
          user: data.user,
          text,
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

        if (this._availableUsers[socket.uid]) {
          delete this._availableUsers[socket.uid]
          this._io.emit('getOnlineUsers', Object.values(this._availableUsers))
        }

        socket.leave(socket.room)
      })

      // Socket query for signing out to delete user from available
      socket.on('signOut', () => {
        delete this._availableUsers[socket.uid]
        this._io.emit('getOnlineUsers', Object.values(this._availableUsers))
      })
    })
  }

  _sortSubjects(sort, type) {
    if (sort !== 'all') {
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
