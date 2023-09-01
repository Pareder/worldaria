<template>
  <OnlineModal
    v-if="enemyLeft || (loaded && game.count === subjects.length)"
    :reason="reason"
    :nickname="nickname"
    :users="users"
    :score="game.scores"
  />
  <HomeButton v-if="!loaded"></HomeButton>
  <Loader :is-loading="!loaded">
    <v-overlay :model-value="enemyTurn" persistent style="z-index: 1000"></v-overlay>
    <Drawer
      v-if="!enemyLeft && game.count !== geojson.length"
      :hasTimeLimit="!enemyTurn"
      :game="enemyTurn ? undefined : game"
      :seconds="seconds"
    >
      <template v-if="!enemyTurn" v-slot:header>
        Attempts: {{ game.attempts }}
      </template>
      <div v-if="!enemyTurn">
        <SvgIcon v-if="gameType === 'flag'" :country="subjects[game.count]" />
        <div v-else class="mb-2">
          {{ subjects[game.count] }}
        </div>
        <UsersList :users="users" :nickname="nickname" :score="game.scores" />
      </div>
      <div v-else class="dot_animation">
        Opponent's Turn<span>.</span><span>.</span><span>.</span>
      </div>
    </Drawer>
    <Chat :nickname="nickname" :users="users" />
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :world="world" :center="center" />
  </Loader>
  <ChooseOpponent
    v-if="chooseOpponent"
    :users="onlineUsers"
    :nickname="nickname"
    :inviteSent="inviteSent"
    :opponentDecline="opponentDecline"
    @sendInvite="sendInvite"
  />
</template>

<script>
import api from '@/api'
import { socket } from '@/socket'
import Chat from '@/components/Chat.vue'
import ChooseOpponent from '@/modals/ChooseOpponent.vue'
import Drawer from '@/components/Drawer.vue'
import HomeButton from '@/components/HomeButton.vue'
import Loader from '@/components/Loader.vue'
import MapComponent from '@/components/MapComponent.vue'
import OnlineModal from '@/modals/OnlineModal.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import UsersList from '@/components/UsersList.vue'

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
        scores: {
          my: 0,
          enemy: 0,
        },
      },
      loaded: false,
      seconds: 15,
      interval: null,
      danger: false,
      users: [],
      enemyTurn: true,
      enemyLeft: false,
      reason: '',
      chooseOpponent: true,
      opponentDecline: false,
      inviteSent: false,
      sort: null,
      gameType: null,
      opponentName: '',
      center: null,
      color: '',
    }
  },

  inject: ['appData'],

  computed: {
    nickname() {
      return this.appData.user?.displayName || ''
    },

    sortNumber() {
      return this.$route.query.sort
    },
  },

  created() {
    socket.emit('enterOnlineMode')
    this.gameType = this.$route.query.type

    socket.on('getOnlineUsers', data => this.onlineUsers = data)

    socket.on('opponentsDecision', data => {
      if (data) {
        socket.emit(  'createGame', {
          name: this.nickname,
          color: this.color,
          sort: this.sort,
          type: this.gameType,
        })
        this.chooseOpponent = false
      } else {
        this.opponentDecline = true
        this.inviteSent = false
      }
    })

    socket.on('startGame', async data => {
      this.gameType = data.type
      this.chooseOpponent = false
      this.users = [...data.users]
      this.subjects = [...data.subjects]
      this.loaded = true

      if (this.nickname === this.users[0].name) {
        this.enemyTurn = false
      }

      await this.getContinent(data.sort)
    })

    socket.on('checkAnswer', data => {
      if (data) {
        const propertyName = this.gameType === 'capital' ? 'capital' : 'name'

        this.layers
          .find(layer => layer.feature.properties[propertyName] === this.subjects[this.game.count])
          .setStyle({ fillColor: this.users.find(user => user.name !== this.nickname).color })
          .off('click')
        this.game.scores.enemy++
      }

      this.resetData()

      if (this.game.count === this.geojson.length) {
        return
      }

      this.enemyTurn = false
      this.makeInterval()
    })

    socket.on('endMatch', () => {
      this.reason = 'leave'
      this.enemyLeft = true
      clearInterval(this.interval)
    })

    socket.on('revengeGame', data => {
      this.game = {
        count: 0,
        attempts: 5,
        scores: {
          my: 0,
          enemy: 0,
        },
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

      if (this.nickname === this.users[0].name) {
        this.enemyTurn = false
        this.makeInterval()
      }
    })
  },

  unmounted() {
    socket.off('getOnlineUsers')
    socket.off('opponentsDecision')
    socket.off('startGame')
    socket.off('checkAnswer')
    socket.off('endMatch')
    socket.off('revengeGame')
  },

  beforeRouteLeave(to, from, next) {
    if (this.game.count === this.geojson.length) {
      next()
      return
    }

    if (this.inviteSent) {
      socket.emit('cancelInvite', { myName: this.nickname, opponentName: this.opponentName })
    }

    clearInterval(this.interval)
    socket.emit('userLeft')
    next()
  },

  methods: {
    async getContinent(sort) {
      this.world = await api.getMapJSON()
      const geojson = await api.getFullJSON()

      if (sort) {
        this.geojson = geojson.filter(feature => feature.properties.pop_est > sort)
      } else {
        this.geojson = geojson
      }

      if (this.nickname === this.users[0].name) {
        this.makeInterval()
      }
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
        layer.setStyle({ fillColor: this.users.find(user => user.name === this.nickname).color })
        layer.off('click')
        this.game.scores.my++
        this.enemyTurn = true
        socket.emit('countryClick', true)
        this.center = [0, 0]
        this.resetData()
      } else {
        this.game.attempts--

        if (this.game.attempts === 0) {
          this.enemyTurn = true
          socket.emit('countryClick', false)
          this.center = [0, 0]
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
          socket.emit('countryClick', false)
          this.enemyTurn = true
          this.resetData()
        }
      }, 1000)
    },

    sendInvite({ name, color, sort, type }) {
      if (this.inviteSent) {
        this.inviteSent = false
        socket.emit('cancelInvite', {
          myName: this.nickname,
          opponentName: this.opponentName,
        })
        return
      }

      this.inviteSent = true
      this.opponentName = name
      this.opponentDecline = false
      this.color = color

      if (sort) {
        this.sort = sort
      }

      if (type) {
        this.gameType = type
      }

      socket.emit('sendInvite', {
        myName: this.nickname,
        opponentName: this.opponentName,
        color,
        sort,
        type,
      })
    },
  },

  components: {
    Loader,
    MapComponent,
    OnlineModal,
    ChooseOpponent,
    Drawer,
    SvgIcon,
    UsersList,
    Chat,
    HomeButton,
  },
}
</script>
