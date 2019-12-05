<template>
  <div>
    <Loader v-show="showLoader" />
    <LearnMode
      v-if="loaded"
      :mode="mode"
      :geojson="geojson"
      :mapOptions="options"
      @stopLoader="stopLoader"
      :country="country"
    />
  </div>
</template>

<script>
import LearnMode from './LearnMode'
import Loader from './Loader'

export default {
  data() {
    return {
      geojson: [],
      options: {
        center: [0, 0],
        zoom: 2
      },
      loaded: false,
      showLoader: true
    }
  },

  props: {
    mode: {
      type: String
    }
  },

  created() {
    if (this.latlng) {
      this.options = { ...this.latlng }
    }

    this.getContinent()
    this.getOptions()
  },

  computed: {
    name() {
      return this.$route.params.name || 'full'
    },

    latlng() {
      return this.$route.params.latlng
    },

    country() {
      return this.$route.params.country || false
    }
  },

  methods: {
    stopLoader() {
      this.showLoader = false
    },

    getContinent() {
      this.$http.get(`../json/${this.name}.json`)
        .then(response => {
          this.geojson = [...response.body.features]
          this.loaded = true
        }, error => {
          console.log(error)
        })
    },

    getOptions() {
      switch (this.name) {
        case 'full':
          this.options = {
            zoom: 2,
            center: [0, 0],
            maxBounds: [[90, -180], [-60, 225]]
          }
          break
        case 'europe':
          this.options = {
            zoom: 3,
            center: [60, 60],
            maxBounds: [[90, -180], [-30, 220]]
          }
          break
        case 'asia':
          this.options = {
            zoom: 3,
            center: [30, 120],
            maxBounds: [[60, -30], [-30, 220]]
          }
          break
        case 'africa':
          this.options = {
            zoom: 3,
            center: [0, 30],
            maxBounds: [[60, -30], [-60, 90]]
          }
          break
        case 'na':
          this.options = {
            zoom: 3,
            center: [50, -150],
            maxBounds: [[90, -200], [-20, 0]]
          }
          break
        case 'sa':
          this.options = {
            zoom: 3,
            center: [-60, -120],
            maxBounds: [[20, -150], [-60, 20]]
          }
          break
        case 'oceania':
          this.options = {
            zoom: 4,
            center: [-30, 150],
            maxBounds: [[30, -180], [-60, 225]]
          }
          break
      }
    }
  },

  components: {
    LearnMode,
    Loader
  }
}
</script>