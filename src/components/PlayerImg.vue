<template>
  <img
    :src="`../img/${playPressed ? 'stop' : 'play'}.svg`"
    width="32"
    height="32"
    @click="$emit('onClick')"
    class="btn-history"
  />
</template>

<script>
export default {
  props: {
    playPressed: {
      type: Boolean
    }
  }
}
</script>

<style>
  .btn-history {
    position: relative;
    left: 10px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .slider .btn-history {
    top: -5px;
  }
  .btn-history:hover {
    transform: scale(1.1);
  }
</style>