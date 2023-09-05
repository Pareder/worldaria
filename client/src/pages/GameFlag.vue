<template>
  <Game>
    <template #drawer="{ country }">
      <SvgIcon :country="country.name" />
    </template>
  </Game>
</template>

<script setup lang="ts">
import Game from '@/components/Game.vue'
import SvgIcon from '@/components/SvgIcon.vue'
</script>
