<template>
  <OnlineModal
    v-if="enemyLeft || (loaded && game.count === subjects.length)"
    :reason="reason"
    :users="users"
  />
  <HomeButton v-if="!loaded"></HomeButton>
  <Loader :is-loading="!loaded">
    <v-overlay :model-value="enemyTurn" persistent style="z-index: 1000"></v-overlay>
    <Drawer
      v-if="!enemyLeft && game.count !== geojson.length"
      :hasTimeLimit="!enemyTurn"
      :game="enemyTurn ? undefined : game"
    >
      <template v-if="!enemyTurn" v-slot:header>
        Attempts: {{ game.attempts }}
      </template>
      <div v-if="!enemyTurn">
        <SvgIcon v-if="gameType === 'flag'" :country="subjects[game.count]" />
        <div v-else class="mb-2">
          {{ subjects[game.count] }}
        </div>
        <UsersList :users="users" />
      </div>
      <div v-else class="dot_animation">
        Opponent's Turn<span>.</span><span>.</span><span>.</span>
      </div>
    </Drawer>
    <Chat :uid="uid" :users="users" />
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :world="world" :center="center" />
  </Loader>
  <ChooseOpponent
    v-if="chooseOpponent"
    :users="onlineUsers"
    :inviteTo="inviteTo"
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
        seconds: 15,
      },
      loaded: false,
      interval: null,
      users: [],
      enemyTurn: true,
      enemyLeft: false,
      reason: '',
      chooseOpponent: true,
      opponentDecline: false,
      sort: null,
      gameType: null,
      inviteTo: '',
      center: null,
    }
  },

  inject: ['appData'],

  computed: {
    uid() {
      return this.appData.user?.uid || ''
    },

    nickname() {
      return this.appData.user?.displayName || ''
    },
  },

  created() {
    socket.emit('enterOnlineMode')

    socket.on('getOnlineUsers', data => this.onlineUsers = data.filter(user => user.uid !== this.uid))

    socket.on('opponentDeclined', () => {
      this.opponentDecline = true
      this.inviteTo = ''
    })

    socket.on('startGame', async data => {
      this.inviteTo = ''
      this.chooseOpponent = false
      this.gameType = data.type
      this.users = data.users
      this.subjects = data.subjects
      this.enemyTurn = this.uid !== this.users[0].uid
      await this.getContinent(data.sort)
      this.loaded = true
    })

    socket.on('updateScore', users => this.users = users)

    socket.on('checkAnswer', score => {
      if (score) {
        const propertyName = this.gameType === 'capital' ? 'capital' : 'name'
        this.layers
          .find(layer => layer.feature.properties[propertyName] === this.subjects[this.game.count])
          .setStyle({ fillColor: this.users.find(user => user.uid !== this.uid).color })
          .off('click', this.show, this)
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

    socket.on('revengeGame', ({ users, subjects }) => {
      this.game = {
        count: 0,
        attempts: 5,
        seconds: 15,
      }
      this.users = users
      this.subjects = subjects

      this.layers.forEach(layer => {
        layer.setStyle({ fillColor: '#fff' })
        if (!layer.listens('click')) {
          layer.on('click', this.show, this)
        }
      })

      if (this.uid === this.users[0].uid) {
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
      socket.emit('sendName', { uid: this.uid, name: this.nickname })
      next()
      return
    }

    if (this.inviteTo) {
      socket.emit('cancelInvite', this.inviteTo)
    }

    clearInterval(this.interval)
    socket.emit('userLeft', { uid: this.uid, name: this.nickname } )
    next()
  },

  methods: {
    async getContinent(sort) {
      this.world = await api.getMapJSON()
      const geojson = await api.getFullJSON()

      if (sort !== 'all') {
        this.geojson = geojson.filter(feature => feature.properties.pop_est > sort)
      } else {
        this.geojson = geojson
      }

      if (this.uid === this.users[0].uid) {
        this.makeInterval()
      }
    },

    onEachFeature(feature, layer) {
      this.layers.push(layer)
      layer.bindPopup(layer.feature.properties.name)
      layer.on('click', this.show, this)
    },

    show(event) {
      const layer = event.target
      const propertyName = this.gameType === 'capital' ? 'capital' : 'name'

      if (layer.feature.properties[propertyName] === this.subjects[this.game.count]) {
        layer.setStyle({ fillColor: this.users.find(user => user.uid === this.uid).color })
        layer.off('click', this.show, this)
        this.enemyTurn = true
        socket.emit('countryClick', this.game.attempts)
        this.center = [0, 0]
        this.resetData()
      } else {
        this.game.attempts--

        if (this.game.attempts === 0) {
          this.enemyTurn = true
          socket.emit('countryClick', this.game.attempts)
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
      this.game.seconds = 15
    },

    makeInterval() {
      this.interval = setInterval(() => {
        this.game.seconds--
        if (this.game.seconds === 0) {
          socket.emit('countryClick', false)
          this.enemyTurn = true
          this.resetData()
        }
      }, 1000)
    },

    sendInvite({ to, color, sort, type }) {
      if (this.inviteTo) {
        this.inviteTo = ''
        socket.emit('cancelInvite', this.inviteTo)
        return
      }

      this.inviteTo = to
      this.opponentDecline = false
      if (sort) {
        this.sort = sort
      }

      if (type) {
        this.gameType = type
      }

      socket.emit('sendInvite', {
        to,
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
