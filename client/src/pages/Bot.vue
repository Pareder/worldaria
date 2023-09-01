<template>
  <v-overlay :model-value="loaded && enemyTurn" persistent></v-overlay>
  <OnlineModal
    v-if="loaded && game.count === geojson.length"
    :users="users"
    :score="game.scores"
    nickname="You"
    enemy="Bot"
    @makeRevenge="revenge"
  />
  <Loader :is-loading="!loaded">
    <Drawer
      v-if="game.count !== geojson.length"
      :game="enemyTurn ? undefined : game"
      :seconds="seconds"
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
        <UsersList :users="users" nickname="You" :score="game.scores" />
      </div>
      <div v-else class="text-h6 dot_animation">
        Opponent's Turn<span>.</span><span>.</span><span>.</span>
      </div>
    </Drawer>
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :botMode="botMode" :world="world" />
  </Loader>
</template>

<script>
import api from '@/api'
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
        scores: {
          my: 0,
          enemy: 0,
        },
      },
      loaded: false,
      seconds: 15,
      interval: null,
      danger: false,
      users: [
        { name: 'You', color: MY_COLOR },
        { name: 'Bot', color: ENEMY_COLOR },
      ],
      enemyTurn: false,
    }
  },

  computed: {
    botMode() {
      return this.$route.query.mode
    },

    chance() {
      switch (this.$route.query.mode) {
        case 'hard':
          return 0.8
        case 'extreme':
          return 0.95
        case 'impossible':
          return 0.95
        case 'easy':
        default:
          return 0.3
      }
    },

    gameType() {
      return this.$route.query.by
    },
  },

  async created() {
    if (this.$route.query.sort && this.botMode !== 'impossible') {
      await this.getWorld()
    } else {
      await this.getCountries()
    }
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
      if (this.$route.query.sort) {
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
      layer.on('click', () => {
        this.show(layer)
      }, this)
    },

    show(layer) {
      if (this.gameType === 'capital'
        ? layer.feature.properties.capital === this.subjects[this.game.count]
        : layer.feature.properties.name === this.subjects[this.game.count]
      ) {
        layer.setStyle({ fillColor: COLORS.my })
        layer.off('click')
        this.game.scores.my++
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
          this.enemyTurn = true
          this.makeBotTurn()
          this.resetData()
        }
      }, 1000)
    },

    makeBotTurn() {
      setTimeout(() => {
        const chance = Math.random()

        if (chance < this.chance) {
          this.layers
            .find(layer => this.gameType === 'capital'
              ? layer.feature.properties.capital === this.subjects[this.game.count]
              : layer.feature.properties.name === this.subjects[this.game.count]
            )
            .setStyle({ fillColor: COLORS.enemy })
            .off('click')
          this.game.scores.enemy++
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
        scores: {
          my: 0,
          enemy: 0,
        },
      }
      this.seconds = 15

      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].setStyle({ fillColor: '#fff' })

        if (!this.layers[i].listens('click')) {
          this.layers[i].on('click', () => {
            this.show(this.layers[i])
          }, this)
        }
      }

      this.subjects.sort(this.compareRandom)
      this.enemyTurn = false
      this.makeInterval()
    },
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
