<template>
  <div
    class="notification"
    :class="{ animation, danger }"
    @animationend="endAnimation"
    @webkitAnimationEnd="endAnimation"
    @msAnimationEnd="endAnimation"
    @mozAnimationEnd="endAnimation"
  >
    <p v-if="hasTimeLimit" class="time">
      Time: {{ seconds }}
    </p>
    <p v-if="game" class="right-answers">
      <slot name="header">
        <span class="bold">{{ game.rightAnswers || game.count }}</span> of {{ game.length }}
      </slot>
    </p>
    <slot></slot>
    <GameInfo v-if="withGameInfo" :score="game.score" :attempts="game.attempts"/>
  </div>
</template>

<script>
import GameInfo from './GameInfo'

const MINIMAL_DANGER_VALUE = 3 // seconds

export default {
  data() {
    return {
      animation: false,
      danger: false
    }
  },

  props: {
    game: {
      type: Object
    },
    hasTimeLimit: {
      type: Boolean,
      default: false
    },
    seconds: {
      type: Number
    }
  },

  computed: {
    count() {
      return this.game?.count
    },

    withGameInfo() {
      return this.game && Object.prototype.hasOwnProperty.call(this.game, 'score')
    }
  },

  watch: {
    count(newVal, oldVal) {
      if (newVal > oldVal) {
        this.animation = true
      }
    },

    seconds(newVal, oldVal) {
      if (newVal > oldVal) {
        this.danger = false
      }

      if (newVal === MINIMAL_DANGER_VALUE) {
        this.danger = true
      }
    }
  },

  methods: {
    endAnimation() {
      this.animation = false
    },

    endDanger() {
      this.danger = false
    }
  },

  components: {
    GameInfo
  }
}
</script>

<style scoped>
  .notification {
    position: absolute;
    right: 50px;
    top: 50px;
    z-index: 1000;
    width: 300px;
    padding: 20px 20px 10px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #404040;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 11px rgba(0, 0, 0, 0.3);
  }

  @media screen and (max-width: 400px) {
    .notification {
      right: 0;
      top: 0;
      width: 100%;
    }
  }

  .animation {
    animation-name: next;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.17, 0.67, 0.36, 1.39);
  }

  .danger {
    animation: danger 1s infinite;
  }

  .time {
    position: absolute;
    top: 5px;
    left: 5px;
    margin: 0;
    font-size: 14px;
  }

  .right-answers {
    position: absolute;
    top: 5px;
    right: 5px;
    margin: 0;
    font-size: 14px;
  }

  @keyframes next {
    50% {
      transform: translateX(400px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes danger {
    50% {
      box-shadow: 0 0 20px 5px inset tomato;
    }
  }
</style>