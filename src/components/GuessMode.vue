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
          <SvgIcon v-if="guessBy === 'flag' && game.count !== subjects.length" :country="subjects[game.count]" />
          <div class="subject" v-else-if="game.count !== subjects.length">
            {{ subjects[game.count] }}
          </div>
          <div class="digits">
            Score: {{ game.score }}
            <span class="attempts">
              Attempts: 
              <span
                :class="attemptsAnimation ? 'attempts_animation' : ''"
                @animationend="endAttemptsAnimation"
                @webkitAnimationEnd="endAttemptsAnimation"
                @msAnimationEnd="endAttemptsAnimation"
                @mozAnimationEnd="endAttemptsAnimation"
              >
                {{ game.attempts }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <Map :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
    </div>
  </div>
</template>

<script>
  import Loader from './Loader'
  import Map from './Map'
  import SvgIcon from './SvgIcon'
  import Modal from '../modals/Modal'

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
        attemptsAnimation: false,
        seconds: 15,
        interval: null,
        danger: false
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

    created() {
      if (this.$route.params.sort) {
        this.getWorld()
      } else {
        this.getCountries()
      }
    },

    methods: {
      getWorld() {
        if (localStorage.getItem('mapJSON')) {
          this.world = JSON.parse(localStorage.getItem('mapJSON'))
          this.getCountries()
        } else {
          this.$http.get(`../json/map.json`)
            .then(response => {
              this.world = [...response.body.features]
              localStorage.setItem('mapJSON', JSON.stringify(this.world))
              this.getCountries()
            }, response => {
              console.log(response)
            })
        }
      },

      getCountries() {
        if (localStorage.getItem('fullJSON')) {
          this.onSuccessfulLoad()
        } else {
          this.$http.get(`../json/full.json`)
            .then(response => {
              localStorage.setItem('fullJSON', JSON.stringify([...response.body.features]))
              this.onSuccessfulLoad()
            }, error => {
              console.log(error)
            })
        }
      },

      onSuccessfulLoad() {
        this.geojson = JSON.parse(localStorage.getItem('fullJSON'))

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
        this.subjects = this.guessBy === 'capital' ?
          this.geojson.map(item => item.properties.capital) :
          this.geojson.map(item => item.properties.name)
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

      onEachFeature(feature, layer) {
        layer.bindPopup(layer.feature.properties.name)
        layer.on('click', () => {
          this.show(layer)
        }, this)
      },

      show(layer) {
        if (layer.feature.properties.name === this.subjects[this.game.count] ||
          layer.feature.properties.capital === this.subjects[this.game.count]) {
          layer.setStyle({ fillColor: this.randomColor() })
          layer.off('click')
          this.animation = true
          this.resetData()
          this.game.score++
          this.game.rightAnswers++

          if (this.game.count !== this.geojson.length) {
            // end of the game
          }
        } else {
          this.attemptsAnimation = true
          this.game.attempts--

          if (this.game.attempts === 0) {
            this.animation = true
            this.resetData()
            this.subjects.push(this.subjects[this.game.count])
            this.game.score--
          }
        }
      },

      resetData() {
        this.game.count++
        this.game.attempts = 5
        this.seconds = 15
        this.danger = false
      },

      endAnimation() {
        this.animation = false
      },

      endAttemptsAnimation() {
        this.attemptsAnimation = false
      }
    },

    components: {
      Loader,
      Map,
      SvgIcon,
      Modal
    }
  }
</script>

<style scoped>
  .notification {
    position: absolute;
    right: 50px;
    top: 50px;
    width: 300px;
    padding: 20px 20px 10px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #404040;
    background-color: #fff;
    box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.3);
    z-index: 1000;
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
  .digits {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
  }
  .animation {
    animation-name: next;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(.17,.67,.36,1.39);
  }
  .attempts_animation {
    animation: attempts 1s ease;
  }
  .danger {
    animation: danger 1s infinite;
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
  @keyframes attempts {
    25% {
      color: tomato;
    }
    50% {
      color: #404040;
    }
    75% {
      color: tomato;
    }
    100% {
      color: #404040;
    }
  }
  @keyframes danger {
    50% {
      box-shadow: 0 0 20px 5px inset tomato;
    }
  }
</style>
