<template>
  <v-sheet elevation="1" rounded>
    <v-row
      v-for="(user, id) in users"
      :key="id"
      no-gutters
      justify="space-between"
      class="user flex-nowrap text-subtitle-1 py-1 px-2"
      :style="{ backgroundColor: user.color, color: getContrastColor(user.color) }"
    >
      <v-tooltip :text="user.name">
        <template v-slot:activator="{ props }">
          <span v-bind="props" class="text-truncate">{{ user.name }}</span>
        </template>
      </v-tooltip>
      <span>{{ user.score }}</span>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import type { OnlineUserType } from '@/types'
import { getContrastColor } from '@/config/colors'

defineProps<{
  users: OnlineUserType[]
}>()
</script>

<style scoped>
.user {
  gap: 8px;
}
</style>
