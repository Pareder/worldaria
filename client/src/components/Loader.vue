<template>
  <div v-if="isLoading">
    <v-overlay
      :model-value="true"
      persistent
      color="secondary"
      class="d-flex align-center justify-center"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
defineProps<{ isLoading: boolean }>()
</script>