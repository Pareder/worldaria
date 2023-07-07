<template>
  <div>
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal" :class="end ? 'end' : 'start'">
      <div class="modal-content">
        <img class="cancel" src="@/assets/images/cancel.svg" @click.prevent="closeModal" />
        <h3>{{ country.name }}</h3>
        <img class="flag" :src="`../img/flags/${shortName}.svg`">
        <table>
          <tr>
            <td>Full name</td>
            <td>{{ country.formal_en ? country.formal_en : country.name }}</td>
          </tr>
          <tr>
            <td>Capital</td>
            <td>{{ country.capital }}</td>
          </tr>
          <tr>
            <td>Language</td>
            <td>{{ country.language }}</td>
          </tr>
          <tr>
            <td>Continent</td>
            <td>{{ country.continent }}</td>
          </tr>
          <tr>
            <td>Region</td>
            <td>{{ country.region_wb }}</td>
          </tr>
          <tr>
            <td>Subregion</td>
            <td>{{ country.subregion }}</td>
          </tr>
          <tr>
            <td>Area</td>
            <td>{{ formatNumber(country.area) }} km<sup>2</sup></td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{{ country.type }}</td>
          </tr>
          <tr>
            <td>Government</td>
            <td>{{ country.government }}</td>
          </tr>
          <tr v-if="country.pop_est !== -99">
            <td>Population</td>
            <td>{{ formatNumber(country.pop_est) }}</td>
          </tr>
          <tr v-if="country.growthRate">
            <td>Growth Rate per year</td>
            <td>{{ country.growthRate }} %</td>
          </tr>
          <tr>
            <td>Population Density</td>
            <td>{{ (country.pop_est / country.area).toFixed(2) }} per km<sup>2</sup></td>
          </tr>
          <tr>
            <td>Life expectancy</td>
            <td>{{ country.expectancy }} years</td>
          </tr>
          <tr>
            <td>Currency</td>
            <td>{{ country.currency }}</td>
          </tr>
          <tr>
            <td>Economy</td>
            <td>{{ formatString(country.economy) }}</td>
          </tr>
          <tr>
            <td>Income group</td>
            <td>{{ formatString(country.income_grp) }}</td>
          </tr>
          <tr v-if="country.gdp !== -99">
            <td>Gross Domestic Product Per Capita</td>
            <td>${{ formatNumber(country.gdp) }}</td>
          </tr>
          <tr v-if="country.military">
            <td>Military expenditures</td>
            <td>{{ country.military }} % of GDP</td>
          </tr>
          <tr v-if="country.unemployment">
            <td>Unemployment rate</td>
            <td>{{ country.unemployment }} %</td>
          </tr>
          <tr>
            <td>Average Elevation</td>
            <td>{{ country.elevation }}</td>
          </tr>
          <tr>
            <td>Average Temperature</td>
            <td>{{ country.temperature}} °C</td>
          </tr>
          <tr v-if="currentTemperature">
            <td>Current Temperature</td>
            <td>{{ currentTemperature.desc }}, {{ currentTemperature.c }} °C</td>
          </tr>
          <tr v-if="country.hdi">
            <td class="relative">
              <span class="mode_name">
                HDI
                <InformationSvg />
              </span>
              <div class="hidden">
                <p class="px5 text--normal">
                  The <strong>Human Development Index</strong> (<strong>HDI</strong>) is a statistic composite index
                  of life expectancy, education, and per capita income indicators. A country scores a higher HDI when
                  all indexes are higher.
                </p>
              </div>
            </td>
            <td>{{ country.hdi }}</td>
          </tr>
          <tr v-if="country.homicide">
            <td>Homicide rate</td>
            <td>{{ country.homicide }} per 100,000 inhabitants</td>
          </tr>
          <tr v-if="country.iso_a2 != -99">
            <td>ISO 2</td>
            <td>{{ country.iso_a2 }}</td>
          </tr>
          <tr v-if="country.iso_a3 != -99">
            <td>ISO 3</td>
            <td>{{ country.iso_a3 }}</td>
          </tr>
          <tr v-if="country.symbol">
            <td>National Symbol</td>
            <td>{{ country.symbol }}</td>
          </tr>
          <tr v-if="country.dish">
            <td>National Dish</td>
            <td>{{ country.dish }}</td>
          </tr>
        </table>
      </div>
      <div class="gradient"></div>
    </div>
  </div>
</template>

<script>
import { socket } from '@/socket'
import InformationSvg from '@/components/InformationSvg.vue'

export default {
  data() {
    return {
      end: false,
      currentTemperature: false
    }
  },

  props: {
    country: {
      type: Object
    }
  },

  computed: {
    shortName() {
      return this.country.name.replace(/ /g, '').toLowerCase()
    }
  },

  created() {
    socket.emit('getWeather', this.country.capital)
    socket.on('weatherResponse', data => {
      this.currentTemperature = data
    })
  },

  methods: {
    formatString(value) {
      return value.substring(3)
    },

    formatNumber(value) {
      const schema = ['', 'K', 'M', 'B']
      const base = Math.log10(value)
      const index = Math.floor(base / 3)

      return (value / Math.pow(10, 3 * index)).toFixed(2) + schema[index]
    },

    closeModal() {
      this.end = true
      setTimeout(() => {
        this.$emit('close')
      }, 600)
    }
  },

  components: {
    InformationSvg
  }
}
</script>

<style scoped lang="scss">
  ::-webkit-scrollbar {
      width: 5px;
  }
  ::-webkit-scrollbar-track {
      background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
      background: #555;
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    width: 100%;
    max-width: 500px;
    height: 90vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    z-index: 1051;
    background: #fff;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.3);
  }
  .modal::before {
    background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
    content: "";
    display: block;
    height: 3px;
    width: 100%;
  }
  .gradient {
    position: absolute;
    height: 60px;
    bottom: 0;
    left: 0;
    right: 5px;
    z-index: 2000;
    background: linear-gradient(to top, #fff 50%, transparent);
  }
  @media screen and (max-width: 500px) {
    .modal {
      height: 100vh;
    }
  }
  .modal-content {
    position: absolute;
    top: 3px;
    bottom: 0;
    overflow-y: scroll;
    z-index: 1052;
    padding: 30px 15px 50px 20px;
    background: #fff;
    font-size: 17px;
  }
  .start {
    -webkit-animation: tiltup 0.7s;
    -moz-animation: tiltup 0.7s;
    -ms-animation: tiltup 0.7s;
    animation: tiltup 0.7s;
  }
  .end {
    -webkit-animation: tiltbottom 0.7s;
    -moz-animation: tiltbottom 0.7s;
    -ms-animation: tiltbottom 0.7s;
    animation: tiltbottom 0.7s;
  }
  .cancel {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  .cancel:hover {
    transform: scale(1.2);
  }
  .flag {
    width: 150px;
    height: 150px;
  }
  h3 {
    margin: 0;
    font-size: 30px;
  }
  table {
    border-collapse: collapse;
  }
  tr {
    height: 50px;
  }
  tr:nth-child(odd) {
    background-color: #e5e5e5;
  }
  tr > td:first-child {
    font-weight: bold;
  }
  td {
    width: 50%;
  }
  @keyframes tiltup {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes tiltbottom {
    100% {
      opacity: 0;
    }
  }
  .relative {
    position: relative;
  }
  .text--normal {
    font-weight: normal;
  }
  tr {
    visibility: hidden;
    animation: rolldown .5s 1;
    transform-origin: 50% 0;
    animation-fill-mode: forwards;
  }
  @for $i from 1 through 28 {
    table tr:nth-child(#{$i}n) {
      animation-delay: #{$i * 0.15}s;
    }
  }
  @keyframes rolldown {
    0% {
      visibility: visible;
      transform: rotateX(180deg) perspective(500px);
    }
    70% {
      visibility: visible;
      transform: rotateX(-20deg);
    }
    100% {
      visibility: visible;
      transform: none;
    }
  }
</style>