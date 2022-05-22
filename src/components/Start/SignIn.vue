<template>
  <div class="sign">
    <span v-if="appData.user" class="nickname">{{ appData.user.displayName }}</span>
    <button v-if="appData.user" class="btn btn--sign" @click="signOut">Sign out</button>
    <button v-else class="btn btn--sign" @click="openModal">Sign in</button>
    <SignModal v-if="modal" @close="closeModal"/>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'
import SignModal from './SignModal'
import 'firebaseui/dist/firebaseui.css'

export default {
  data() {
    return {
      modal: false,
    }
  },

  inject: ['appData'],

  methods: {
    signOut() {
      signOut(getAuth())
    },
    openModal() {
      this.modal = true
    },
    closeModal() {
      this.modal = false
    }
  },

  components: {
    SignModal
  }
}
</script>

<style scoped>
  .sign {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
  }

  .nickname {
    margin-right: 20px;
  }
</style>