<template>
  <div class="start">
    <div v-if="!start" class="start__animation">
      <h2 class="start__heading" :class="{ lineMovement: startPressing }">
        Worldaria is the first educational geographical game in which you need to guess countries and even more!
      </h2>
      <button class="btn btn--start" @click="startPressed">Start</button>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startPressing: false
    }
  },

  props: {
    start: {
      type: Boolean
    }
  },

  methods: {
    startPressed() {
      this.startPressing = true
      setTimeout(() => {
        this.$emit('start')
      }, 1000)
    }
  }
}
</script>

<style scoped>
  .start {
    width: 100%;
    display: flex;
    justify-content: center;
    color: #fff;
    overflow: hidden;
  }
  .start__heading {
    position: relative;
    width: 60%;
    margin: 0 auto 20px auto;
    padding: 20px;
    font-weight: normal;
    font-size: 26px;
  }
  .start__heading:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 150%;
    height: 5px;
    background-color: #fff;
  }
  .start__heading:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 150%;
    height: 5px;
    background-color: #fff;
  }
  @media screen and (max-width: 500px) {
    .start__heading {
      width: 100%;
      font-size: 20px;
    }
  }
  .lineMovement {
    animation: opacityChanger 0.5s 0.5s reverse;
  }
  .lineMovement:before {
    animation: lineMovementLeft 1s cubic-bezier(.55,-0.43,.83,.67);
  }
  .lineMovement:after {
    animation: lineMovementRight 1s cubic-bezier(.55,-0.43,.83,.67);
  }
  @keyframes lineMovementRight {
    100% {
      transform: translateX(-100%);
    }
  }
  @keyframes lineMovementLeft {
    100% {
      transform: translateX(100%);
    }
  }
  .start__animation {
    padding: 10px 0;
  }
  @media screen and (max-width: 650px) {
    .start {
      flex-wrap: wrap;
    }
  }

  .left, .right {
    width: 50%;
    padding: 20px 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.6;
    font-size: 20px;
    opacity: 0;
    animation: opacityChanger 1s forwards;
  }
  @media screen and (max-width: 650px) {
    .left, .right {
      width: 100%;
      padding: 20px;
      font-size: 18px;
    }
    .right {
      padding: 20px 20px 40px;
    }
  }
</style>
