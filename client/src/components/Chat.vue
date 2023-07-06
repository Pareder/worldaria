<template>
  <div class="chat" :class="{ fixed, bottom, left }">
    <div class="chat__header flex">
      <div class="flex">
        <div class="chat__new" :class="{ visible: unreadMessages }"></div>
        <p class="text--small">Online chat</p>
      </div>
      <div class="chat__activator" @click="toggleChat">
        <DashSvg/>
      </div>
    </div>
    <div class="chat__main" :class="{ chatHidden }">
      <div class="chat__messages">
        <div v-show="opponentTyping" class="chat__typing dot_animation">
          {{ opponentName }} is typing<span>.</span><span>.</span><span>.</span>
        </div>
        <div
          v-for="(message, id) in chatMessages"
          :class="message.user === nickname ? `my__message ${sideColors.my}` : `enemy__message ${sideColors.enemy}`"
          :key="id">{{ message.text }}
        </div>
      </div>
      <form class="chat__form" @submit.prevent="submitMessage" autocomplete="off">
        <input
          type="text"
          name="message"
          class="chat__input"
          placeholder="Type message"
          v-model="messageText"
          maxlength="255"
          @input="typingMessage"
        >
        <img class="chat__img" src="../assets/images/paper_plane.svg" width="40" height="40" @click="submitMessage">
      </form>
    </div>
  </div>
</template>

<script>
  import DashSvg from '@/components/DashSvg.vue'

  export default {
    data() {
      return {
        chatMessages: [],
        messageText: '',
        chatHidden: true,
        unreadMessages: false,
        opponentTyping: false,
        typingTimeout: null
      }
    },

    props: {
      nickname: {
        type: String
      },
      opponentName: {
        type: String
      },
      sideColors: {
        type: Object
      },
      fixed: {
        type: Boolean
      },
      bottom: {
        type: Boolean
      },
      left: {
        type: Boolean
      }
    },

    methods: {
      submitMessage() {
        if (this.messageText.length > 0) {
          this.$socket.emit('sendMessage', { user: this.nickname, text: this.messageText })
          this.messageText = ''
        }
      },

      toggleChat() {
        this.chatHidden = !this.chatHidden
        this.unreadMessages = false
      },

      typingMessage() {
        if (!this.typingTimeout) {
          this.$socket.emit('typingMessage', true)
        }

        clearTimeout(this.typingTimeout)
        this.typingTimeout = setTimeout(() => {
          this.typingTimeout = null
          this.$socket.emit('typingMessage', false)
        }, 3000)
      }
    },

    sockets: {
      getNewMessages(data) {
        this.opponentTyping = false
        this.typingTimeout = null
        this.chatMessages.unshift(data)

        this.unreadMessages = this.chatHidden
      },

      opponentTyping(data) {
        this.opponentTyping = data
      }
    },

    components: {
      DashSvg
    }
  }
</script>

<style scoped>
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
    z-index: 1001;
    width: 400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .chat.fixed {
    position: fixed;
  }

  .chat.bottom {
    bottom: 30px;
  }

  .chat.left {
    left: 30px;
  }

  .chat__header {
    padding: 0 15px;
    justify-content: space-between;
    background-color: #7190b7;
    color: #fff;
    font-size: 20px;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .chat__new {
    width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 50%;
    background-color: red;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .chat__new.visible {
    opacity: 1;
  }

  .text--small {
    font-size: 14px;
  }

  .chat__activator {
    margin-left: auto;
    padding: 10px 0;
    cursor: pointer;
    transition: filter 0.3s;
  }

  .chat__activator:hover {
    filter: drop-shadow(0 0 3px blue);
  }

  .chat__main {
    max-height: 300px;
    transition: max-height 0.5s;
  }

  .chatHidden {
    max-height: 0;
  }

  .chat__messages {
    height: 250px;
    width: 100%;
    padding: 10px 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;
    background-color: #e5e5e5;
  }

  .my__message, .enemy__message {
    max-width: 90%;
    position: relative;
    margin-bottom: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    /*box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);*/
    background-color: #fff;
    text-align: left;
    word-break: break-all;
  }

  .chat__typing {
    padding: 5px 0;
    color: #6f6f6f;
    font-size: 14px;
    text-align: left;
  }

  .my__message {
    margin-left: auto;
    border-bottom-right-radius: 0;
  }

  .enemy__message {
    margin-right: auto;
    border-bottom-left-radius: 0;
  }

  .my__message:before, .enemy__message:before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .my__message:before {
    right: -25px;
  }

  .enemy__message:before {
    left: -25px;
  }

  .my__message:after, .enemy__message:after {
    content: '';
    position: absolute;
    bottom: 0;
    border-style: solid;
  }

  .my__message:after {
    right: -5px;
    border-width: 5px 0 0 5px;
    border-color: transparent transparent transparent #fff;
  }

  .enemy__message:after {
    left: -5px;
    border-width: 0 0 5px 5px;
    border-color: transparent transparent #fff transparent;
  }

  .blue:before {
    background-color: blue;
  }

  .tomato:before {
    background-color: tomato;
  }

  .chat__form {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #7190b7;
  }

  .chat__input {
    width: 100%;
    height: 40px;
    margin: 5px 15px;
    border: none;
    color: #fff;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
    font-size: 16px;
  }

  .chat__input::placeholder {
    color: #e5e5e5;
    opacity: 1;
  }

  .chat__input:-ms-input-placeholder {
    color: #e5e5e5;
  }

  .chat__input::-ms-input-placeholder {
    color: #e5e5e5;
  }

  .chat__img {
    padding: 10px;
    margin-right: 10px;
    border-radius: 50%;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .chat__submit {
    width: 100px;
    height: 100%;
    padding: 15px;
    background: #e5e5e5;
    border: none;
    text-transform: uppercase;
    font-size: 16px;
    cursor: pointer;
  }
</style>
