<template>
  <div>
    <Loader v-show="!loaded" />
    <div v-if="isMobile" class="selecter">
      <select @change="createGeo" v-model="history">
        <option v-for="(date, id) in options.slider.data" :key="id" :value="date">{{ date }}</option>
      </select>
      <PlayerImg :playPressed="playPressed" @onClick="playHistory" />
    </div>
    <div v-else class="slider">
      <vue-slider ref="slider" v-bind="options.slider" v-model="history" @callback="createGeo"></vue-slider>
      <PlayerImg :playPressed="playPressed" @onClick="playHistory" />
    </div>
    <div id="map" v-if="loaded">
      <Map :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
    </div>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import Loader from './Loader'
import Map from './Map'
import PlayerImg from './PlayerImg'

export default {
  data() {
    return {
      world: [],
      geojson: [],
      options: {
        slider: {
          width: "80%",
          tooltip: "always",
          lazy: true,
          disabled: false,
          piecewise: true,
          piecewiseLabel: true,
          style: {
            "margin-left": "10%"
          },
          data: [
            "2000 BC",
            "1000 BC",
            "500 BC",
            "200 BC",
            "1 BC",
            "400",
            "600",
            "800",
            "1000",
            "1279",
            "1492",
            "1530",
            "1650",
            "1715",
            "1783",
            "1815",
            "1880",
            "1914",
            "1920",
            "1938",
            "1945",
            "1994"
          ],
          piecewiseStyle: {
            "backgroundColor": "#fff",
            "visibility": "visible",
            "width": "12px",
            "height": "12px"
          },
          piecewiseActiveStyle: {
            "backgroundColor": "#3498db"
          },
          labelActiveStyle: {
            "color": "#3498db"
          },
          bgStyle: {
            "backgroundColor": "#fff",
            "boxShadow": "inset 0 0 3px rgba(0,0,0,.36)"
          }
        }
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
      this.world = await this.$api.getMapJSON()
      await this.createGeo()
    },

    async createGeo() {
      const period = this.history.replace(' ', '').toLowerCase()
      this.count = this.options.slider.data.indexOf(this.history)
      this.geojson = await this.$api.getGeoJSON(`history/${period}`)
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

          if (this.count > this.options.slider.data.length - 1) {
            clearInterval(this.interval)
            return
          }

          this.history = this.options.slider.data[this.count]
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
    vueSlider,
    Map,
    PlayerImg
  }
}
</script>

<style scoped>
  .leaflet-pane {
    z-index: 1;
  }
  .selecter {
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