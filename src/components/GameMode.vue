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
    <Drawer v-else :game="game">
      <div class="country" v-if="game.count !== countries.length">
        {{ countries[game.count].name }}
      </div>
    </Drawer>
    <Map :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
  </div>
</template>

<script>
import Modal from '../modals/Modal'
import Map from './Map'
import Capital from '../modals/Capital'
import Drawer from './Drawer'

export default {
  data() {
    return {
      countries: [],
      game: {
        count: 0,
        attempts: 5,
        score: 0,
        rightAnswers: 0,
        length: this.geojson.length
      },
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
        this.game.attempts--

        if (this.game.attempts === 0) {
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

        this.capitals.push({ name: this.countries[randomNumber].capital, isAnswered: false })
      }

      this.capitals.sort(this.compareRandom)
    },

    checkCapital(answered) {
      if (answered) {
        this.game.score++
      }

      this.right = false
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
    }
  },

  components: {
    Map,
    Modal,
    Capital,
    Drawer
  }
}
</script>

<style scoped>
  .country {
    font-size: 22px;
  }
</style>