<template>
  <v-sheet elevation="1" rounded>
    <v-row
      v-for="(user, id) in users"
      :key="id"
      no-gutters
      justify="space-between"
      class="user flex-nowrap text-subtitle-1 text-white py-1 px-2"
      :class="user === nickname ? 'bg-blue' : 'bg-red'"
    >
      <v-tooltip :text="user">
        <template v-slot:activator="{ props }">
          <span v-bind="props" class="text-truncate">{{ user }}</span>
        </template>
      </v-tooltip>
      <span>{{ user === nickname ? score.my : score.enemy }}</span>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
defineProps<{
  users: string[]
  nickname: string
  score: {
    my: number
    enemy: number
  }
}>()
</script>

<style scoped>
.user {
  gap: 8px;
}
</style>
