<template>
  <div class="sign">
    <span v-if="appData?.user" class="mr-4">{{ appData?.user.displayName }}</span>
    <v-btn
      v-if="appData?.user"
      variant="outlined"
      @click="logOut"
    >
      Sign out
    </v-btn>
    <SignModal v-else></SignModal>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import type { AppDataType } from '@/types'
import SignModal from '@/components/Start/SignModal.vue'
import 'firebaseui/dist/firebaseui.css'

const appData = inject<Ref<AppDataType>>('appData')

function logOut() {
  signOut(getAuth())
}
</script>

<style scoped>
.sign {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
}
</style>