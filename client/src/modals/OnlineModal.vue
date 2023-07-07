<template>
  <div>
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-content">
        <div v-if="reason === 'leave'">
          Your opponent has left the match
        </div>
        <div v-else>
          <div v-if="score.my > score.enemy">
            <img src="@/assets/images/correct-symbol.svg" width="24" height="24" />
            Congratulations<span v-if="$route.path === '/online'" :class="`${colors.my}_nick`">, {{ nickname }}</span>!
            <br>
            You win!
            <ul class="users">
              <li class="user__score mySide" :class="colors.my">
                <span>{{ nickname }}</span>
                <span>{{ score.my }}</span>
              </li>
              <li class="user__score" :class="colors.enemy">
                <span>{{ enemy }}</span>
                <span>{{ score.enemy }}</span>
              </li>
            </ul>
          </div>
          <div v-else-if="score.my < score.enemy">
            <img src="@/assets/images/cross.svg" width="24" height="24" />
            Sad, but true, <span v-if="$route.path === '/online'" :class="`${colors.my}_nick`">{{nickname }}</span>
            <br>
            You lose
            <ul class="users">
              <li class="user__score" :class="colors.enemy">
                <span>{{ enemy }}</span>
                <span>{{ score.enemy }}</span>
              </li>
              <li class="user__score mySide" :class="colors.my">
                <span>{{ nickname }}</span>
                <span>{{ score.my }}</span>
              </li>
            </ul>
          </div>
          <div v-else>
            <img src="@/assets/images/draw.svg" width="32" height="32" />
            Very close game!
            <br>
            It is a draw
            <ul class="users">
              <li class="user__score mySide" :class="colors.my">
                <span>{{ nickname }}</span>
                <span>{{ score.my }}</span>
              </li>
              <li class="user__score" :class="colors.enemy">
                <span>{{ enemy }}</span>
                <span>{{ score.enemy }}</span>
              </li>
            </ul>
          </div>
          <div v-if="revenge" class="buttons">
            <p>{{ enemy }} wants to get revenge</p>
            <button class="btn--invite btn--blue" @click="revengeDecision(true)">Accept</button>
            <button class="btn--invite btn--red" @click="revengeDecision(false)">Decline</button>
          </div>
          <button v-else class="btn" @click="getRevenge">Revenge</button>
          <div v-if="revengeDeclined">
            The opponent has declined your revenge
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { socket } from '@/socket'

export default {
  data() {
    return {
      revenge: false,
      revengeDeclined: false
    }
  },

  props: {
    reason: {
      type: String
    },
    nickname: {
      type: String
    },
    enemy: {
      type: String
    },
    score: {
      type: Object
    },
    colors: {
      type: Object
    }
  },

  mounted() {
    socket.on('opponentsRevenge', () => this.revenge = true)
    socket.on('revengeDecline', () => this.revengeDeclined = true)
  },

  methods: {
    getRevenge() {
      if (this.$route.path === '/bot') {
        this.$emit('makeRevenge')
      } else {
        this.revengeDeclined = false
        socket.emit('revenge', this.enemy)
      }
    },

    revengeDecision(status) {
      socket.emit('revengeDecision', status)

      if (!status) {
        this.revenge = false
      }
    }
  }
}
</script>

<style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    width: 100%;
    max-width: 500px;
    max-height: 100vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    padding-bottom: 3px;
    z-index: 1051;
    background: #fff;
    overflow-y: auto;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.3);
  }
  .modal::before {
    background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
    content: "";
    display: block;
    height: 3px;
    width: 100%;
  }
  .modal-content {
    height: auto;
    position: relative;
    z-index: 1052;
    padding: 30px 15px 30px 20px;
    background: #fff;
    font-size: 24px;
  }
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
  .blue_nick {
    color: blue;
  }
  .tomato_nick {
    color: tomato;
  }
  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>