<template>
  <div class="home">
    <router-link to="/" tag="img" src="../img/back.svg" width="32" height="32"></router-link>
  </div>
</template>

<style>
  .home {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 2px 5px;
    z-index: 1001;
    cursor: pointer;
    transition: transform 0.3s;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px #000;
  }
  .home:hover {
    transform: scale(1.2);
  }
</style>