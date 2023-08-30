<template>
  <ModalTrigger
    default-opened
    persistent
    title="Congratulations!"
  >
    <template #content>
      <div  class="text-h5 text-center">
        You have guessed all the countries.
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import ModalTrigger from '@/components/ModalTrigger.vue'
</script>
