<template>
  <div v-if="leaders.length" class="leaderboard">
    <h1>Leaderboard</h1>
    <ol>
      <li
        v-for="(user, id) in leaders"
        :key="id"
        :class="{ leader: user['.key'] === userId }"
      >
        <div class="mark"/>
        <div class="user">
          <span class="name">{{ user.name }}</span>
          <span>{{ user.score }}</span>
          <span class="divider">|</span>
          <span>{{ getFormattedDate(user.scoreDate) }}</span>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database'
import { database } from '../config'

export default {
  data() {
    return {
      leaderboard: {}
    }
  },

  inject: ['appData'],

  computed: {
    userId() {
      return this.appData.user?.uid
    },

    leaders() {
      return Object.entries(this.leaderboard).sort(([,a], [,b]) => b.score - a.score).map(([key, data]) => ({
        ...data,
        '.key': key,
      }))
    }
  },

  created() {
    onValue(query(ref(database, 'users'), orderByChild('score'), limitToLast(5)), snapshot => {
      this.leaderboard = snapshot.val()
    })
  },

  methods: {
    getFormattedDate(date) {
      return date ? new Date(date).toLocaleDateString() : ''
    }
  }
}
</script>

<style scoped lang="scss">
.leaderboard {
  margin-top: 20px;
  padding: 0 40px;
  transform-origin: top;
  animation: show-leaderboard 0.5s;

  @media screen and (max-width: 500px) {
    padding: 0;
  }
}

@keyframes show-leaderboard {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}

h1 {
  margin: 0;
  font-size: 22px;
  padding: 10px 0;
  color: #e1e1e1;
  background: #3a404d;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

ol {
  margin-top: 0;
  padding: 0;
  counter-reset: leaderboard;
  list-style-type: none;
}

li {
  position: relative;
  z-index: 1;
  font-size: 14px;
  counter-increment: leaderboard;
  padding: 18px 10px 18px 50px;
  cursor: pointer;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1.0, 1.0);
  text-align: left;

  &::before {
    content: counter(leaderboard);
    position: absolute;
    z-index: 2;
    top: 15px;
    left: 15px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: #1f332e;
    background: #fff;
    border-radius: 20px;
    text-align: center;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fa6855;
    box-shadow: 0 3px 0 rgba(0, 0, 0, .08);
    transition: all .3s ease-in-out;
    opacity: 0;
  }

  &:nth-child(1) {
    background: #7cccb8;
    &::after {
      background: #7cccb8;
    }
  }
  &:nth-child(2) {
    background: #6cb2a1;
    &::after {
      background: #6cb2a1;
      box-shadow: 0 2px 0 rgba(0, 0, 0, .08);
    }
    .mark {
      &::before, &::after {
        border-top: 6px solid #2e4c45;
        bottom: -7px;
      }
    }
  }
  &:nth-child(3) {
    background: #5d998a;
    &::after {
      background: #5d998a;
      box-shadow: 0 1px 0 rgba(0, 0, 0, .11);
    }
    .mark {
      &::before, &::after {
        border-top: 2px solid #2e4c45;
        bottom: -3px;
      }
    }
  }
  &:nth-child(4) {
    background: #4d7f73;
    &::after {
      background: #4d7f73;
      box-shadow: 0 -1px 0 rgba(0, 0, 0, .15);
    }
    .mark {
      &::before, &::after {
        top: -7px;
        bottom: auto;
        border-top: none;
        border-bottom: 6px solid #2e4c45;
      }
    }
  }
  &:nth-child(5) {
    background: #3e665c;
    border-radius: 0 0 10px 10px;
    &::after {
      background: #3e665c;
      box-shadow: 0 -2.5px 0 rgba(0, 0, 0, .12);
      border-radius: 0 0 10px 10px;
    }
    .mark {
      &::before, &::after {
        top: -9px;
        bottom: auto;
        border-top: none;
        border-bottom: 8px solid #2e4c45;
      }
    }
  }

  &:hover {
    z-index: 2;
    overflow: visible;
    &::after {
      opacity: 1;
      transform: scaleX(1.06) scaleY(1.03);
    }
    .mark {
      &::before, &::after {
        color: #fff;
        opacity: 1;
        transition: all .35s ease-in-out;
      }
    }
  }
}

.mark {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 18px 10px 18px 50px;
  margin: 0;
  background: none;
  color: #fff;

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: -11px;
    left: -9px;
    border-top: 10px solid #2e4c45;
    border-left: 10px solid transparent;
    transition: all .1s ease-in-out;
    opacity: 0;
  }

  &::after {
    left: auto;
    right: -9px;
    border-left: none;
    border-right: 10px solid transparent;
  }
}

li.leader {
  background-color: #dff2ee;
  color: #2e4c45;
  &:before {
    background-color: #2e4c45;
    color: #fff;
  }
  .mark, & span {
    color: inherit;
    transition: color 0.2s;
  }
  &:hover {
    .mark, span {
      color: #fff;
    }
  }
}

.user {
  position: relative;
  z-index: 2;
  display: flex;
  font-weight: bold;
}

.name {
  flex-grow: 1;
}

.divider {
  margin: 0 10px;
}
</style>