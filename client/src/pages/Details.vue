<template>
  <Loader v-show="!loaded" />
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      permanent
      location="right"
      class="pa-3"
      width="356"
    >
      <v-btn
        :icon="drawer ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        class="drawer-btn text-blue"
        :class="{ drawer }"
        @click.stop="drawer = !drawer"
      ></v-btn>
      <p class="text-h4 mb-5">Filters</p>
      <v-row no-gutters align="center" justify="space-between">
        <p class="text-subtitle-1">
          Countries - {{ sortedGeojson.length }}
        </p>
        <v-btn
          variant="outlined"
          color="primary"
          density="compact"
          @click="clearFilters"
        >
          Clear
        </v-btn>
      </v-row>
      <SearchCountriesForm
        :items="countries"
        :showAmount="false"
        @onClick="onClick"
      />
      <v-select
        v-for="(select, key) in selectOptions"
        :key="key"
        :label="select.label"
        v-model="filters[key]"
        variant="outlined"
        density="compact"
        :items="select.data"
        @update:model-value="sortBy(key)"
      ></v-select>
      <v-checkbox
        v-model="showTimezone"
        label="Show Timezones"
        density="compact"
      ></v-checkbox>
    </v-navigation-drawer>
    <v-main v-if="loaded">
      <MapComponent
        :geojson="sortedGeojson"
        :onEachFeature="onEachFeature"
        :world="world"
        :timezones="showTimezone ? timezones : []"
      />
    </v-main>
  </v-layout>
  <DetailsModal :country="selectedCountry" @close="closeModal" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Feature, FeatureCollection } from 'geojson'
import type { Path } from 'leaflet'
import type { CountryType } from '@/types'
import api from '@/api'
import randomColor from '@/utils/randomColor'
import type { SelectValue } from '@/config/selectOptions'
import selectOptions, { ALL, MAX, MIN } from '@/config/selectOptions'
import DetailsModal from '@/modals/DetailsModal.vue'
import Loader from '@/components/Loader.vue'
import MapComponent from '@/components/MapComponent.vue'
import SearchCountriesForm from '@/components/SearchCountriesForm.vue'

type Filters = {
  area: SelectValue
  pop_est: SelectValue
  growthRate: SelectValue
  gdp: SelectValue
  expectancy: SelectValue
  density: SelectValue
  temperature: SelectValue
}

const DEFAULT_FILTERS: Filters = {
  area: ALL,
  pop_est: ALL,
  growthRate: ALL,
  gdp: ALL,
  expectancy: ALL,
  density: ALL,
  temperature: ALL,
}

const drawer = ref(true)
const geojson = ref<FeatureCollection['features']>([])
const world = ref<FeatureCollection['features']>([])
const sortedGeojson = ref<FeatureCollection['features']>([])
const timezones = ref<FeatureCollection['features']>([])
const loaded = ref(false)
const selectedCountry = ref<CountryType>()
const filters = ref<Filters>({ ...DEFAULT_FILTERS })
const showTimezone = ref(false)
const countries = computed(() => {
  return sortedGeojson.value.map(item => item.properties?.name)
})

onMounted(() => {
  Promise.all([api.getMapJSON(), api.getGeoJSON('custom'), api.getTimezoneJSON()])
    .then(([map, custom, timezone]) => {
      world.value = map
      geojson.value = custom
      sortedGeojson.value = custom
      timezones.value = timezone
      loaded.value = true
    })
})

function onEachFeature(feature: Feature, layer: Path) {
  layer.setStyle({ fillColor: randomColor() })
  layer.on('click', () => {
    selectedCountry.value = feature.properties as CountryType
  })
}

function closeModal() {
  selectedCountry.value = undefined
}

function sortBy(type: keyof Filters) {
  showTimezone.value = false
  sortedGeojson.value = []

  if (filters.value[type] === MIN || filters.value[type] === MAX) {
    for (const key in filters.value) {
      if (key !== type) {
        filters.value[key as keyof Filters] = ALL
      }
    }

    const item = geojson.value.reduce((res, geo) => {
      if (filters.value[type] === MIN && Number(geo.properties?.[type]) < Number(res.properties?.[type])) {
        return geo
      }
      if (filters.value[type] === MAX && Number(geo.properties?.[type]) > Number(res.properties?.[type])) {
        return geo
      }
      return res
    })
    sortedGeojson.value.push(item)
    return
  }

  totalSort()
}

function totalSort() {
  let newSorted = [...geojson.value]
  for (const [key, filterValue] of Object.entries(filters.value)) {
    if (filterValue === ALL || filterValue === MIN || filterValue === MAX) {
      filters.value[key as keyof Filters] = ALL
      continue
    }

    if (Math.sign(filterValue) === -1 || Object.is(Math.sign(filterValue), -0)) {
      newSorted = newSorted.filter(item => {
        const value = key === 'density'
          ? Number(item.properties?.pop_est) / Number(item.properties?.area)
          : Number(item.properties?.[key])
        return value < Math.abs(filterValue)
      })
    } else {
      newSorted = newSorted.filter(item => {
        const value = key === 'density'
          ? Number(item.properties?.pop_est) / Number(item.properties?.area)
          : Number(item.properties?.[key])
        return value > filterValue
      })
    }
  }

  sortedGeojson.value = newSorted
}

function onClick(country: string | null) {
  if (!country) {
    return
  }

  const searchingCountry = geojson.value.find(item => (
    item.properties?.name.toLowerCase() === country.toLowerCase()
  ))
  if (searchingCountry) {
    selectedCountry.value = searchingCountry.properties as CountryType
  }
}

function clearFilters() {
  filters.value = { ...DEFAULT_FILTERS }
  sortedGeojson.value = geojson.value
}
</script>

<style scoped>
.drawer-btn {
  position: absolute;
  top: 10px;
  left: 0;
  transform: translateX(-200%);
}

.drawer {
  transform: translateX(-50%);
}
</style>
