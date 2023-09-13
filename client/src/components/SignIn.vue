<template>
  <v-menu v-if="appData?.user">
    <template v-slot:activator="{ props }">
      <v-avatar
        :color="appData?.user?.uid ? stringToColor(appData.user.uid) : 'primary'"
        :image="appData?.user?.photoURL || ''"
        v-bind="props"
        role="button"
        class="mr-2"
      >
        <span class="text-h5">{{ appData?.user.displayName?.[0] }}</span>
      </v-avatar>
    </template>
    <v-list>
      <div class="pl-3 pr-5 pb-3">
        <p class="text-subtitle-1">{{ appData?.user.displayName }}</p>
        <p class="text-subtitle-2 text-grey">{{ appData?.user.email }}</p>
      </div>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-logout" title="Log Out" @click="logOut"></v-list-item>
    </v-list>
  </v-menu>
  <SignModal v-else></SignModal>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import type { AppDataType } from '@/types'
import stringToColor from '@/utils/stringToColor'
import SignModal from '@/modals/SignModal.vue'

const appData = inject<Ref<AppDataType>>('appData')

function logOut() {
  signOut(getAuth())
}
</script>
