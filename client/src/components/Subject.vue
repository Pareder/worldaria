<template>
  <Loader :is-loading="!loaded">
    <LearnMode :geojson="geojson" />
  </Loader>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FeatureCollection } from 'geojson'
import api from '@/api'
import LearnMode from '@/components/LearnMode.vue'
import Loader from '@/components/Loader.vue'

const route = useRoute()
const loaded = ref(false)
const geojson = ref<FeatureCollection['features']>([])
const name = [route.params.name].flat()[0] || 'full'

onMounted(async () => {
  geojson.value = await api.getGeoJSON(name)
  loaded.value = true
})
</script>