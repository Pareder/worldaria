<template>
  <div>
    <Loader v-show="!loaded" />
    <div v-if="isMobile" class="select">
      <select @change="createGeo" v-model="history">
        <option v-for="(date, id) in sliderOptions.data" :key="id" :value="date">{{ date }}</option>
      </select>
      <PlayerImg :playPressed="playPressed" @onClick="playHistory" />
    </div>
    <div v-else class="slider">
      <PlayerImg :playPressed="playPressed" @onClick="playHistory" />
    </div>
    <div id="map" v-if="loaded">
      <Map :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
    </div>
  </div>
</template>

<script>
import api from '@/api'
import Loader from '@/components/Loader.vue'
import Map from '@/components/Map.vue'
import PlayerImg from '@/components/PlayerImg.vue'

export default {
  data() {
    return {
      world: [],
      geojson: [],
      sliderOptions: {
        width: '80%',
        tooltip: 'always',
        lazy: true,
        marks: true,
        useKeyboard: true,
        style: {
          marginLeft: '10%'
        },
        data: [
          '2000 BC',
          '1000 BC',
          '500 BC',
          '200 BC',
          '1 BC',
          '400',
          '600',
          '800',
          '1000',
          '1279',
          '1492',
          '1530',
          '1650',
          '1715',
          '1783',
          '1815',
          '1880',
          '1914',
          '1920',
          '1938',
          '1945',
          '1994'
        ]
      },
      loaded: false,
      history: '2000 BC',
      playPressed: false,
      interval: null,
      count: 0
    }
  },

  created() {
    this.createMap()
  },

  methods: {
    async createMap() {
      this.world = await api.getMapJSON()
      await this.createGeo()
    },

    async createGeo() {
      const period = this.history.replace(' ', '').toLowerCase()
      this.count = this.sliderOptions.data.indexOf(this.history)
      this.geojson = await api.getGeoJSON(`history/${period}`)
      this.loaded = true
    },

    onEachFeature(feature, layer) {
      layer.setStyle({ fillColor: this.randomColor() })
      layer.bindPopup(layer.feature.properties.name)
    },

    playHistory() {
      if (this.isMobile && !this.playPressed) {
        this.playPressed = true

        this.interval = setInterval(() => {
          this.count++

          if (this.count > this.sliderOptions.data.length - 1) {
            clearInterval(this.interval)
            return
          }

          this.history = this.sliderOptions.data[this.count]
          this.createGeo()
        }, 2000)
      } else if (!this.playPressed) {
        this.playPressed = true
        this.$refs.slider.setIndex(this.$refs.slider.getIndex() + 1)

        this.interval = setInterval(() => {
          if (this.$refs.slider.getIndex() === 21) {
            clearInterval(this.interval)
            this.playPressed = false
            return
          }

          this.$refs.slider.setIndex(this.$refs.slider.getIndex() + 1)
        }, 2000)
      } else if (this.interval) {
        this.playPressed = false
        clearInterval(this.interval)
      }
    }
  },

  components: {
    Loader,
    Map,
    PlayerImg
  }
}
</script>

<style scoped>
  .leaflet-pane {
    z-index: 1;
  }
  .select {
    position: absolute;
    z-index: 800;
    top: 15px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  select {
    width: 150px;
    padding: 5px 10px;
    border: 1px solid #2c3e50;
    outline: 0;
    border-radius: 5px;
    font: 15px 'Montserrat';
    transition: all 0.3s;
  }
  select:focus {
    box-shadow: 0 0 5px #2c3e50;
  }
  .slider {
    position: fixed;
    z-index: 800;
    bottom: 20px;
    width: 100%;
    display: flex;
  }
</style>