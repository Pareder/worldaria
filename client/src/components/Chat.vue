<template>
  <v-expansion-panels
    class="chat"
    :model-value="expanded ? ['chat'] : []"
    @update:model-value="toggleChat"
  >
    <v-expansion-panel value="chat">
      <v-expansion-panel-title color="primary">
        <template #default>
          Chat
          <v-fade-transition leave-absolute>
            <v-badge
              v-if="unreadMessages"
              color="error"
              :content="unreadMessages"
              inline
            ></v-badge>
          </v-fade-transition>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="panel">
        <div class="messages">
          <div v-show="opponentTyping" class="typing text-grey-darken-1 dot_animation">
            {{ opponentName }} is typing<span>.</span><span>.</span><span>.</span>
          </div>
          <v-fade-transition leave-absolute>
            <div v-if="!chatMessages.length" class="my-auto">
              <v-icon icon="mdi-message-off-outline" size="x-large" color="grey-darken-2"></v-icon>
              <p class="text-subtitle-1 text-grey-darken-2">No messages yet</p>
            </div>
          </v-fade-transition>
          <v-sheet
            v-for="(message, id) in chatMessages"
            :key="id"
            rounded
            elevation="2"
            class="message mb-2 py-1 px-2 bg-white"
            :class="message.user === nickname ? 'my-message' : 'enemy-message'"
          >
            <v-badge inline :color="message.user === nickname ? 'blue' : 'red'" class="badge"></v-badge>
            {{ message.text }}
          </v-sheet>
        </div>
        <v-form @submit.prevent="submitMessage">
          <v-textarea
            auto-grow
            rows="1"
            v-model="message"
            hide-details
            variant="outlined"
            color="primary"
            density="compact"
            placeholder="Type message"
            maxlength="255"
            append-inner-icon="mdi-send"
            @click:append-inner="submitMessage"
            @input="typingMessage"
            @keydown.enter.exact.prevent="submitMessage"
          ></v-textarea>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { socket } from '@/socket'

const props = defineProps<{
  nickname: string
  opponentName: string
}>()
const chatMessages = ref<{
  user: string
  text: string
}[]>([])
const message = ref('')
const unreadMessages = ref(0)
const opponentTyping = ref(false)
const expanded = ref(false)
const typingTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

onMounted(() => {
  socket.on('getNewMessages', data => {
    opponentTyping.value = false
    typingTimeout.value = null
    chatMessages.value.unshift(data)
    if (!expanded.value) {
      unreadMessages.value += 1
    }
  })

  socket.on('opponentTyping', data => {
    opponentTyping.value = data
  })
})

function submitMessage() {
  if (message.value.length > 0) {
    socket.emit('sendMessage', { user: props.nickname, text: message.value })
    message.value = ''
  }
}

function toggleChat() {
  expanded.value = !expanded.value
  unreadMessages.value = 0
}

function typingMessage() {
  if (!typingTimeout.value) {
    socket.emit('typingMessage', true)
  }

  clearTimeout(typingTimeout.value || 0)
  typingTimeout.value = setTimeout(() => {
    typingTimeout.value = null
    socket.emit('typingMessage', false)
  }, 3000)
}
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.chat {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 1001;
  width: 400px;
}

.messages {
  height: 250px;
  margin-right: -24px;
  padding: 10px 49px 10px 25px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

.typing {
  margin-left: -25px;
  text-align: left;
}

.message {
  position: relative;
  text-align: left;
  word-break: break-all;
  white-space: pre-line;
}

.badge {
  position: absolute;
  bottom: 0;
}

.badge::v-deep div {
  margin: 0;
  display: block;
}

.my-message {
  margin-left: auto;
  .badge {
    right: -25px;
  }
}

.enemy-message {
  margin-right: auto;
  .badge {
    left: -25px;
  }
}
</style>
