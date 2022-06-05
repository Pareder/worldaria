<template>
  <section id="firebaseui-auth-container"></section>
</template>

<script>
import { EmailAuthProvider, GoogleAuthProvider, getAuth, onAuthStateChanged } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  name: 'Login',
  mounted() {
    const auth = getAuth()
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
    ui.start('#firebaseui-auth-container', {
      signInSuccessUrl: '/',
      signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID]
    })
    onAuthStateChanged(auth, user => {
      console.log(user)
    })
  }
}
</script>
