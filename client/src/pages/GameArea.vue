<template>
  <Loader :is-loading="isLoading">
    <FinishGame v-if="game.count === countries.length" :score="game.score"></FinishGame>
    <Drawer v-else :game="game" :hasTimeLimit="hasTimeLimit">
      <div class="map">
        <LMap :options="options" ref="map">
          <LGeoJson
            :geojson="geojson[game.count]"
            :options="countryOptions"
            @ready="zoomCountry"
          ></LGeoJson>
        </LMap>
      </div>
    </Drawer>
    <MapComponent
      ref="worldMap"
      bot-mode="extreme"
      :geojson="geojson"
      :onEachFeature="onEachFeature"
      :world="world"
    />
  </Loader>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { LMap, LGeoJson } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import type { Feature, FeatureCollection } from 'geojson'
import type { Path, Map } from 'leaflet'
import api from '@/api'
import Drag from '@/utils/Drag'
import compareRandom from '@/utils/compareRandom'
import pointInLayer from '@/utils/pointInLayer'
import randomColor from '@/utils/randomColor'
import Drawer from '@/components/Drawer.vue'
import FinishGame from '@/modals/FinishGame.vue'
import Loader from '@/components/Loader.vue'
import MapComponent from '@/components/MapComponent.vue'

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
const map = ref<{ leafletObject: Map }>()
const worldMap = ref<{
  $refs: {
    map: {
      leafletObject: Map
    }
  }
}>()
const hasTimeLimit = route.query.mode === 'hard'
const options = {
  renderer: L.svg(),
  dragging: false,
  doubleClickZoom: false,
  boxZoom: false,
  scrollWheelZoom: false,
  keyboard: false,
  touchZoom: false,
  tap: false,
}
const countryOptions = {
  fill: true,
  fillColor: '#fff',
  fillOpacity: 1,
  stroke: true,
  weight: 2,
  color: '#000',
}

onMounted(async () => {
  await Promise.all([api.getMapJSON(), api.getFullJSON()]).then(([map, full]) => {
    world.value = map
    geojson.value = full
      .filter(item => route.query.sort === 'all' || (
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
  setMiniMap()
  if (game.value.count === game.value.length) {
    clearInterval(interval.value)
  }
}

function answerWrong() {
  game.value.attempts--
  if (game.value.attempts === 0) {
    game.value.score--
    resetData()
  }
}

function onEachFeature(feature: Feature, layer: Path) {
  const name = feature.properties?.name || ''
  layer.bindPopup(name)
  layer.on('click', answerWrong)
}

function zoomCountry() {
  new Drag(document.querySelector('.map') as HTMLElement, onDrop)
  setMiniMap(true)
}

function setMiniMap(isMount = false) {
  nextTick(() => {
    const group = L.featureGroup()
    map.value?.leafletObject.eachLayer(layer => {
      if (isMount || 'feature' in layer) {
        group.addLayer(layer)
      }
    })

    map.value?.leafletObject?.fitBounds(group.getBounds())
  })
}

function onDrop(event: DragEvent | TouchEvent | Touch) {
  // TODO: Seems like this code smells
  const map = worldMap.value?.$refs?.map?.leafletObject
  if (!map) {
    return
  }

  const coordinates = map.containerPointToLatLng(L.point([
    'clientX' in event ? event.clientX : 0,
    'clientY' in event ? event.clientY : 0,
  ]))
  if (!coordinates) {
    return
  }

  const layers = pointInLayer(coordinates, map)
  for (const layer of layers) {
    if ('feature' in layer
      && (layer.feature as any)?.properties?.name === countries.value[game.value.count].name
    ) {
      if ('setStyle' in layer && typeof layer.setStyle === 'function') {
        layer.setStyle({ fillColor: randomColor() })
      }

      game.value.score += game.value.attempts
      resetData()
      return
    }
  }

  answerWrong()
}
</script>

<style scoped>
.map {
  height: 200px;
  background-color: transparent;
}

.map:deep(.leaflet-container) {
  background-color: transparent;
}
</style>
