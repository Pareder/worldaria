<template>
  <v-dialog
    width="500"
    transition="dialog-bottom-transition"
    :model-value="open"
    @update:model-value="emit('close')"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>{{ country?.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="emit('close')"></v-btn>
      </v-toolbar>
      <v-card-text>
        <div class="text-center">
          <img :src="`/img/flags/${shortName}.svg`" width="150" height="150">
        </div>
        <v-table>
          <tbody>
            <tr>
              <td>Full name</td>
              <td>{{ country?.formal_en ? country.formal_en : country?.name }}</td>
            </tr>
            <tr>
              <td>Capital</td>
              <td>{{ country?.capital }}</td>
            </tr>
            <tr>
              <td>Language</td>
              <td>{{ country?.language }}</td>
            </tr>
            <tr>
              <td>Continent</td>
              <td>{{ country?.continent }}</td>
            </tr>
            <tr>
              <td>Region</td>
              <td>{{ country?.region_wb }}</td>
            </tr>
            <tr>
              <td>Subregion</td>
              <td>{{ country?.subregion }}</td>
            </tr>
            <tr>
              <td>Area</td>
              <td>{{ formatNumber(country?.area) }} km<sup>2</sup></td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{{ country?.type }}</td>
            </tr>
            <tr>
              <td>Government</td>
              <td>{{ country?.government }}</td>
            </tr>
            <tr v-if="country?.pop_est !== -99">
              <td>Population</td>
              <td>{{ formatNumber(country?.pop_est) }}</td>
            </tr>
            <tr v-if="country?.growthRate">
              <td>Growth Rate per year</td>
              <td>{{ country?.growthRate }} %</td>
            </tr>
            <tr v-if="country?.pop_est && country?.area">
              <td>Population Density</td>
              <td>{{ (country.pop_est / country.area).toFixed(2) }} per km<sup>2</sup></td>
            </tr>
            <tr>
              <td>Life expectancy</td>
              <td>{{ country?.expectancy }} years</td>
            </tr>
            <tr>
              <td>Currency</td>
              <td>{{ country?.currency }}</td>
            </tr>
            <tr>
              <td>Economy</td>
              <td>{{ formatString(country?.economy) }}</td>
            </tr>
            <tr>
              <td>Income group</td>
              <td>{{ formatString(country?.income_grp) }}</td>
            </tr>
            <tr v-if="country?.gdp !== -99">
              <td>Gross Domestic Product Per Capita</td>
              <td>${{ formatNumber(country?.gdp) }}</td>
            </tr>
            <tr v-if="country?.military">
              <td>Military expenditures</td>
              <td>{{ country.military }} % of GDP</td>
            </tr>
            <tr v-if="country?.unemployment">
              <td>Unemployment rate</td>
              <td>{{ country.unemployment }} %</td>
            </tr>
            <tr>
              <td>Average Elevation</td>
              <td>{{ country?.elevation }}</td>
            </tr>
            <tr>
              <td>Average Temperature</td>
              <td>{{ country?.temperature }} °C</td>
            </tr>
            <tr v-if="currentTemperature">
              <td>Current Temperature</td>
              <td>{{ currentTemperature.desc }}, {{ currentTemperature.c }} °C</td>
            </tr>
            <tr v-if="country?.hdi">
              <td>
                <v-row no-gutters align="center">
                  <span class="mr-1">HDI</span>
                  <InformationSvg />
                  <v-tooltip activator="parent" max-width="300">
                    The <strong>Human Development Index</strong> (<strong>HDI</strong>) is a statistic composite index
                    of life expectancy, education, and per capita income indicators. A country scores a higher HDI when
                    all indexes are higher.
                  </v-tooltip>
                </v-row>
              </td>
              <td>{{ country.hdi }}</td>
            </tr>
            <tr v-if="country?.homicide">
              <td>Homicide rate</td>
              <td>{{ country.homicide }} per 100,000 inhabitants</td>
            </tr>
            <tr v-if="country?.iso_a2 != -99">
              <td>ISO 2</td>
              <td>{{ country?.iso_a2 }}</td>
            </tr>
            <tr v-if="country?.iso_a3 != -99">
              <td>ISO 3</td>
              <td>{{ country?.iso_a3 }}</td>
            </tr>
            <tr v-if="country?.symbol">
              <td>National Symbol</td>
              <td>{{ country.symbol }}</td>
            </tr>
            <tr v-if="country?.dish">
              <td>National Dish</td>
              <td>{{ country.dish }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { CountryType, TemperatureType } from '@/types'
import { socket } from '@/socket'
import InformationSvg from '@/components/InformationSvg.vue'

const emit = defineEmits(['close'])
const props = defineProps<{ country?: CountryType }>()
const currentTemperature = ref<TemperatureType>()
const shortName = computed(() => (props.country?.name || '').replace(/ /g, '').toLowerCase())
const open = computed(() => Boolean(props.country))

watch(() => props.country, val => {
  if (!val) {
    return
  }

  socket.emit('getWeather', val.capital)
})

onMounted(() => {
  socket.on('weatherResponse', data => {
    currentTemperature.value = data
  })
})

function formatString(value?: string) {
  return (value || '').substring(3)
}

function formatNumber(value?: number) {
  const schema = ['', 'K', 'M', 'B']
  const base = Math.log10(value || 0)
  const index = Math.floor(base / 3)

  return ((value || 0) / Math.pow(10, 3 * index)).toFixed(2) + schema[index]
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
</style>