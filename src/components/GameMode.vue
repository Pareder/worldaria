<template>
  <div id="map">
    <Capital v-if="right" :country="countries[game.count].name" :capitals="capitals" :rightCapital="countries[game.count].capital" @check="checkCapital" />
    <Modal v-if="game.count === countries.length" :mode="mode" :score="game.score" />
    <div v-else class="notification" :class="animation ? 'animation' : ''" @animationend="endAnime" @webkitAnimationEnd="endAnime" @msAnimationEnd="endAnime" @mozAnimationEnd="endAnime">
      <p><span class="bold">{{ game.right_answers }}</span> of {{ geojson.length }}</p>
      <div class="country" v-if="game.count !== countries.length">
        {{ countries[game.count].name }}
      </div>
      <div class="digits">
        Score: {{ game.score }}
        <span class="attempts">
          Attempts: 
          <span :class="attempts_animation ? 'attempts_animation' : ''" @animationend="endAttemptsAnime" @webkitAnimationEnd="endAttemptsAnime" @msAnimationEnd="endAttemptsAnime" @mozAnimationEnd="endAttemptsAnime">{{ game.attempts }}</span>
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
  data () {
    return {
      countries: [],
      game: {
        count: 0,
        attempts: 5,
        score: 0,
        right_answers: 0
      },
      animation: false,
      attempts_animation: false,
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
      required: true
    },
    world: {
      type: Array
    }
  },
  created () {
    if (!this.$route.params.sort && localStorage.getItem('guessed')) {
      this.guessedCountries = JSON.parse(localStorage.getItem('guessed')).guessedCountries
      this.game.score = JSON.parse(localStorage.getItem('guessed')).score
      this.game.right_answers = this.guessedCountries.length
    }

    this.countries = this.geojson.filter(item => !this.guessedCountries.includes(item.properties.name)).map(item => { 
      return { name: item.properties.name, capital: item.properties.capital }
    })
    this.countries.sort(this.compareRandom)
  },
  mounted () {
    this.$emit('stopLoader')
  },
  methods: {
    onEachFeature (feature, layer) {
      if (!this.$route.params.sort && this.guessedCountries.includes(layer.feature.properties.name)) {
        layer.setStyle({ fillColor: this.randomColor() })
      } else {
        layer.bindPopup(layer.feature.properties.name)
        layer.on('click', () => {
          this.show(layer)
        }, this)
      }
    },
    show (layer) {
      this.capitals = []
      if (layer.feature.properties.name === this.countries[this.game.count].name) {
        this.makeCapitals()
        this.right = true
        this.game.score++
        this.game.right_answers++
        layer.setStyle({ fillColor: this.randomColor() })
        layer.off('click')        
      } else {
        this.attempts_animation = true
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
      this.capitals.push({ name: this.countries[this.game.count].capital, isAnswered: false })
      while (this.capitals.length < 4) {
        let randomnumber = Math.floor(Math.random() * this.countries.length)
        if (this.capitals.map(item => item.name).includes(this.countries[randomnumber].capital)) {
          continue
        }
        this.capitals.push({name: this.countries[randomnumber].capital, isAnswered: false})
      }
      this.capitals.sort(this.compareRandom)
    },
    checkCapital (answered) {
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
    endAnime () {
      this.animation = false
    },
    endAttemptsAnime () {
      this.attempts_animation = false
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