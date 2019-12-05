<template>
  <ul class="users">
    <li
      v-for="(user, id) in users"
      :key="id"
      class="user__score"
      :class="user === nickname ? 'mySide' : enemyGuess ? 'enemyGuess' : ''"
    >
      <span>{{ user }}</span>
      <span v-if="user === nickname">{{ user === nickname ? score.my : score.enemy }}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      users: {
        type: Array
      },
      nickname: {
        type: String
      },
      score: {
        type: Object
      },
      enemyGuess: {
        type: Boolean
      }
    }
  }
</script>

<style scoped>
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
  .user__score:nth-child(1) {
    background-color: rgba(0, 0, 255, 0.5);
  }
  .user__score:nth-child(1).mySide {
    box-shadow: 0 0 10px blue;
  }
  .user__score:nth-child(2) {
    background-color: rgba(255, 99, 71, 0.5);
  }
  .user__score:nth-child(2).mySide {
    box-shadow: 0 0 10px tomato;
  }
  .enemyGuess {
    animation: enemyGuess 1s;
  }
  @keyframes enemyGuess {
    50% {
      box-shadow: 0 0 10px 2px #91dc5a;
    }
    100% {
      box-shadow: 0 0 1px #91dc5a;
    }
  }
</style>
