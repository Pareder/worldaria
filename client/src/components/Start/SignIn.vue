<template>
  <div class="sign">
    <v-menu v-if="appData?.user">
      <template v-slot:activator="{ props }">
        <v-avatar color="primary" v-bind="props" role="button">
          <span class="text-h5">{{ appData?.user.displayName?.[0] }}</span>
        </v-avatar>
      </template>
      <v-list>
        <div class="pl-3 pr-5 pb-3">
          <p class="text-subtitle-1">{{ appData?.user.displayName }}</p>
          <p class="text-subtitle-2 text-grey">{{ appData?.user.email }}</p>
        </div>
        <v-divider></v-divider>
        <v-list-item to="profile" prepend-icon="mdi-account-cog-outline" title="Profile"></v-list-item>
        <v-list-item prepend-icon="mdi-logout" title="Log Out" @click="logOut"></v-list-item>
      </v-list>
    </v-menu>
    <SignModal v-else></SignModal>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import type { AppDataType } from '@/types'
import SignModal from '@/modals/SignModal.vue'

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