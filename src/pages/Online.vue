<template>
  <div>
    <ChooseOpponent
      v-if="chooseOpponent"
      :users="onlineUsers"
      :nickname="nickname"
      @randomOpponent="randomOpponent"
      @sendInvite="sendInvite"
      :inviteSent="inviteSent"
      :opponentDecline="opponentDecline"
    />
    <Loader v-show="!loaded" />
    <OnlineModal
      v-if="enemyLeft || (loaded && game.count === subjects.length)"
      :reason="reason"
      :nickname="nickname"
      :enemy="enemy"
      :score="game.score"
      :colors="sideColors"
    />
    <div class="modal-backdrop" v-if="loaded && enemyTurn"></div>
    <div v-if="loaded" id="map">
      <Notification v-if="!enemyLeft && game.count !== subjects.length"
        :enemyTurn="enemyTurn"
        :danger="danger"
        :seconds="seconds"
        :attempts="game.attempts"
        :subject="subjects[game.count]"
        :gameType="gameType"
        :users="users"
        :nickname="nickname"
        :score="game.score"
        :enemyGuess="enemyGuess"
      />
      <Chat fixed bottom left :nickname="nickname" :opponentName="enemy" :sideColors="sideColors" />
      <Map :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
    </div>
  </div>
</template>

<script>
import Loader from '../components/Loader'
import Map from '../components/Map'
import OnlineModal from '../modals/OnlineModal'
import ChooseOpponent from '../modals/ChooseOpponent'
import SvgIcon from '../components/SvgIcon'
import Notification from '../components/Notification'
import Chat from '../components/Chat'

export default {
  data() {
    return {
      geojson: [],
      world: [],
      layers: [],
      subjects: [],
      onlineUsers: [],
      game: {
        count: 0,
        attempts: 5,
        score: {
          my: 0,
          enemy: 0
        },
      },
      loaded: false,
      seconds: 15,
      interval: null,
      danger: false,
      nickname: '',
      users: [],
      sideColors: {
        my: '',
        enemy: ''
      },
      enemyTurn: true,
      enemyGuess: false,
      enemyLeft: false,
      reason: '',
      chooseOpponent: true,
      opponentDecline: false,
      inviteSent: false,
      sort: null,
      gameType: null,
      opponentName: ''
    }
  },

  computed: {
    enemy() {
      return this.users.filter((item) => item !== this.nickname).toString()
    },

    invited() {
      return this.$route.params.chooseOpponent
    },

    sortNumber() {
      return this.$route.params.sort
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.getCookie('name')) {
        vm.$router.push('/')
      }
    })
  },

  created() {
    this.gameType = this.$route.params.type

    if (this.getCookie('name')) {
      this.nickname = JSON.parse(this.getCookie('name')).name
      this.$socket.emit('enterOnlineMode')
    }

    if (typeof this.invited === 'boolean') {
      this.chooseOpponent = this.invited
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.game.count === this.geojson.length) {
      next()
      return
    }

    if (this.inviteSent) {
      this.$socket.emit('cancelInvite', { myName: this.nickname, opponentName: this.opponentName })
    }

    clearInterval(this.interval)
    this.$socket.emit('userLeft')
    next()
  },

  methods: {
    getContinent(sort) {
      this.$http.get(`../json/map.json`)
        .then(response => {
          this.world = [...response.body.features]
          this.$http.get(`../json/full.json`)
            .then(response => {
              if (sort) {
                this.geojson = response.body.features.filter(feature => feature.properties.pop_est > sort)
              } else {
                this.geojson = [...response.body.features]
              }

              if (this.nickname === this.users[0]) {
                this.makeInterval()
              }
            }, response => {
              console.log(response)
            })
        }, response => {
          console.log(response)
        })
    },

    onEachFeature(feature, layer) {
      this.layers.push(layer)
      layer.bindPopup(layer.feature.properties.name)
      layer.on('click', () => {
        this.show(layer)
      }, this)
    },

    show(layer) {
      const propertyName = this.gameType === 'capital' ? 'capital' : 'name'

      if (layer.feature.properties[propertyName] === this.subjects[this.game.count]) {
        layer.setStyle({ fillColor: this.sideColors.my })
        layer.off('click')
        this.game.score.my++
        this.enemyTurn = true
        this.$socket.emit('countryClick', true)
        this.$emit('setStartZoom')
        this.resetData()
      } else {
        this.game.attempts--

        if (this.game.attempts === 0) {
          this.enemyTurn = true
          this.$socket.emit('countryClick', false)
          this.$emit('setStartZoom')
          this.resetData()
        }
      }
    },

    resetData() {
      clearInterval(this.interval)
      this.game.count++

      if (this.game.count === this.geojson.length) {
        return
      }

      this.game.attempts = 5
      this.seconds = 15
      this.danger = false
    },

    makeInterval() {
      this.interval = setInterval(() => {
        this.seconds--

        if (this.seconds === 3) {
          this.danger = true
        }

        if (this.seconds === 0) {
          this.$socket.emit('countryClick', false)
          this.enemyTurn = true
          this.resetData()
        }
      }, 1000)
    },

    randomOpponent() {
      this.sort = null
      this.$socket.emit('createGame', this.nickname)
      this.chooseOpponent = false
    },

    sendInvite({ name, sort, type }) {
      if (this.inviteSent) {
        this.inviteSent = false
        this.$socket.emit('cancelInvite', {
          myName: this.nickname,
          opponentName: this.opponentName
        })
      } else {
        this.inviteSent = true
        this.opponentName = name
        this.opponentDecline = false

        if (sort) {
          this.sort = sort
        }

        if (type) {
          this.gameType = type
        }

        this.$socket.emit('sendInvite', {
          myName: this.nickname,
          opponentName: this.opponentName,
          sort,
          type
        })
      }
    }
  },

  sockets: {
    getOnlineUsers(data) {
      this.onlineUsers = [...data]
    },

    opponentsDecision(data) {
      if (data) {
        this.$socket.emit('createGame', { name: this.nickname, sort: this.sort, type: this.gameType })
        this.chooseOpponent = false
      } else {
        this.opponentDecline = true
        this.inviteSent = false
      }
    },

    startGame(data) {
      this.gameType = data.type
      this.getContinent(data.sort)
      this.chooseOpponent = false
      this.users = [...data.users]
      this.subjects = [...data.subjects]
      this.loaded = true

      if (this.nickname === this.users[0]) {
        this.sideColors.my = 'blue'
        this.sideColors.enemy = 'tomato'
        this.enemyTurn = false
      } else {
        this.sideColors.enemy = 'blue'
        this.sideColors.my = 'tomato'
      }
    },

    checkAnswer(data) {
      if (data) {
        const propertyName = this.gameType === 'capital' ? 'capital' : 'name'

        this.layers
          .find(layer => layer.feature.properties[propertyName] === this.subjects[this.game.count])
          .setStyle({ fillColor: this.sideColors.enemy })
          .off('click')
        this.game.score.enemy++
        this.enemyGuess = true

        setTimeout(() => {
          this.enemyGuess = false
        }, 1000)
      }

      this.resetData()

      if (this.game.count === this.geojson.length) {
        return
      }

      this.enemyTurn = false
      this.makeInterval()
    },

    endMatch() {
      this.reason = 'leave'
      this.enemyLeft = true
      clearInterval(this.interval)
    },

    revengeGame(data) {
      this.game = {
        count: 0,
        attempts: 5,
        score: {
          my: 0,
          enemy: 0
        }
      }
      this.seconds = 15
      this.subjects = [...data]

      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].setStyle({ fillColor: '#fff' })

        if (!this.layers[i].listens('click')) {
          this.layers[i].on('click', () => {
            this.show(this.layers[i])
          }, this)
        }
      }

      if (this.nickname === this.users[0]) {
        this.enemyTurn = false
        this.makeInterval()
      }
    }
  },

  components: {
    Loader,
    Map,
    OnlineModal,
    ChooseOpponent,
    SvgIcon,
    Notification,
    Chat
  }
}
</script>

<style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>