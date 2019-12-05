<template>
  <div>
    <SavedGame v-if="saved" @getSaved="getSaved" />
    <div v-else>
      <Loader v-show="showLoader" /> 
      <GameMode v-if="loaded" :mode="'game'" :geojson="geojson" @stopLoader="stopLoader" :world="world" />
    </div>
  </div>
</template>

<script>
import SavedGame from '../modals/SavedGame'
import GameMode from '../components/GameMode'
import Loader from '../components/Loader'

export default {
  data() {
    return {
      geojson: [],
      world: [],
      saved: false,
      loaded: false,
      showLoader: true
    }
  },

  created() {
    if (localStorage.getItem('guessed') && !this.$route.params.sort) {
      this.saved = true
      return
    }

    if (this.$route.params.sort) {
      this.getWorld()
    } else {
      this.getContinent()
    }
  },

  methods: {
    getWorld() {
      this.$http.get(`../json/map.json`)
        .then(response => {
          this.world = [...response.body.features]
          this.getContinent()
        }, response => {
          console.log(response)
        })
    },

    getContinent() {
      if (localStorage.getItem('fullJSON')) {
        this.geojson = JSON.parse(localStorage.getItem('fullJSON'))
        this.onSuccessfulLoad()
      } else {
        this.$http.get(`../json/full.json`)
          .then(response => {
            this.geojson = [...response.body.features]
            localStorage.setItem('fullJSON', JSON.stringify(this.geojson))
            this.onSuccessfulLoad()
          }, response => {
            console.log(response)
        })
      }
    },

    onSuccessfulLoad() {
      if (this.$route.params.sort) {
        this.geojson = this.geojson.filter(item => item.properties.pop_est > this.$route.params.sort)
      }

      this.loaded = true
    },

    stopLoader () {
      this.showLoader = false
    },

    getSaved () {
      this.saved = false
      this.getContinent()
    }
  },

  components: {
    SavedGame,
    GameMode,
    Loader
  }
}
</script>