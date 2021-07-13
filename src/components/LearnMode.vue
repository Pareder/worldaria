<template>
  <div id="map">
    <Modal v-if="game.count === states.length" :mode="mode" :score="game.score" />
    <Drawer v-else :game="game">
      <span class="text">{{ states[game.count] }}</span>
      <SearchCountriesForm
        v-model="searchCountry"
        @search="search"
        @onClick="zoomCountry"
        :foundCountries="foundCountries"
      />
    </Drawer>
    <Map :geojson="geojson" :onEachFeature="onEachFeature" :mapOptions="mapOptions" />
  </div>
</template>

<script>
import Modal from '../modals/Modal'
import Drawer from './Drawer'
import SearchCountriesForm from './SearchCountriesForm'
import Map from './Map'

export default {
  data() {
    return {
      states: [],
      guessed: [],
      game: {
        count: 0,
        attempts: 5,
        rightAnswers: 0,
        length: this.geojson.length
      },
      layers: [],
      searchCountry: '',
      foundCountries: []
    }
  },

  props: {
    mode: {
      type: String,
      required: true
    },
    geojson: {
      required: true
    },
    mapOptions: {
      type: Object,
      required: true
    },
    latlng: {
      type: Number
    },
    country: {
      type: Boolean
    }
  },

  created() {
    this.states = this.geojson.map(item => item.properties.name)
    this.states.sort(this.compareRandom)
  },

  mounted() {
    this.$emit('stopLoader')
  },

  methods: {
    onEachFeature(feature, layer) {
      layer.bindPopup(layer.feature.properties.name + (layer.feature.properties.capital
        ? '<br>Capital - ' + layer.feature.properties.capital
        : ''
      ))
      this.layers.push(layer)
      layer.on('click', () => {
        this.show(layer)
      }, this)
    },

    show(layer) {
      if (layer.feature.properties.name === this.states[this.game.count]) {
        this.game.count++
        this.game.attempts = 5
        this.guessed.push(layer.feature.properties.name)
        layer.setStyle({ fillColor: this.randomColor() })
        layer.getElement().classList.remove('guess_me')
        layer.off('click')
        this.searchCountry = ''
        this.$emit('clearSearch')
        this.search()
      } else {
        this.game.attempts--

        if (this.game.attempts === 0) {
          this.zoomCountry(this.states[this.game.count], true)
        }
      }
    },

    search(value) {
      this.foundCountries = []

      for (let i = 0; i < this.layers.length; i++) {
        if (value?.length > 0 && this.layers[i].feature.properties.name.toLowerCase().startsWith(value.toLowerCase())) {
          if (!this.guessed.includes(this.layers[i].feature.properties.name)) {
            this.layers[i].setStyle({ fillColor: this.randomColor() })
          }

          this.foundCountries.push(this.layers[i].feature.properties.name)
        } else if (!this.guessed.includes(this.layers[i].feature.properties.name)) {
          this.layers[i].setStyle({ fillColor: '#fff' })
        }
      }

      this.foundCountries.sort()
    },

    zoomCountry(country, mode) {
      for (let i = 0; i < this.layers.length; i++) {
        if (this.layers[i].feature.properties.name === country) {
          if (mode) {
            this.layers[i].setStyle({ fillColor: '#9BFFE6' })
            this.layers[i].getElement().classList.add('guess_me')
          }

          this.$emit('zoomCountry', {
            lat: ((this.layers[i]._bounds._northEast.lat + this.layers[i]._bounds._southWest.lat) / 2),
            lng: ((this.layers[i]._bounds._northEast.lng + this.layers[i]._bounds._southWest.lng) / 2)
          })

          break
        }
      }

      if (this.isMobile) {
        this.searchCountry = ''
        this.$emit('clearSearch')
        this.foundCountries = []
      }
    }
  },

  components: {
    Modal,
    Drawer,
    SearchCountriesForm,
    Map
  }
}
</script>

<style scoped>
  .text {
    font-size: 22px;
  }
</style>
