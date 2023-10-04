<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <router-link
        to="/"
        class="py-4 d-flex align-center text-h5 text-primary text-decoration-none"
      >
        <img :width="40" :height="40" src="/img/logo/128x128.png" class="mr-2"/>
        WORLDARIA
      </router-link>
      <v-divider></v-divider>
      <Menu/>
    </v-navigation-drawer>
    <v-app-bar dark>
      <v-app-bar-nav-icon
        :icon="drawer ? 'mdi-menu-open' : 'mdi-menu'"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-left">{{ route.name }}</v-toolbar-title>
      <SignIn/>
    </v-app-bar>
    <v-main>
      <div class="main fill-height position-relative">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
  <Invite v-if="invite" :invite="invite" @makeDecision="makeDecision" />
  <notifications position="top right" />
</template>

<script setup lang="ts">
import { onMounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import type { AppDataType, InviteType } from '@/types'
import { socket } from '@/socket'
import Invite from '@/modals/Invite.vue'
import Menu from '@/components/Menu.vue'
import SignIn from '@/components/SignIn.vue'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()
const drawer = ref(!mobile.value)
const appData = ref<AppDataType>({ user: null })
const invite = ref<InviteType | null>(null)

provide('appData', appData)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, user => {
    appData.value.user = user
    if (user) {
      socket.emit('sendName', { uid: user.uid, name: user.displayName })
    } else {
      socket.emit('signOut')
    }
  })

  socket.on('getInvite', (data: InviteType) => {
    invite.value = data
  })

  socket.on('declineInvite', cancelInvite)
})

watch(route, (newRoute) => {
  if ([
    '/game/name',
    '/game/flag',
    '/game/capital',
    '/game/area',
    '/bot',
    '/online',
    '/learn/full',
    '/learn/continent',
    '/learn/countries',
    '/learn/details',
    '/learn/history',
  ].includes(newRoute.path)) {
    drawer.value = false
  }
})

function cancelInvite() {
  invite.value = null
}

function makeDecision(status: boolean, color: string) {
  socket.emit('makeDecision', {
    to: invite.value?.from.uid,
    color,
    status,
    room: invite.value?.room,
  })

  if (status) {
    router.push('/online')
  }

  cancelInvite()
}
</script>

<style scoped>
.main {
  background-image: url("/img/body_bg.jpg");
  background-size: cover;
  background-position: 50% 50%;
}
</style>
