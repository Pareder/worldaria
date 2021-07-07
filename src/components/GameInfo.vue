<template>
  <div class="info">
    Score: {{ score }}
    <span class="attempts">
      Attempts:
      <span
        :class="{ animation }"
        @animationend="endAnimation"
        @webkitAnimationEnd="endAnimation"
        @msAnimationEnd="endAnimation"
        @mozAnimationEnd="endAnimation"
      >
        {{ attempts }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      animation: false
    }
  },

  props: {
    score: {
      type: Number
    },
    attempts: {
      type: Number
    }
  },

  watch: {
    attempts(newVal, oldVal) {
      if (newVal < oldVal) {
        this.animation = true
      }
    }
  },

  methods: {
    endAnimation() {
      this.animation = false
    }
  }
}
</script>

<style scoped>
  .info {
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
  }

  .animation {
    animation: attempts 1s ease;
  }

  @keyframes attempts {
    25% {
      color: tomato;
    }
    50% {
      color: #404040;
    }
    75% {
      color: tomato;
    }
    100% {
      color: #404040;
    }
  }
</style>