<template>
  <div>
    <SavedGame v-if="saved" @getSaved="getSaved" />
    <div v-else>
      <Loader v-show="showLoader" /> 
      <GameMode v-if="loaded" mode="game" :geojson="geojson" @stopLoader="stopLoader" :world="world" />
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

  async created() {
    if (localStorage.getItem('guessed') && !this.$route.params.sort) {
      this.saved = true
      return
    }

    if (this.$route.params.sort) {
      await this.getWorld()
    }

    await this.getContinent()
  },

  methods: {
    async getWorld() {
      this.world = await this.$api.getMapJSON()
    },

    async getContinent() {
      this.geojson = await this.$api.getFullJSON()
      this.onSuccessfulLoad()
    },

    onSuccessfulLoad() {
      if (this.$route.params.sort) {
        this.geojson = this.geojson.filter(item => item.properties.pop_est > this.$route.params.sort)
      }

      this.loaded = true
    },

    stopLoader() {
      this.showLoader = false
    },

    async getSaved() {
      this.saved = false
      await this.getContinent()
    }
  },

  components: {
    SavedGame,
    GameMode,
    Loader
  }
}
</script>