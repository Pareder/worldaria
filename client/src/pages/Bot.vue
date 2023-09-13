<template>
  <v-overlay :model-value="loaded && enemyTurn" persistent contained></v-overlay>
  <OnlineModal
    v-if="loaded && game.count === geojson.length"
    :users="users"
    @makeRevenge="revenge"
  />
  <Loader :is-loading="!loaded">
    <Drawer
      v-if="game.count !== geojson.length"
      :game="enemyTurn ? undefined : game"
      :hasTimeLimit="!enemyTurn"
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
      <div v-else class="text-h6 dot_animation">
        Opponent's Turn<span>.</span><span>.</span><span>.</span>
      </div>
    </Drawer>
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :botMode="botMode" :world="world" />
  </Loader>
</template>

<script>
import { addDoc, collection, doc, increment, setDoc } from 'firebase/firestore'
import api from '@/api'
import { firestore } from '@/config'
import { ENEMY_COLOR, MY_COLOR } from '@/config/colors'
import Loader from '@/components/Loader.vue'
import OnlineModal from '@/modals/OnlineModal.vue'
import MapComponent from '@/components/MapComponent.vue'
import Drawer from '@/components/Drawer.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import UsersList from '@/components/UsersList.vue'

export default {
  data() {
    return {
      world: [],
      geojson: [],
      layers: [],
      subjects: [],
      game: {
        count: 0,
        attempts: 5,
        seconds: 15,
      },
      loaded: false,
      interval: null,
      timeout: null,
      users: [
        {
          uid: this.appData?.user?.uid || 'you',
          name: 'You',
          color: MY_COLOR,
          score: 0,
        },
        {
          uid: 'bot',
          name: 'Bot',
          color: ENEMY_COLOR,
          score: 0,
        },
      ],
      enemyTurn: false,
    }
  },

  inject: ['appData'],

  computed: {
    botMode() {
      return this.$route.query.mode
    },

    chance() {
      switch (this.$route.query.mode) {
        case 'hard':
          return 0.5
        case 'extreme':
          return 0.8
        case 'impossible':
          return 0.8
        case 'easy':
        default:
          return 0.1
      }
    },

    gameType() {
      return this.$route.query.type
    },
  },

  async created() {
    if (this.$route.query.sort !== 'all' && this.botMode !== 'impossible') {
      await this.getWorld()
    } else {
      await this.getCountries()
    }
  },

  unmounted() {
    clearInterval(this.interval)
    clearTimeout(this.timeout)
  },

  methods: {
    async getWorld() {
      this.world = await api.getMapJSON()
      await this.getCountries()
    },

    async getCountries() {
      this.geojson = await api.getFullJSON()
      this.onSuccessfulLoad()
    },

    onSuccessfulLoad() {
      if (this.$route.query.sort !== 'all') {
        this.geojson = this.geojson.filter(feature => feature.properties.pop_est > this.$route.query.sort)
      }

      this.getSubjects()
      this.makeInterval()
      this.loaded = true
    },

    getSubjects() {
      this.subjects = this.gameType === 'capital' ?
        this.geojson.map(item => item.properties.capital) :
        this.geojson.map(item => item.properties.name)
      this.subjects.sort(this.compareRandom)
    },

    onEachFeature(feature, layer) {
      this.layers.push(layer)
      layer.bindPopup(layer.feature.properties.name)
      layer.on('click', this.show, this)
    },

    show(event) {
      const layer = event.target
      if (this.gameType === 'capital'
        ? layer.feature.properties.capital === this.subjects[this.game.count]
        : layer.feature.properties.name === this.subjects[this.game.count]
      ) {
        layer.setStyle({ fillColor: MY_COLOR })
        layer.off('click', this.show, this)
        this.users[0].score += this.game.attempts
        this.enemyTurn = true
        this.resetData()

        if (this.game.count !== this.geojson.length) {
          this.makeBotTurn()
        }
      } else {
        this.game.attempts--

        if (this.game.attempts === 0) {
          this.enemyTurn = true
          this.resetData()
          if (this.game.count !== this.geojson.length) {
            this.makeBotTurn()
          }
        }
      }
    },

    resetData() {
      clearInterval(this.interval)
      this.game.count++
      if (this.game.count === this.geojson.length) {
        this.saveResult()
        return
      }

      this.game.attempts = 5
      this.game.seconds = 15
    },

    makeInterval() {
      this.interval = setInterval(() => {
        this.game.seconds--

        if (this.game.seconds === 0) {
          this.enemyTurn = true
          this.makeBotTurn()
          this.resetData()
        }
      }, 1000)
    },

    calculateBotScore(attempts = 5) {
      if (!attempts) {
        return 0
      }

      const chance = Math.random()
      if (chance < this.chance) {
        return attempts
      }

      return this.calculateBotScore(attempts - 1)
    },

    makeBotTurn() {
      this.timeout = setTimeout(() => {
        const score = this.calculateBotScore(5)

        if (score) {
          this.layers
            .find(layer => this.gameType === 'capital'
              ? layer.feature.properties.capital === this.subjects[this.game.count]
              : layer.feature.properties.name === this.subjects[this.game.count]
            )
            .setStyle({ fillColor: ENEMY_COLOR })
            .off('click', this.show, this)
          this.users[1].score += score
        }

        this.resetData()

        if (this.game.count === this.geojson.length) {
          return
        }

        this.enemyTurn = false
        this.makeInterval()
      }, 2000)
    },

    revenge() {
      this.game = {
        count: 0,
        attempts: 5,
        seconds: 15,
      }
      this.users[0].score = 0
      this.users[1].score = 0

      this.layers.forEach(layer => {
        layer.setStyle({ fillColor: '#fff' })
        if (!layer.listens('click')) {
          layer.on('click', this.show, this)
        }
      })

      this.subjects.sort(this.compareRandom)
      this.enemyTurn = false
      this.makeInterval()
    },

    async saveResult() {
      const user = this.appData?.user
      if (!user) {
        return
      }

      await addDoc(collection(firestore, 'bot'), {
        user: user.uid,
        score: this.users[0].score,
        bot_score: this.users[1].score,
        type: this.gameType,
        mode: this.botMode,
        sort: this.$route.query.sort || 'all',
        date: Date.now(),
      })
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          bot_games: increment(1),
          total_games: increment(1),
        },
        { merge: true }
      )
    }
  },

  components: {
    Drawer,
    Loader,
    MapComponent,
    OnlineModal,
    SvgIcon,
    UsersList,
  },
}
</script>
