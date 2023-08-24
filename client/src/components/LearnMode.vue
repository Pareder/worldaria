<template>
  <div id="map">
    <Modal v-if="game.count === states.length" mode="learn" :score="game.score" />
    <Drawer v-else :game="game">
      <span class="text">{{ states[game.count] }}</span>
      <SearchCountriesForm
        v-model="searchCountry"
        @search="search"
        @onClick="zoomCountry"
        :foundCountries="foundCountries"
      />
    </Drawer>
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :flyBounds="flyBounds" :center="center" />
  </div>
</template>

<script>
import randomColor from '@/utils/randomColor';
import Modal from '@/modals/Modal.vue'
import Drawer from '@/components/Drawer.vue'
import SearchCountriesForm from '@/components/SearchCountriesForm.vue'
import MapComponent from '@/components/MapComponent.vue'

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
      foundCountries: [],
      flyBounds: null,
      center: null
    }
  },

  props: {
    geojson: {
      required: true
    },
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
        layer.setStyle({ fillColor: randomColor() })
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
            this.layers[i].setStyle({ fillColor: randomColor() })
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

          this.flyBounds = this.layers[i]._bounds
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
    MapComponent,
    Modal,
    Drawer,
    SearchCountriesForm,
  }
}
</script>

<style scoped>
  .text {
    font-size: 22px;
  }
</style>
