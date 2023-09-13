<template>
  <ModalTrigger
    default-opened
    persistent
    contained
    title="Congratulations!"
  >
    <template #content>
      <div class="text-h5 text-center">
        You have learnt all {{ fullName }}. Now you can try Game mode and get some amazing score!
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ModalTrigger from '@/components/ModalTrigger.vue'

const route = useRoute()
const routeName = route.params.name || ''

const fullName = computed(() => {
  switch (routeName) {
    case '':
      return 'countries'
    case 'europe':
      return 'European countries'
    case 'asia':
      return 'Asian countries'
    case 'africa':
      return 'African countries'
    case 'na':
      return 'North American countries'
    case 'sa':
      return 'South American countries'
    case 'oceania':
      return 'Oceanian countries'
    default:
      return 'regions'
  }
})
</script>
