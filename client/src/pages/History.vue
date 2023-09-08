<template>
  <Loader :is-loading="!loaded">
    <v-row
      no-gutters
      class="slider"
      :class="{ mobile }"
    >
      <v-btn
        :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
        color="secondary"
        @click="play"
      ></v-btn>
      <v-slider
        v-model="value"
        :direction="direction"
        :max="options.length - 1"
        step="1"
        hide-details
        show-ticks="always"
        :ticks="ticks"
        tick-size="4"
        color="primary"
        @update:model-value="createGeo"
      ></v-slider>
    </v-row>
    <MapComponent :geojson="geojson" :onEachFeature="onEachFeature" :world="world" />
  </Loader>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import type { Feature, FeatureCollection } from 'geojson'
import type { Path } from 'leaflet'
import api from '@/api'
import randomColor from '@/utils/randomColor'
import Loader from '@/components/Loader.vue'
import MapComponent from '@/components/MapComponent.vue'

const { mobile } = useDisplay()
const world = ref<FeatureCollection['features']>([])
const geojson = ref<FeatureCollection['features']>([])
const loaded = ref(false)
const value = ref(0)
const isPlaying = ref(false)
const interval = ref<ReturnType<typeof setInterval>>()
const options = [
  '2000 BC',
  '1000 BC',
  '500 BC',
  '200 BC',
  '1 BC',
  '400',
  '600',
  '800',
  '1000',
  '1279',
  '1492',
  '1530',
  '1650',
  '1715',
  '1783',
  '1815',
  '1880',
  '1914',
  '1920',
  '1938',
  '1945',
  '1994',
]
const ticks = options.reduce<Record<string, string>>((obj, value, index) => {
  obj[index] = value
  return obj
}, {})
const direction = computed(() => mobile.value ? 'vertical' : 'horizontal')

onMounted(async () => {
  world.value = await api.getMapJSON()
  await createGeo()
  loaded.value = true
})

async function createGeo() {
  const period = options[value.value].replace(' ', '').toLowerCase()
  geojson.value = await api.getGeoJSON(`history/${period}`)
}

function onEachFeature(feature: Feature, layer: Path) {
  layer.setStyle({ fillColor: randomColor() })
  layer.bindPopup(feature.properties?.name || '')
}

function play() {
  isPlaying.value = !isPlaying.value
  clearInterval(interval.value)
  if (!isPlaying.value) {
    return
  }

  interval.value = setInterval(() => {
    value.value = value.value + 1
    createGeo()
    if (value.value >= options.length - 1) {
      isPlaying.value = false
      clearInterval(interval.value)
    }
  }, 2000)
}
</script>

<style scoped>
.slider {
  position: fixed;
  z-index: 800;
  bottom: 20px;
  left: 0;
  right: 0;
  padding: 0 16px;
  gap: 16px;
  align-items: center;
}

.mobile {
  top: 10px;
  bottom: 10px;
  right: 32px;
  left: unset;
  flex-direction: column;
  align-items: flex-start;
}
</style>