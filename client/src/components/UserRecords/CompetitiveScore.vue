<template>
  <v-chip :color="color" :append-icon="icon">
    {{ first }} / {{ last }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  first: number
  last: number
}>()

const color = computed(() => {
  if (props.first > props.last) {
    return 'green'
  }

  if (props.first < props.last) {
    return 'red'
  }

  return 'grey'
})

const icon = computed(() => {
  if (props.first > props.last) {
    return 'mdi-crown'
  }

  if (props.first < props.last) {
    return 'mdi-thumb-down'
  }

  return 'mdi-equal'
})
</script>
