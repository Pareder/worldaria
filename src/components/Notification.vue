<template>
  <div>
    <transition name="notification--animated" appear>
      <div v-if="!enemyTurn" class="notification" :class="{ danger: danger }">
        <p class="time"><span>Time: {{ seconds }}</span></p>
        <p class="attempts"><span>Attempts: {{ attempts }}</span></p>
        <SvgIcon v-if="gameType === 'flag'" :country="subject" />
        <div v-else class="text--big">
          {{ subject }}
        </div>
        <UsersList :users="users" :nickname="nickname" :score="score" :enemyGuess="enemyGuess" />
      </div>
    </transition>
    <transition name="notification--animated" appear>
      <div v-if="enemyTurn" class="notification">
        <div class="text--big enemyTurn dot_animation">Opponent's Turn<span>.</span><span>.</span><span>.</span></div>
      </div>
    </transition>
  </div>
</template>
<script>
  import SvgIcon from './SvgIcon'
  import UsersList from './UsersList'

  export default {
    props: {
      enemyTurn: {
        type: Boolean
      },
      danger: {
        type: Boolean
      },
      seconds: {
        type: Number
      },
      attempts: {
        type: Number
      },
      subject: {
        type: String
      },
      gameType: {
        type: String
      },
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
    },
    components: {
      SvgIcon,
      UsersList
    }
  }
</script>
<style scoped>
  .time, .attempts {
    position: absolute;
    top: 5px;
    margin: 0;
    font-size: 14px;
  }
  .time {
    left: 5px;
  }
  .attempts {
    right: 5px;
  }
  .text--big {
    user-select: none;
    font-size: 22px;
  }
</style>