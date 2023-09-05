<template>
  <Game>
    <template #drawer="{ country }">
      {{ country.capital }}
    </template>
  </Game>
</template>

<script setup lang="ts">
import Game from '@/components/Game.vue'
</script>
