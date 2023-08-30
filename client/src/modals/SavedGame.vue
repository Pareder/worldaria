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

<style scoped>
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  outline: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: #A3CCFF;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  transform: perspective(300px);
  padding-bottom: 30px;
  background: #fff;
  font-size: 24px;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.3);
}

.modal-content::before {
  background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
  content: "";
  display: block;
  height: 5px;
  width: 100%;
}

.start {
  animation: tiltup 0.7s;
}

.status {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
}

.buttons {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.buttons > button,
.buttons > a {
  margin-bottom: 10px;
  text-overflow: ellipsis;
}
</style>