<template>
  <FinishLearn v-if="game.count === states.length" />
  <Drawer v-else :game="game">
    {{ states[game.count] }}
    <v-autocomplete
      label="Search"
      variant="outlined"
      density="compact"
      clearable
      class="w-100 mt-4"
      :items="states"
      :custom-filter="customFilter"
      @input="search($event.target.value)"
      @update:model-value="zoomCountry"
    ></v-autocomplete>
  </Drawer>
  <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :flyBounds="flyBounds" :center="center" />
</template>

<script>
import randomColor from '@/utils/randomColor'
import Drawer from '@/components/Drawer.vue'
import FinishLearn from '@/modals/FinishLearn.vue'
import MapComponent from '@/components/MapComponent.vue'

export default {
  data() {
    return {
      states: [],
      guessed: [],
      game: {
        count: 0,
        attempts: 5,
        length: this.geojson.length,
      },
      layers: [],
      flyBounds: null,
      center: null,
    }
  },

  props: {
    geojson: {
      type: Array,
      required: true,
    },
  },

  created() {
    this.states = this.geojson.map(item => item.properties.name)
    this.states.sort(this.compareRandom)
  },

  methods: {
    onEachFeature(feature, layer) {
      layer.bindPopup(layer.feature.properties.name + (layer.feature.properties.capital
        ? '<br>Capital - ' + layer.feature.properties.capital
        : ''
      ))
      this.layers.push(layer)
      layer.on('click', this.show, this)
    },

    show(event) {
      const layer = event.target
      if (layer.feature.properties.name === this.states[this.game.count]) {
        this.game.count++
        this.game.attempts = 5
        this.guessed.push(layer.feature.properties.name)
        layer.setStyle({ fillColor: randomColor() })
        layer.getElement().classList.remove('guess_me')
        layer.off('click', this.show, this)
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
      for (let i = 0; i < this.layers.length; i++) {
        if (value?.length > 0 && this.layers[i].feature.properties.name.toLowerCase().startsWith(value.toLowerCase())) {
          if (!this.guessed.includes(this.layers[i].feature.properties.name)) {
            this.layers[i].setStyle({ fillColor: randomColor() })
          }
        } else if (!this.guessed.includes(this.layers[i].feature.properties.name)) {
          this.layers[i].setStyle({ fillColor: '#fff' })
        }
      }
    },

    zoomCountry(country, mode) {
      if (!country) {
        return
      }

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
        this.$emit('clearSearch')
      }
    },

    customFilter(country, search) {
      return country.toLowerCase().startsWith(search?.toLowerCase())
    },
  },

  components: {
    Drawer,
    FinishLearn,
    MapComponent,
  },
}
</script>
