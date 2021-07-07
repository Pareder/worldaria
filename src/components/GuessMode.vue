<template>
  <div>
    <Loader v-show="!loaded" />
    <Modal v-if="loaded && game.count === subjects.length" />
    <div v-if="loaded" id="map">
      <div>
        <div
          class="notification"
          :class="{ animation, danger }"
          @animationend="endAnimation"
          @webkitAnimationEnd="endAnimation"
          @msAnimationEnd="endAnimation"
          @mozAnimationEnd="endAnimation"
        >
          <p class="time" v-if="($route.params && $route.params.mode === 'hard') || $route.path === '/hard'">
            Time: {{ seconds }}
          </p>
          <p class="right-answers">
            <span class="bold">{{ game.rightAnswers }}</span> of {{ geojson.length }}
          </p>
          <SvgIcon
            v-if="guessBy === 'flag' && game.count !== subjects.length"
            :country="currentSubjectValue"
          />
          <div class="subject" v-else-if="game.count !== subjects.length">
            {{ currentSubjectValue }}
          </div>
          <v-map v-if="isAreaMode" :options="options" class="map" ref="map">
            <v-geojson
              :geojson="[geojson[subjects[game.count]]]"
              :options="countryOptions"
              @ready="zoomCountry"
            ></v-geojson>
          </v-map>
          <GameInfo :score="game.score" :attempts="game.attempts"/>
        </div>
      </div>
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
  import leafletPip from '@mapbox/leaflet-pip'
  import Loader from './Loader'
  import Map from './Map'
  import SvgIcon from './SvgIcon'
  import Modal from '../modals/Modal'
  import GameInfo from './GameInfo'
  import Drag from '../utils/Drag'

  export default {
    data() {
      return {
        world: null,
        geojson: null,
        subjects: null,
        game: {
          count: 0,
          attempts: 5,
          score: 0,
          rightAnswers: 0
        },
        loaded: false,
        animation: false,
        seconds: 15,
        interval: null,
        danger: false,
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

        this.getSubjects()
        this.loaded = true

        if (this.$route.params.mode === 'hard' || this.$route.path === '/hard') {
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

          if (this.seconds === 3) {
            this.danger = true
          }

          if (this.seconds === 0) {
            this.game.score--
            this.animation = true
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
        const layers = leafletPip.pointInLayer(coordinates, map)
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
        this.animation = true
        this.resetData()
      },

      answerWrong() {
        this.game.attempts--
        if (this.game.attempts === 0) {
          this.subjects.push(this.subjects[this.game.count])
          this.game.score--
          this.animation = true
          this.resetData()
        }
      },

      resetData() {
        this.game.count++
        this.game.attempts = 5
        this.seconds = 15
        this.danger = false

        if (this.isAreaMode) {
          this.setMiniMap()
        }
      },

      endAnimation() {
        this.animation = false
      }
    },

    components: {
      Loader,
      Map,
      SvgIcon,
      Modal,
      GameInfo,
      'v-map': LMap,
      'v-geojson': LGeoJson
    }
  }
</script>

<style scoped>
  .notification {
    position: absolute;
    right: 50px;
    top: 50px;
    z-index: 1000;
    width: 300px;
    padding: 20px 20px 10px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #404040;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 11px rgba(0, 0, 0, 0.3);
  }
  .time {
    position: absolute;
    top: 5px;
    left: 5px;
    margin: 0;
    font-size: 14px;
  }
  .right-answers {
    position: absolute;
    top: 5px;
    right: 5px;
    margin: 0;
    font-size: 14px;
  }
  .subject {
    margin: 10px 0;
    font-size: 22px;
  }
  .animation {
    animation-name: next;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(.17,.67,.36,1.39);
  }
  .danger {
    animation: danger 1s infinite;
  }
  .map {
    height: 200px;
    background-color: transparent;
  }
  @keyframes next {
    50% {
      transform: translateX(400px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes danger {
    50% {
      box-shadow: 0 0 20px 5px inset tomato;
    }
  }
</style>
