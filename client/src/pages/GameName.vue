<template>
  <Game>
    <template #drawer="{ country }">
      {{ country.name }}
    </template>
  </Game>
</template>

<script setup>
import Game from '@/components/Game.vue'
</script>
