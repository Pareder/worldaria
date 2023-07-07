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
      :score="game.scores"
      :colors="sideColors"
    />
    <div class="modal-backdrop" v-if="loaded && enemyTurn"></div>
    <div v-if="loaded" id="map">
      <Drawer
        v-if="!enemyLeft && game.count !== geojson.length"
        :hasTimeLimit="!enemyTurn"
        :game="enemyTurn ? undefined : game"
        :seconds="seconds"
      >
        <template v-if="!enemyTurn" v-slot:header>
          Attempts: {{ game.attempts }}
        </template>
        <div v-if="!enemyTurn" class="fullWidth">
          <SvgIcon v-if="gameType === 'flag'" :country="subjects[game.count]" />
          <div v-else class="text--big">
            {{ subjects[game.count] }}
          </div>
          <UsersList :users="users" :nickname="nickname" :score="game.scores" />
        </div>
        <div v-else class="text--big enemyTurn dot_animation">
          Opponent's Turn<span>.</span><span>.</span><span>.</span>
        </div>
      </Drawer>
      <Chat fixed bottom left :nickname="nickname" :opponentName="enemy" :sideColors="sideColors" />
      <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
    </div>
  </div>
</template>

<script>
import api from '@/api'
import Loader from '@/components/Loader.vue'
import MapComponent from '@/components/MapComponent.vue'
import OnlineModal from '@/modals/OnlineModal.vue'
import ChooseOpponent from '@/modals/ChooseOpponent.vue'
import Drawer from '@/components/Drawer.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import UsersList from '@/components/UsersList.vue'
import Chat from '@/components/Chat.vue'

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
          enemy: 0
        },
      },
      loaded: false,
      seconds: 15,
      interval: null,
      danger: false,
      users: [],
      sideColors: {
        my: '',
        enemy: ''
      },
      enemyTurn: true,
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

  inject: ['appData'],

  computed: {
    nickname() {
      return this.appData.user.displayName
    },

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

  created() {
    this.$socket.emit('enterOnlineMode')
    this.gameType = this.$route.params.type

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
    async getContinent(sort) {
      this.world = await api.getMapJSON()
      const geojson = await api.getFullJSON()

      if (sort) {
        this.geojson = geojson.filter(feature => feature.properties.pop_est > sort)
      } else {
        this.geojson = geojson
      }

      if (this.nickname === this.users[0]) {
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
        layer.setStyle({ fillColor: this.sideColors.my })
        layer.off('click')
        this.game.scores.my++
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

    async startGame(data) {
      this.gameType = data.type
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

      await this.getContinent(data.sort)
    },

    checkAnswer(data) {
      if (data) {
        const propertyName = this.gameType === 'capital' ? 'capital' : 'name'

        this.layers
          .find(layer => layer.feature.properties[propertyName] === this.subjects[this.game.count])
          .setStyle({ fillColor: this.sideColors.enemy })
          .off('click')
        this.game.scores.enemy++
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
        scores: {
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
    MapComponent,
    OnlineModal,
    ChooseOpponent,
    Drawer,
    SvgIcon,
    UsersList,
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

  .fullWidth {
    width: 100%;
  }

  .text--big {
    user-select: none;
    font-size: 22px;
  }
</style>