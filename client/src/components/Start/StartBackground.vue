<template>
  <img v-if="isMobile" class="start-bg" src="../../../public/img/body_bg.jpg" />
  <video v-else class="start-bg" preload="auto" muted autoplay loop>
    <source src="@/assets/video/earth3.mp4" type="video/mp4">
  </video>
</template>

<style scoped>
  .start-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    object-fit: cover;
  }
</style>
