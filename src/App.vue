<template>
  <div id="app">
    <router-view></router-view>
    <Invite v-if="isInvited" :opponent="opponent" @makeDecision="makeDecision" :mode="sort" :type="type" />
    <notifications group="error" position="top left" />
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Invite from './modals/Invite'

export default {
  name: 'app',

  data() {
    return {
      appData: {
        user: null
      },
      isInvited: false,
      opponent: '',
      mode: null,
      type: null,
      sort: null
    }
  },

  provide() {
    return {
      appData: this.appData
    }
  },

  mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, user => {
      this.appData.user = user
      if (user) {
        this.$socket.emit('sendName', user.displayName)
      }
    })
  },

  methods: {
    makeDecision(status) {
      this.$socket.emit('makeDecision', {
        myName: this.appData.user.displayName,
        opponentName: this.opponent,
        status
      })

      if (status) {
        this.$router.push({
          name: 'Online',
          params: { 
            chooseOpponent: false,
            sort: this.sort,
            type: this.type
          }
        })
      }

      this.cancelInvite()
    },

    cancelInvite() {
      this.isInvited = false
    }
  },

  sockets: {
    getInvite({ myName, sort, type }) {
      this.isInvited = true
      this.opponent = myName
      this.sort = +sort
      this.type = type
    },

    declineInvite() {
      this.cancelInvite()
    }
  },

  components: {
    Invite
  }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import "./assets/css/style.css";

* {
  box-sizing: border-box;
}
body {
  min-width: 320px;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overscroll-behavior: none;
}
#app {
  min-height: 100vh;
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>