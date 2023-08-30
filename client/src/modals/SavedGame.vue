<template>
  <ModalTrigger
    default-opened
    persistent
    title="You have saved game"
  >
    <template #content>
      Do you want to continue?
      <div class="mt-2 text-center">
        <v-btn variant="elevated" color="primary" class="mr-2" @click="$emit('getSaved')">
          Continue
        </v-btn>
        <v-btn variant="outlined" color="primary" @click="deleteStorage">
          New
        </v-btn>
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import ModalTrigger from '@/components/ModalTrigger.vue'

const emit = defineEmits(['getSaved'])

function deleteStorage() {
  localStorage.removeItem('guessed')
  emit('getSaved')
}
</script>
