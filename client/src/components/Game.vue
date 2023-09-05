<template>
  <Loader :is-loading="isLoading">
    <FinishGame v-if="game.count === countries.length" :score="game.score"></FinishGame>
    <Drawer v-else :game="game" :hasTimeLimit="hasTimeLimit">
      <slot name="drawer" :country="countries[game.count]" :geojson="geojson[game.count]">
        {{ countries[game.count].name }}
      </slot>
    </Drawer>
    <MapComponent
      :geojson="geojson"
      :onEachFeature="onEachFeature"
      :world="world"
    />
  </Loader>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Feature, FeatureCollection } from 'geojson'
import type { Path } from 'leaflet'
import api from '@/api'
import compareRandom from '@/utils/compareRandom'
import randomColor from '@/utils/randomColor'
import Drawer from '@/components/Drawer.vue'
import FinishGame from '@/modals/FinishGame.vue'
import MapComponent from '@/components/MapComponent.vue'
import Loader from '@/components/Loader.vue'

const route = useRoute()
const geojson = ref<FeatureCollection['features']>([])
const world = ref<FeatureCollection['features']>([])
const countries = ref<{
  name: string
  capital: string
}[]>([])
const isLoading = ref(true)
const game = ref({
  count: 0,
  attempts: 5,
  score: 0,
  length: 0,
  seconds: 15,
})
const interval = ref<ReturnType<typeof setInterval>>()
const hasTimeLimit = route.query.mode === 'hard'

onMounted(async () => {
  await Promise.all([api.getMapJSON(), api.getFullJSON()]).then(([map, full]) => {
    world.value = map
    geojson.value = full
      .filter(item => !route.query.sort || (
        item.properties &&
        'pop_est' in item.properties &&
        item.properties.pop_est > (route.query.sort || 0)
      ))
      .sort(compareRandom)
    countries.value = geojson.value.map(item => ({
      name: item.properties?.name || '',
      capital: item.properties?.capital || '',
    }))
    game.value.length = countries.value.length

    if (hasTimeLimit) {
      interval.value = setInterval(() => {
        game.value.seconds--
        if (game.value.seconds === 0) {
          game.value.score--
          resetData()
        }
      }, 1000)
    }
  })
  isLoading.value = false
})

onUnmounted(() => clearInterval(interval.value))

function resetData() {
  game.value.attempts = 5
  game.value.seconds = 15
  game.value.count++
  if (game.value.count === game.value.length) {
    clearInterval(interval.value)
  }
}

function onEachFeature(feature: Feature, layer: Path) {
  const name = feature.properties?.name || ''
  layer.bindPopup(name)
  layer.on('click', () => {
    if (name === countries.value[game.value.count].name) {
      game.value.score += game.value.attempts
      layer.setStyle({ fillColor: randomColor() })
      layer.off('click')
      resetData()
    } else {
      game.value.attempts--

      if (game.value.attempts === 0) {
        game.value.score--
        resetData()
      }
    }
  })
}
</script>
