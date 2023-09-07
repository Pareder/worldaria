<template>
  <router-view></router-view>
  <Invite v-if="invite" :invite="invite" @makeDecision="makeDecision" />
  <notifications position="top right" />
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

import type { AppDataType, InviteType } from '@/types'
import { socket } from '@/socket'
import Invite from '@/modals/Invite.vue'

const router = useRouter()
const appData = ref<AppDataType>({ user: null })
const invite = ref<InviteType | null>(null)

provide('appData', appData)

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, user => {
    appData.value.user = user
    if (user) {
      socket.emit('sendName', { uid: user.uid, name: user.displayName })
    }
  })

  socket.on('getInvite', (data: InviteType) => {
    invite.value = data
  })

  socket.on('declineInvite', cancelInvite)
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
