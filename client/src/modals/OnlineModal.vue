<template>
  <ModalTrigger
    default-opened
    persistent
    :title="reason === 'leave'
      ? 'Something bad happened'
      : score.my > score.enemy
        ? 'Congratulations'
        : score.my < score.enemy
          ? 'Sad, but true'
          : 'Very close game'
    "
  >
    <template #content>
      <div v-if="reason === 'leave'" class="text-h6">
        Your opponent has left the match
      </div>
      <div v-else>
        <p v-if="score.my > score.enemy" class="text-h6 text-center mb-2">You win!</p>
        <p v-else-if="score.my < score.enemy" class="text-h6 text-center mb-2">You lose...</p>
        <p v-else class="text-h6 text-center mb-2">It is a draw!</p>
        <UsersList
          :users="[nickname, enemy]"
          :nickname="nickname"
          :score="score"
        ></UsersList>
        <div v-if="revenge" class="text-center">
          <p>{{ enemy }} wants to get revenge</p>
          <v-btn variant="elevated" color="primary" size="large" class="mr-2" @click="revengeDecision(true)">
            Accept
          </v-btn>
          <v-btn variant="outlined" color="error" size="large" @click="revengeDecision(false)">
            Decline
          </v-btn>
        </div>
        <div v-else class="text-center">
          <v-btn variant="elevated" color="primary" size="large" class="mt-2" @click="getRevenge">
            Revenge
          </v-btn>
        </div>
        <div v-if="revengeDeclined">
          The opponent has declined your revenge
        </div>
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { socket } from '@/socket'
import ModalTrigger from '@/components/ModalTrigger.vue'
import UsersList from '@/components/UsersList.vue'

const emit = defineEmits(['makeRevenge'])
const props = defineProps<{
  reason?: string
  nickname: string
  enemy: string
  score: {
    my: number
    enemy: number
  }
}>()
const route = useRoute()
const revenge = ref(false)
const revengeDeclined = ref(false)

onMounted(() => {
  socket.on('opponentsRevenge', () => revenge.value = true)
  socket.on('revengeDecline', () => revengeDeclined.value = true)
})

function getRevenge() {
  if (route.path === '/bot') {
    emit('makeRevenge')
  } else {
    revengeDeclined.value = false
    socket.emit('revenge', props.enemy)
  }
}

function revengeDecision(status: boolean) {
  socket.emit('revengeDecision', status)

  if (!status) {
    revenge.value = false
  }
}
</script>
