<template>
  <div>
    <Loader v-show="!loaded" />
    <OnlineModal
      v-if="loaded && game.count === geojson.length"
      :score="game.score"
      :nickname="'You'"
      :enemy="'Bot'"
      :colors="sideColors"
      @makeRevenge="revenge"
    />
    <div class="modal-backdrop" v-if="loaded && enemyTurn"></div>
    <div v-if="loaded" id="map">
      <Notification v-if="game.count !== geojson.length"
        :enemyTurn="enemyTurn"
        :danger="danger"
        :seconds="seconds"
        :attempts="game.attempts"
        :subject="subjects[game.count]"
        :gameType="gameType"
        :users="users"
        :nickname="'You'"
        :score="game.score"
        :enemyGuess="botGuess"
      />
      <Map :geojson="geojson" :onEachFeature="onEachFeature" :botMode="botMode" :world="world" />
    </div>
  </div>
</template>

<script>
import Loader from '../components/Loader'
import OnlineModal from '../modals/OnlineModal'
import Map from '../components/Map'
import Notification from '../components/Notification'

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
        score: {
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
      enemyTurn: false,
      botGuess: false
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

  created() {
    if (this.$route.params.sort && this.botMode !== 'impossible') {
        this.getWorld()
      } else {
        this.getCountries()
      }
  },

  methods: {
    getWorld() {
      if (localStorage.getItem('mapJSON')) {
        this.world = JSON.parse(localStorage.getItem('mapJSON'))
        this.getCountries()
      } else {
        this.$http.get(`../json/map.json`)
          .then(response => {
            this.world = [...response.body.features]
            localStorage.setItem('mapJSON', JSON.stringify(this.world))
            this.getCountries()
          }, response => {
            console.log(response)
          })
      }
    },

    getCountries() {
      if (localStorage.getItem('fullJSON')) {
        this.geojson = JSON.parse(localStorage.getItem('fullJSON'))
        this.onSuccessfulLoad()
      } else {
        this.$http.get(`../json/full.json`)
          .then(response => {
            this.geojson = [...response.body.features]
            localStorage.setItem('fullJSON', JSON.stringify(this.geojson))
            this.onSuccessfulLoad()
          }, error => {
            console.log(error)
          })
      }
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
        this.game.score.my++
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
          this.game.score.enemy++
          this.botGuess = true

          setTimeout(() => {
            this.botGuess = false
          }, 1000)
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
        score: {
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
    Notification
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