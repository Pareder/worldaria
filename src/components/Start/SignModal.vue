<template>
  <div class="modal-outer">
    <div class="modal-backdrop" @click="$emit('close')"></div>
      <div class="modal-content">
        <h2>Sign In</h2>
        <section id="firebaseui-auth-container"></section>
      </div>
  </div>
</template>

<script>
import { EmailAuthProvider, GoogleAuthProvider, getAuth } from 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  mounted() {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth())
    ui.start('#firebaseui-auth-container', {
      signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: () => {
          this.$emit('close')
        }
      }
    })
  }
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

<style scoped>
  .modal-outer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    outline: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-backdrop {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    opacity: 0.5;
    background-color: #000;
  }
  .modal-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 500px;
    padding: 20px 0;
    background: #fff;
    font-size: 24px;
    box-shadow: 0 0 11px rgba(0, 0, 0, 0.3);
  }
  .modal-content h2 {
    margin-top: 0;
    color: #000;
  }
  @media screen and (max-width: 400px) {
    .modal {
      margin-top: 100px;
      overflow-y: scroll;
    }
  }
  .modal-content::before {
    position: absolute;
    top: 0;
    background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
    content: "";
    display: block;
    height: 5px;
    width: 100%;
  }
</style>