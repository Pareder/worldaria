<template>
  <div>
    <Loader v-show="!loaded" />
    <Modal v-if="loaded && game.count === subjects.length" />
    <div v-if="loaded" id="map">
      <Drawer :game="game" :hasTimeLimit="hasTimeLimit" :seconds="seconds">
        <SvgIcon
          v-if="guessBy === 'flag' && game.count !== subjects.length"
          :country="currentSubjectValue"
        />
        <div v-else-if="game.count !== subjects.length" class="subject">
          {{ currentSubjectValue }}
        </div>
        <v-map v-if="isAreaMode" :options="options" class="map" ref="map">
          <v-geojson
            :geojson="[geojson[subjects[game.count]]]"
            :options="countryOptions"
            @ready="zoomCountry"
          ></v-geojson>
        </v-map>
      </Drawer>
      <Map
        ref="worldMap"
        :botMode="isAreaMode ? 'extreme' : null"
        :geojson="geojson"
        :onEachFeature="onEachFeature"
        :world="world"
      />
    </div>
  </div>
</template>

<script>
  import L from 'leaflet'
  import { LMap, LGeoJson } from 'vue2-leaflet'
  import Loader from './Loader'
  import Map from './Map'
  import SvgIcon from './SvgIcon'
  import Modal from '../modals/Modal'
  import Drawer from './Drawer'
  import Drag from '../utils/Drag'
  import pointInLayer from '../utils/pointInLayer'

  export default {
    data() {
      return {
        world: null,
        geojson: null,
        subjects: null,
        game: {
          length: 0,
          count: 0,
          attempts: 5,
          score: 0,
          rightAnswers: 0
        },
        loaded: false,
        seconds: 15,
        interval: null,
        options: {
          renderer: L.svg(),
          dragging: false,
          doubleClickZoom: false,
          boxZoom: false,
          scrollWheelZoom: false,
          keyboard: false,
          touchZoom: false,
          tap: false
        },
        countryOptions: {
          fill: true,
          fillColor: '#fff',
          fillOpacity: 1,
          stroke: true,
          weight: 2,
          color: '#000'
        }
      }
    },

    props: {
      guessBy: {
        type: String
      },
      bot: {
        type: Boolean
      }
    },

    computed: {
      hasTimeLimit() {
        return this.$route.params?.mode === 'hard' || this.$route.path === '/hard'
      },

      guessedField() {
        return this.guessBy === 'capital' ? 'capital' : 'name'
      },

      isAreaMode() {
        return this.guessBy === 'area'
      },

      currentSubjectValue() {
        const id = this.subjects[this.game.count]
        return this.geojson[id].properties[this.guessedField]
      }
    },

    async created() {
      if (this.$route.params.sort) {
        await this.getWorld()
      } else {
        await this.getCountries()
      }
    },

    destroyed() {
      clearInterval(this.interval)
    },

    methods: {
      async getWorld() {
        this.world = await this.$api.getMapJSON()
        await this.getCountries()
      },

      async getCountries() {
        this.geojson = await this.$api.getFullJSON()
        this.onSuccessfulLoad()
      },

      onSuccessfulLoad() {
        if (this.$route.params.sort) {
          this.geojson = this.geojson.filter(item => item.properties.pop_est > this.$route.params.sort)
        }

        this.game.length = this.geojson.length
        this.getSubjects()
        this.loaded = true

        if (this.hasTimeLimit) {
          this.makeInterval()
        }
      },

      getSubjects() {
        this.subjects = this.geojson.map((_, id) => id)
        this.subjects.sort(this.compareRandom)
      },

      makeInterval() {
        this.interval = setInterval(() => {
          this.seconds--

          if (this.seconds === 0) {
            this.game.score--
            this.resetData()
          }
        }, 1000)
      },

      zoomCountry() {
        new Drag(document.querySelector('.map'), this.onDrop)
        this.setMiniMap()
      },

      setMiniMap() {
        this.$nextTick(() => {
          const group = new L.featureGroup()
          this.$refs.map.mapObject.eachLayer(layer => {
            if (layer.feature) {
              group.addLayer(layer)
            }
          })

          this.$refs.map.mapObject.fitBounds(group.getBounds())
        })
      },

      onEachFeature(feature, layer) {
        layer.bindPopup(layer.feature.properties.name)
        layer.on('click', () => {
          if (this.isAreaMode) {
            return this.answerWrong()
          }

          this.show(layer)
        }, this)
      },

      show(layer) {
        if (layer.feature.properties[this.guessedField] === this.currentSubjectValue) {
          layer.setStyle({ fillColor: this.randomColor() })
          layer.off('click')
          this.answerCorrect()
          return
        }

        this.answerWrong()
      },

      onDrop(event) {
        // TODO: Seems like this code smells
        const map = this.$refs.worldMap.$refs.map.mapObject
        const coordinates = map.containerPointToLatLng(L.point([event.clientX, event.clientY]))
        const layers = pointInLayer(coordinates, map)
        for (const layer of layers) {
          if (layer.feature.properties.name === this.currentSubjectValue) {
            layer.setStyle({ fillColor: this.randomColor() })
            this.answerCorrect()
            return
          }
        }

        this.answerWrong()
      },

      answerCorrect() {
        this.game.score++
        this.game.rightAnswers++

        this.resetData()
      },

      answerWrong() {
        this.game.attempts--
        if (this.game.attempts === 0) {
          this.subjects.push(this.subjects[this.game.count])
          this.game.score--
          this.resetData()
        }
      },

      resetData() {
        this.game.count++
        this.game.attempts = 5
        this.seconds = 15

        if (this.isAreaMode) {
          this.setMiniMap()
        }
      }
    },

    components: {
      Loader,
      Map,
      SvgIcon,
      Modal,
      Drawer,
      'v-map': LMap,
      'v-geojson': LGeoJson
    }
  }
</script>

<style scoped>
  .subject {
    margin: 10px 0;
    font-size: 22px;
  }

  .map {
    height: 200px;
    background-color: transparent;
  }
</style>
