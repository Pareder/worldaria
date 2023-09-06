<template>
  <ModalTrigger
    title="You have been invited to Online game"
    default-opened
    persistent
  >
    <template #content>
      You have been invited to game in mode
      <span class="mode">{{ type }}</span>
      <span class="sort">population: {{ sort }}</span>
      by <span :style="{ color: invite.color }">{{ invite.myName }}</span>
      <p class="text-subtitle-2 mt-3 mb-1">Choose your color</p>
      <v-color-picker
        v-model="color"
        hide-inputs
        class="picker"
        width="100%"
      ></v-color-picker>
      <div class="my-4 text-center">
        <v-btn
          variant="elevated"
          color="primary"
          size="large"
          class="mr-2"
          @click="makeDecision(true)"
        >
          Accept
        </v-btn>
        <v-btn variant="outlined" color="error" size="large" @click="makeDecision(false)">
          Decline
        </v-btn>
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InviteType } from '@/types'
import { ENEMY_COLOR } from '@/config/colors'
import { populationOptions } from '@/config'
import capitalize from '@/utils/capitalize'
import ModalTrigger from '@/components/ModalTrigger.vue'

const emit = defineEmits(['makeDecision'])
const props = defineProps<{ invite: InviteType }>()
const color = ref(ENEMY_COLOR)
const type = capitalize(props.invite.type)
const sort = computed(() => {
  const option = populationOptions.find(option => option.value === props.invite.sort)
  return option?.title || 'all'
})

function makeDecision(status: boolean) {
  emit('makeDecision', status, color.value)
}
</script>

<style scoped lang="scss">
.mode {
  padding: 0 5px;
  background-color: #000;
  color: #fff;
}

.sort {
  margin-left: 5px;
  padding: 0 5px;
  background-color: rgba(0, 0, 0, 0.2);
}

.picker {
  &:deep(.v-color-picker-preview__alpha) {
    display: none;
  }
  &:deep(.v-color-picker-preview__dot) {
    border: 1px solid black;
  }
}
</style>