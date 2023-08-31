<template>
  <ModalTrigger
    default-opened
    persistent
    :title="`What is the capital of ${country}?`"
  >
    <template #content>
      <v-row no-gutters>
        <v-col
          v-for="(capital, id) in capitals"
          :key="id"
          cols="12"
          sm="6"
          class="pa-1"
        >
          <v-btn
            variant="outlined"
            :color="id === answeredId
              ? isCorrect
                ? 'success'
                : 'error'
              : 'primary'"
            size="large"
            block
            :disabled="answeredId !== null"
            @click="answer(id)"
          >
            {{ capital }}
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalTrigger from '@/components/ModalTrigger.vue'

const emit = defineEmits(['check'])
const props = defineProps<{
  country: string
  capitals: string[]
  rightCapital: string
}>()
const answeredId = ref<number | null>(null)
const isCorrect = ref(false)

function answer(id: number) {
  answeredId.value = id
  isCorrect.value = props.capitals[id] === props.rightCapital
  setTimeout(() => {
    emit('check', isCorrect.value)
  }, 2000)
}
</script>
