<template>
  <v-btn
    variant="elevated"
    color="primary"
    @click="handleOpen"
  >
    Sign in
  </v-btn>
  <v-dialog
    v-model="open"
    width="500"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-toolbar-title>Sign In</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="handleClose"></v-btn>
      </v-toolbar>
      <v-card-text>
        <section id="firebaseui-auth-container"></section>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { EmailAuthProvider, GoogleAuthProvider, getAuth } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

const open = ref(false)

function handleOpen() {
  open.value = true
  nextTick(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth())
    ui.start('#firebaseui-auth-container', {
      signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          open.value = false
          return false
        }
      }
    })
  })
}

function handleClose() {
  open.value = false
}
</script>

<style>
label[for="ui-sign-in-name-input"] {
  color: transparent !important;
}

label[for="ui-sign-in-name-input"]::before {
  content: "Nickname";
  color: rgba(0, 0, 0, .54);
}
</style>
