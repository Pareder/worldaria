<template>
  <div>
    <div v-if="!authUser" class="sign">
      <div @keypress.prevent.13="signIn" class="formSign">
        <div class="error" v-if="error.smallName">* name - more 2 letters</div>
        <div class="error" v-else-if="error.longName">* name - less 20 letters</div>
        <input
          type="text"
          class="signIn"
          v-model="nickname"
          placeholder="Nickname"
          @input="inputName"
          @keypress.prevent.13="signIn"
        >
        <button class="btn btn--sign" @click="signIn">Sign in</button>
      </div>
    </div>
    <div v-else class="sign">
      <div class="formSign">
        <span class="nickname" :class="animationNickname ? 'animationNickname' : ''">{{ nickname }}</span>
        <button class="btn btn--sign" @click="signOut">Sign out</button>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { ref, set } from 'firebase/database'
import { database } from '../config'

export default {
  data() {
    return {
      nickname: '',
      authUser: false,
      error: {
        smallName: false,
        longName: false,
        signIn: false
      },
      animationNickname: false,
    }
  },

  created() {
    const name = this.getCookie('name')

    if (name) {
      this.authUser = true
      this.nickname = JSON.parse(name).name
    }
  },

  methods: {
    signIn() {
      if (this.nickname.length > 2 && this.nickname.length < 20) {
        this.$emit('toggleSignError')
        this.$emit('setNickname', this.nickname)

        const date = new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year more
        set(ref(database, 'users/' + md5(this.nickname + date.toUTCString())), {
          name: this.nickname
        })
        this.authUser = true
        this.animationNickname = true
        this.setCookie(date)
        this.$socket.emit('sendName', this.nickname)
      } else if (this.nickname.length < 3) {
        this.error.smallName = true
      }
    },

    signOut() {
      this.deleteCookie()
      this.nickname = ''
      this.$emit('setNickname', this.nickname)
      this.authUser = false
      this.animationNickname = false
      this.$socket.emit('signOut', this.nickname)
    },

    inputName() {
      if (this.nickname.length > 20) {
        this.nickname = this.nickname.slice(0, -1)
        this.error.longName = true
      } else if (this.error.smallName && this.nickname.length > 2) {
        this.error.smallName = false
      } else {
        this.error.longName = false
      }
    },

    setCookie(date) {
      document.cookie = `name=${ JSON.stringify({
        name: this.nickname,
        hash: md5(this.nickname + date.toUTCString())
      }) }; path=/; expires=${date.toUTCString()}`
    },

    deleteCookie() {
      const date = new Date(new Date().getTime() + (-1) * 1000)
      document.cookie = `name=""; path=/; expires=${date.toUTCString()}`
    },
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
  .formSign {
    position: relative;
    display: flex;
    align-items: center;
  }
  .signIn {
    width: 200px;
    height: 50px;
    margin-right: 10px;
    border-radius: 5px;
    border: 2px solid #a3ccff;
    padding: 0 20px;
    outline: none;
    font-family: inherit;
    transition: box-shadow 0.3s;
    animation: opacityChanger 0.5s;
  }
  .signIn:focus {
    box-shadow: 0px 0px 10px 2px #72b1ff inset;
  }
  @media screen and (max-width: 750px) {
    .sign {
      position: relative;
      top: 0;
      right: 0;
    }
    .formSign {
      margin: 0 auto;
    }
  }
  .nickname {
    position: relative;
    margin-right: 20px;
    letter-spacing: normal;
  }
  .animationNickname {
    animation: nick 1s cubic-bezier(.62,1.83,.79,.72);
  }
  @keyframes nick {
    0% {
      transform: translateX(-200px);
    }
    100% {
      transform: translateX(0);
    }
  }
</style>