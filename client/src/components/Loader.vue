<template>
  <div class="holder">
    <div v-if="$route.path === '/online'">
      <HomeButton />
      <div class="preloader__text">Finding an opponent</div>
    </div>
    <div class="preloader">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
import HomeButton from '@/components/HomeButton.vue'

export default {
  components: {
    HomeButton
  }
}
</script>

<style lang="scss" scoped>
  $count: 10;
  $time: 2;
  $size: 100;
  $color: #ffffff;

  .holder {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #A3CCFF;
  }

  .preloader__text {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translateX(-50%) translateY(-30%);
    color: #384157;
    font-size: 32px;
  }

  @media screen and (max-width: 850px) {
    .preloader__text {
      font-size: 24px;
    }
  }

  .preloader {
    width: $size + px;
    height: $size + px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    animation: rotatePreloader $time + s infinite ease-in;
  }
  @keyframes rotatePreloader {
    0% {
    transform: translateX(-50%) translateY(-50%) rotateZ(0deg);
    }
    100% {
    transform: translateX(-50%) translateY(-50%) rotateZ(-360deg);
    }
  }
  .preloader div {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .preloader div:before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0%;
    width: 10%;
    height: 10%;
    background-color: $color;
    transform: translateX(-50%);
    border-radius: 50%;
  }

  @for $i from 1 through $count {
    .preloader div:nth-child(#{$i}) {
      transform: rotateZ((calc(360 / $count) * ($i - 1)) + deg);
      animation: rotateCircle + $i $time + s infinite linear;
      z-index: $count - $i;
    }
    @keyframes rotateCircle#{$i} {
      #{percentage(calc(((50 / $count) * ($i - 1)) / 100))} {
        opacity: 0;
      }
      #{percentage(calc((((50 / $count) + 0.0001) * ($i - 1)) / 100))} {
        opacity: 1;
        transform: rotateZ((0 - (calc(360 / $count) * ($i - 2))) + deg);
      }
      #{percentage(calc((((50 / $count) * ($i - 0)) + 2) / 100))} {
        transform: rotateZ((0 - (calc(360 / $count) * ($i - 1))) + deg);
      }
      #{percentage(calc(((50 + ((50 / $count) * ($i - 0))) + 2) / 100))} {
        transform: rotateZ((0 - (calc(360 / $count) * ($i - 1))) + deg);
      }
      100% {
        transform: rotateZ((0 - (calc(360 / $count) * ($count - 1))) + deg);
        opacity: 1;
      }
    }
  }
</style>