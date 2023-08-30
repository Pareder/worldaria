<template>
  <div id="map">
    <Capital
      v-if="right"
      :country="countries[game.count].name"
      :capitals="capitals"
      :rightCapital="countries[game.count].capital"
      @check="checkCapital"
    />
    <FinishGame v-if="game.count === countries.length" :score="game.score"></FinishGame>
    <Drawer v-else :game="game">
      {{ countries[game.count].name }}
    </Drawer>
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
  </div>
</template>

<script>
import randomColor from '@/utils/randomColor'
import Capital from '@/modals/Capital.vue'
import Drawer from '@/components/Drawer.vue'
import FinishGame from '@/modals/FinishGame.vue'
import MapComponent from '@/components/MapComponent.vue'

export default {
  data() {
    return {
      countries: [],
      game: {
        count: 0,
        attempts: 5,
        score: 0,
        rightAnswers: 0,
        length: this.geojson.length,
      },
      right: false,
      capitals: [],
      guessedCountries: [],
    }
  },

  props: {
    mode: {
      type: String,
      required: true,
    },
    geojson: {
      type: Array,
      required: true,
    },
    world: {
      type: Array,
    },
  },

  created() {
    const guessedResult = JSON.parse(localStorage.getItem('guessed'))

    if (!this.$route.query.sort && guessedResult) {
      this.guessedCountries = guessedResult.guessedCountries
      this.game = {
        ...this.game,
        score: guessedResult.score,
        rightAnswers: this.guessedCountries.length,
      }
    }

    this.countries = this.geojson
      .filter(item => !this.guessedCountries.includes(item.properties.name)).map(item => ({
        name: item.properties.name,
        capital: item.properties.capital,
      }))
      .sort(this.compareRandom)
  },

  mounted() {
    this.$emit('stopLoader')
  },

  methods: {
    onEachFeature(feature, layer) {
      if (!this.$route.query.sort && this.guessedCountries.includes(layer.feature.properties.name)) {
        layer.setStyle({ fillColor: randomColor() })
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
        layer.setStyle({ fillColor: randomColor() })
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
      this.capitals.push(this.countries[this.game.count].capital)

      while(this.capitals.length < 4) {
        const randomNumber = Math.floor(Math.random() * this.countries.length)

        if (this.capitals.includes(this.countries[randomNumber].capital)) {
          continue
        }

        this.capitals.push(this.countries[randomNumber].capital)
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

      if (!this.$route.query.sort) {
        localStorage.setItem('guessed', JSON.stringify({
          guessedCountries: this.guessedCountries,
          score: this.game.score,
        }))
      }
    },
  },

  components: {
    Capital,
    Drawer,
    FinishGame,
    MapComponent,
  },
}
</script>
