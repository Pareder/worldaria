<template>
  <ModalTrigger
    default-opened
    persistent
    contained
    :title="reason === 'leave'
      ? 'Something bad happened'
      : me.score > opponent.score
        ? 'Congratulations'
        : me.score < opponent.score
          ? 'Sad, but true'
          : 'Very close game'
    "
  >
    <template #content>
      <div v-if="reason === 'leave'" class="text-h6">
        Your opponent has left the match
      </div>
      <div v-else>
        <p v-if="me.score > opponent.score" class="text-h6 text-center mb-2">You win!</p>
        <p v-else-if="me.score < opponent.score" class="text-h6 text-center mb-2">You lose...</p>
        <p v-else class="text-h6 text-center mb-2">It is a draw!</p>
        <UsersList :users="users"></UsersList>
        <div v-if="revenge" class="text-center">
          <p class="my-3 text-h6">{{ opponent?.name }} wants to play again</p>
          <v-btn variant="elevated" color="primary" size="large" class="mr-2" @click="revengeDecision(true)">
            Accept
          </v-btn>
          <v-btn variant="outlined" color="error" size="large" @click="revengeDecision(false)">
            Decline
          </v-btn>
        </div>
        <div v-else class="text-center">
          <v-btn variant="elevated" color="primary" size="large" class="mt-2" @click="getRevenge">
            Try again
          </v-btn>
        </div>
        <div v-if="revengeDeclined" class="mt-3 text-h6 text-center">
          The opponent has declined your invite
        </div>
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AppDataType, OnlineUserType } from '@/types'
import { socket } from '@/socket'
import ModalTrigger from '@/components/ModalTrigger.vue'
import UsersList from '@/components/UsersList.vue'

const emit = defineEmits(['makeRevenge'])
const props = defineProps<{
  reason?: string
  users: OnlineUserType[]
}>()
const appData = inject<Ref<AppDataType>>('appData')
const route = useRoute()
const revenge = ref(false)
const revengeDeclined = ref(false)
const me = computed(() => props.users.find(user => user.uid === (appData?.value?.user?.uid || 'you'))!)
const opponent = computed(() => props.users.find(user => user.uid !== (appData?.value?.user?.uid || 'you'))!)

onMounted(() => {
  socket.on('opponentsRevenge', () => revenge.value = true)
  socket.on('revengeDecline', () => revengeDeclined.value = true)
})

onUnmounted(() => {
  socket.off('opponentsRevenge')
  socket.off('revengeDecline')
})

function getRevenge() {
  if (route.path === '/bot') {
    emit('makeRevenge')
  } else {
    revengeDeclined.value = false
    socket.emit('revenge')
  }
}

function revengeDecision(status: boolean) {
  socket.emit('revengeDecision', status)

  if (!status) {
    revenge.value = false
  }
}
</script>
