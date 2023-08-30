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
        <div v-if="score.my > score.enemy">
          <p class="text-h6 text-center mb-2">You win!</p>
          <div class="user__score mySide" :class="colors.my">
            <span>{{ nickname }}</span>
            <span>{{ score.my }}</span>
          </div>
          <div class="user__score" :class="colors.enemy">
            <span>{{ enemy }}</span>
            <span>{{ score.enemy }}</span>
          </div>
        </div>
        <div v-else-if="score.my < score.enemy">
          <p class="text-h6 text-center mb-2">You lose...</p>
          <div class="user__score" :class="colors.enemy">
            <span>{{ enemy }}</span>
            <span>{{ score.enemy }}</span>
          </div>
          <div class="user__score mySide" :class="colors.my">
            <span>{{ nickname }}</span>
            <span>{{ score.my }}</span>
          </div>
        </div>
        <div v-else>
          <p class="text-h6 text-center mb-2">It is a draw!</p>
          <div class="user__score mySide" :class="colors.my">
            <span>{{ nickname }}</span>
            <span>{{ score.my }}</span>
          </div>
          <div class="user__score" :class="colors.enemy">
            <span>{{ enemy }}</span>
            <span>{{ score.enemy }}</span>
          </div>
        </div>
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

const emit = defineEmits(['makeRevenge'])
const props = defineProps<{
  reason?: string
  nickname: string
  enemy: string
  score: {
    my: number
    enemy: number
  }
  colors: {
    my: string
    enemy: string
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

<style scoped>
.users {
  width: 100%;
  padding: 0;
  list-style-type: none;
}

.user__score {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  color: #fff;
}

.blue {
  background-color: rgba(0, 0, 255, 0.5);
}

.blue.mySide {
  box-shadow: 0 0 10px blue;
}

.tomato {
  background-color: rgba(255, 99, 71, 0.5);
}

.tomato.mySide {
  box-shadow: 0 0 10px tomato;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>