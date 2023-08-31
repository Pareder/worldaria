<template>
  <ModalTrigger
    title="You have been invited to Online game"
    default-opened
    persistent
  >
    <template #content>
      You have been invited to game in mode
      <span class="mode__name">{{ capitalizedType }}</span>
      <span class="population">population: {{ modeName }}</span>
      by <span class="text-blue">{{ opponent }}</span>
      <div class="my-4 text-center">
        <v-btn
          variant="elevated"
          color="primary"
          size="large"
          class="mr-2"
          @click="$emit('makeDecision', true)"
        >
          Accept
        </v-btn>
        <v-btn variant="outlined" color="error" size="large" @click="$emit('makeDecision', false)">
          Decline
        </v-btn>
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { populationOptions } from '@/config'
import capitalize from '@/utils/capitalize'
import ModalTrigger from '@/components/ModalTrigger.vue'

const props = defineProps<{
  opponent: string
  mode?: string | number
  type?: string
}>()

const capitalizedType = capitalize(props.type)
const modeName = computed(() => {
  const option = populationOptions.find(option => option.value === props.mode)
  return option?.name || 'all'
})
</script>

<style scoped>
.mode__name {
  padding: 0 5px;
  background-color: #000;
  color: #fff;
}

.population {
  margin-left: 5px;
  padding: 0 5px;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>