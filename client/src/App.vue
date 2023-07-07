<template>
  <div id="app">
    <router-view></router-view>
    <Invite v-if="isInvited" :opponent="opponent" @makeDecision="makeDecision" :mode="sort" :type="type" />
    <notifications group="error" position="top right" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

import { socket } from '@/socket'
import Invite from '@/modals/Invite.vue'

const router = useRouter()
const appData = ref<{ user: User | null }>({ user: null })
const isInvited = ref(false)
const opponent = ref('')
const type = ref(null)
const sort = ref(null)

provide('appData', appData)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, user => {
    appData.value.user = user
    if (user) {
      socket.emit('sendName', user.displayName)
    }
  })

  socket.on('getInvite', invite => {
    isInvited.value = true
    opponent.value = invite.myName
    sort.value = invite.sort
    type.value = invite.type
  })

  socket.on('declineInvite', cancelInvite)
})

function cancelInvite() {
  isInvited.value = false
}

function makeDecision(status: boolean) {
  socket.emit('makeDecision', {
    myName: appData.value.user?.displayName,
    opponentName: opponent.value,
    status,
  })

  if (status) {
    router.push({
      name: 'Online',
      query: {
        // chooseOpponent: false,
        sort: sort.value,
        type: type.value,
      },
    })
  }

  cancelInvite()
}
</script>
