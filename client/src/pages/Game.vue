<template>
  <SavedGame v-if="saved" @getSaved="getSaved" />
  <Loader v-else :is-loading="!loaded">
    <GameMode mode="game" :geojson="geojson" :world="world" />
  </Loader>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FeatureCollection } from 'geojson'
import api from '@/api'
import SavedGame from '@/modals/SavedGame.vue'
import GameMode from '@/components/GameMode.vue'
import Loader from '@/components/Loader.vue'

const route = useRoute()
const geojson = ref<FeatureCollection['features']>([])
const world = ref<FeatureCollection['features']>([])
const saved = ref(false)
const loaded = ref(false)

onMounted(() => {
  if (localStorage.getItem('guessed') && !route.query.sort) {
    saved.value = true
    return
  }

  if (route.query.sort) {
    getWorld()
  }

  getContinent()
})

async function getWorld() {
  world.value = await api.getMapJSON()
}

async function getContinent() {
  geojson.value = (await api.getFullJSON()).filter(item => (
    item.properties &&
    'pop_est' in item.properties &&
    item.properties.pop_est > (route.query.sort || 0)
  ))
  loaded.value = true
}

function getSaved() {
  saved.value = false
  getContinent()
}
</script>