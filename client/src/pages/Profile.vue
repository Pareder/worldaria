<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer">
      <router-link
        to="/"
        class="py-4 d-block text-h5 text-blue text-decoration-none"
      >
        WORLDARIA
      </router-link>
      <v-divider></v-divider>
      <v-list density="compact" class="text-left" nav>
        <v-list-item to="/profile/records" prepend-icon="mdi-seal" title="Records"></v-list-item>
        <v-list-item to="/profile/settings" prepend-icon="mdi-cog" title="Settings"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block variant="outlined" color="primary" @click="logOut">
            Log Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      dark
      color="primary"
    >
      <v-app-bar-nav-icon
        :icon="drawer ? 'mdi-menu-open' : 'mdi-menu'"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-left">{{ route.name }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <div class="pa-10">
        <router-view></router-view>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { getAuth, signOut } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()
const drawer = ref(!mobile.value)

function logOut() {
  signOut(getAuth())
  router.replace('/')
}
</script>
