<template>
  <div>
    <Loader v-show="!loaded" />
    <OnlineModal
      v-if="loaded && game.count === geojson.length"
      :score="game.scores"
      :nickname="'You'"
      :enemy="'Bot'"
      :colors="sideColors"
      @makeRevenge="revenge"
    />
    <div class="modal-backdrop" v-if="loaded && enemyTurn"></div>
    <div v-if="loaded" id="map">
      <Drawer
        v-if="game.count !== geojson.length"
        :game="enemyTurn ? undefined : game"
        :seconds="seconds"
        :hasTimeLimit="!enemyTurn"
      >
        <template v-if="!enemyTurn" v-slot:header>
          Attempts: {{ game.attempts }}
        </template>
        <div v-if="!enemyTurn" class="fullWidth">
          <SvgIcon v-if="gameType === 'flag'" :country="subjects[game.count]" />
          <div v-else class="text--big">
            {{ subjects[game.count] }}
          </div>
          <UsersList :users="users" nickname="You" :score="game.scores" />
        </div>
        <div v-else class="text--big enemyTurn dot_animation">
          Opponent's Turn<span>.</span><span>.</span><span>.</span>
        </div>
      </Drawer>
      <Map :geojson="geojson" :onEachFeature="onEachFeature" :botMode="botMode" :world="world" />
    </div>
  </div>
</template>

<script>
import api from '@/api'
import Loader from '@/components/Loader.vue'
import OnlineModal from '@/modals/OnlineModal.vue'
import Map from '@/components/Map.vue'
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
          enemy: 0
        },
      },
      loaded: false,
      seconds: 15,
      interval: null,
      danger: false,
      users: ['You', 'Bot'],
      sideColors: {
        my: 'blue',
        enemy: 'tomato'
      },
      enemyTurn: false
    }
  },

  computed: {
    botMode() {
      return this.$route.params.mode
    },

    chance() {
      switch(this.$route.params.mode) {
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
      return this.$route.params.by
    }
  },

  async created() {
    if (this.$route.params.sort && this.botMode !== 'impossible') {
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
      if (this.$route.params.sort) {
        this.geojson = this.geojson.filter(feature => feature.properties.pop_est > this.$route.params.sort)
      }

      this.getSubjects()
      this.makeInterval()
      this.loaded = true
    },

    getSubjects() {
      this.subjects = this.guessBy === 'capital' ?
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
      if (layer.feature.properties.name === this.subjects[this.game.count]) {
        layer.setStyle({ fillColor: this.sideColors.my })
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
            .find(layer => layer.feature.properties.name === this.subjects[this.game.count])
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
      }, 2000)
    },

    revenge() {
      this.game = {
        count: 0,
        attempts: 5,
        scores: {
          my: 0,
          enemy: 0
        }
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
    }
  },

  components: {
    Loader,
    OnlineModal,
    Map,
    Drawer,
    SvgIcon,
    UsersList
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