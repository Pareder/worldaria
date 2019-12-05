<template>
  <div id="map">
    <Capital
      v-if="right"
      :country="countries[game.count].name"
      :capitals="capitals"
      :rightCapital="countries[game.count].capital"
      @check="checkCapital"
    />
    <Modal v-if="game.count === countries.length" :mode="mode" :score="game.score" />
    <div
      v-else
      class="notification"
      :class="{ animation }"
      @animationend="endAnimation"
      @webkitAnimationEnd="endAnimation"
      @msAnimationEnd="endAnimation"
      @mozAnimationEnd="endAnimation"
    >
      <p>
        <span class="bold">{{ game.rightAnswers }}</span> of {{ geojson.length }}
      </p>
      <div class="country" v-if="game.count !== countries.length">
        {{ countries[game.count].name }}
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
    <Map :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
  </div>
</template>

<script>
import Modal from '../modals/Modal'
import Map from './Map'
import Capital from '../modals/Capital'

export default {
  data() {
    return {
      countries: [],
      game: {
        count: 0,
        attempts: 5,
        score: 0,
        rightAnswers: 0
      },
      animation: false,
      attemptsAnimation: false,
      right: false,
      capitals: [],
      guessedCountries: []
    }
  },

  props: {
    mode: {
      type: String,
      required: true
    },
    geojson: {
      type: Array,
      required: true
    },
    world: {
      type: Array
    }
  },

  created() {
    const guessedResult = JSON.parse(localStorage.getItem('guessed'))

    if (!this.$route.params.sort && guessedResult) {
      this.guessedCountries = guessedResult.guessedCountries
      this.game = {
        ...this.game,
        score: guessedResult.score,
        rightAnswers: this.guessedCountries.length
      }
    }

    this.countries = this.geojson.filter(item => !this.guessedCountries.includes(item.properties.name)).map(item => { 
      return { name: item.properties.name, capital: item.properties.capital }
    })
    this.countries.sort(this.compareRandom)
  },

  mounted() {
    this.$emit('stopLoader')
  },

  methods: {
    onEachFeature(feature, layer) {
      if (!this.$route.params.sort && this.guessedCountries.includes(layer.feature.properties.name)) {
        layer.setStyle({ fillColor: this.randomColor() })
      } else {
        layer.bindPopup(layer.feature.properties.name)
        layer.on('click', () => {
          this.show(layer)
        }, this)
      }
    },

    show(layer) {
      this.capitals = []

      if (layer.feature.properties.name === this.countries[this.game.count].name) {
        this.makeCapitals()
        this.right = true
        this.game.score++
        this.game.rightAnswers++
        layer.setStyle({ fillColor: this.randomColor() })
        layer.off('click')        
      } else {
        this.attemptsAnimation = true
        this.game.attempts--

        if (this.game.attempts === 0) {
          this.animation = true
          this.countries.push(this.countries[this.game.count])
          this.game.count++
          this.game.attempts = 5
          this.game.score--
        }
      }
    },

    makeCapitals() {
      this.capitals.push({
        name: this.countries[this.game.count].capital,
        isAnswered: false
      })

      while (this.capitals.length < 4) {
        const randomNumber = Math.floor(Math.random() * this.countries.length)

        if (this.capitals.map(item => item.name).includes(this.countries[randomNumber].capital)) {
          continue
        }

        this.capitals.push({name: this.countries[randomNumber].capital, isAnswered: false})
      }

      this.capitals.sort(this.compareRandom)
    },

    checkCapital(answered) {
      if (answered) {
        this.game.score++
      }

      this.right = false
      this.animation = true
      this.guessedCountries.push(this.countries[this.game.count].name)
      this.game.count++

      if (this.game.count === this.countries.length) {
        localStorage.removeItem('guessed')
        return
      }

      this.game.attempts = 5

      if (!this.$route.params.sort) {
        localStorage.setItem('guessed', JSON.stringify({
          guessedCountries: this.guessedCountries,
          score: this.game.score
        }))
      }
    },

    endAnimation() {
      this.animation = false
    },

    endAttemptsAnimation() {
      this.attemptsAnimation = false
    }
  },

  components: {
    Map,
    Modal,
    Capital,
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
    z-index: 900;
  }
  .notification p {
    position: absolute;
    top: 5px;
    right: 5px;
    margin: 0;
    font-size: 14px;
  }
  .country {
    font-size: 22px;
  }
  .digits {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
  }
  @media screen and (max-width: 400px) {
    .notification {
      right: 0;
      top: 0;
      width: 100%;
    }
  }
  .animation {
    animation-name: next;
    animation-duration: 0.5s;
    animation-timing-function: ease-in-out;
  }
  .attempts_animation {
    animation: attempts 1s ease;
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
</style>