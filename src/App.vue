<template>
  <div id="app">
    <router-view></router-view>
    <Invite v-if="isInvited" :opponent="opponent" @makeDecision="makeDecision" :mode="sort" :type="type" />
    <notifications group="error" position="top left" />
  </div>
</template>

<script>
import Invite from './modals/Invite'

export default {
  name: 'app',

  data() {
    return {
      nickname: '',
      isInvited: false,
      opponent: '',
      mode: null,
      type: null,
      sort: null
    }
  },

  mounted() {
    const name = this.getCookie('name')

    if (name) {
      this.nickname = JSON.parse(name).name
      this.$socket.emit('sendName', this.nickname)
    }
  },

  methods: {
    makeDecision(status) {
      this.$socket.emit('makeDecision', {
        myName: this.nickname,
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
    getInvite({ myName, sort, type, opponentName }) {
      this.isInvited = true
      this.opponent = myName
      this.sort = +sort
      this.type = type

      if (this.nickname !== opponentName) {
        this.nickname = opponentName
      }
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