<template>
  <div>
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-content">
        <div v-if="mode === 'learn'">
          <div class="status learn">
            <img src="../assets/images/correct-symbol.svg" height="24" width="24" />
            Congratulations!
          </div>
          <div class="description">
            You have learnt all {{ fullName }}.{{ name === 'full' ? ' You are now ready for exciting game!': '' }}
          </div>
        </div>
        <div v-else>
          <div class="status win">
            <img src="../assets/images/correct-symbol.svg" height="24" width="24" />
            Congratulations, {{ nickname }}!
            <br>
            You win!
          </div>
          <div v-if="!this.$route.params.sort">
            <div class="score">
              Your score: 
              <span class="score__number">{{ score }}</span>
            </div>
            <div class="leaderboard">
              <h1>Leaderboard</h1>
              <ol>
                <li
                  v-for="(user, id) in reverseLeaders(leaderboard)"
                  :key="id"
                  :class="user['.key'] === hash ? 'leader' : ''"
                >
                  <mark>{{ user.name }}</mark>
                  <span>
                    {{ user.score }} | {{ user.scoreDate ? new Date(user.scoreDate).toLocaleDateString() : '' }}
                  </span>
                </li>
              </ol>
            </div>
          </div>
          <div v-else class="description">
            You have guessed all the countries.
          </div>
        </div>
        <router-link v-if="isMobile" to="/" tag="button" class="btn btn--mobile">Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { database } from '../config'

const USERS = database.ref('users')

export default {
  data() {
    return {
      nickname: 'Anonymous',
      hash: ''
    }
  },

  props: {
    mode: {
      type: String,
      required: false
    },
    score: {
      type: Number,
      default: 0
    }
  },

  computed: {
    name() {
      return this.$route.params.name
    },

    fullName() {
      switch (this.name) {
        case 'full':
          return 'countries'
        case 'europe':
          return 'European countries'
        case 'asia':
          return 'Asian countries'
        case 'africa':
          return 'African countries'
        case 'na':
          return 'North American countries'
        case 'sa':
          return 'South American countries'
        case 'oceania':
          return 'Oceanian countries'
        default:
          return 'regions'
      }
    }
  },

  firebase: {
    leaderboard: USERS.orderByChild('score').limitToLast(5)
  },

  created() {
    if (this.getCookie('name')) {
      const cookieInfo = JSON.parse(this.getCookie('name'))
      this.hash = cookieInfo.hash
      this.nickname = cookieInfo.name
    }

    if (this.mode === 'game' && !this.$route.params.sort) {
      if (this.hash) {
        const dbScore = USERS.child(this.hash + '/score')
        dbScore.on('value', (snapshot) => {
          if (snapshot.val() < this.score) {
            const date = new Date().toUTCString()
            USERS.child(this.hash).update({
              score: this.score,
              scoreDate: date
            })
          }
        })
      }
    }
  },

  methods: {
    reverseLeaders(array) {
      return array.slice().reverse()
    }
  }
}
</script>

<style scoped lang="scss">
  ::-webkit-scrollbar {
      width: 5px;
  }
  ::-webkit-scrollbar-track {
      background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
      background: #555;
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    width: 100%;
    max-width: 500px;
    max-height: 100vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    padding-bottom: 3px;
    z-index: 1051;
    background: #fff;
    overflow-y: auto;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.3);
  }
  .modal::before {
    background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
    content: "";
    display: block;
    height: 3px;
    width: 100%;
  }
  @media screen and (max-width: 500px) {
    .modal {
      height: 100vh;
    }
  }
  .modal-content {
    height: auto;
    position: relative;
    top: 3px;
    left: 0;
    right: 0;
    z-index: 1052;
    padding: 30px 15px 30px 20px;
    background: #fff;
    font-size: 24px;
  }
  .status img {
    margin-right: 10px;
  }
  .status {
    color: #3a87ad;
  }
  .score, {
    margin-top: 10px;
  }
  .score__number {
    color: #3a87ad;
  }
  .description {
    padding: 20px;
  }
  .leaderboard {
    margin-top: 20px;
    padding: 0 40px;
    transform-origin: top;
    animation: show-leaderboard 0.5s;
  }
  @media screen and (max-width: 500px) {
    .leaderboard {
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
      mark {
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
        &::before, &::after {
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
      span {
        position: relative;
        z-index: 2;
        display: block;
        text-align: right;
        font-weight: bold;
        color: #fff;
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
        & mark {
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
        & mark {
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
        & mark {
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
        & mark {
          &::before, &::after {
            top: -9px;
            bottom: auto;
            border-top: none;
            border-bottom: 8px solid #2e4c45;
          }
        }
      }
    }
    li.leader {
      background-color: #dff2ee;
      color: #2e4c45;
      &:before {
        background-color: #2e4c45;
        color: #fff;
      }
      & mark, & span {
        color: inherit;
        transition: color 0.2s;
      }
    }
    li.leader:hover {
      & mark, & span {
        color: #fff;
      }
    }
    li:hover {
      z-index: 2;
      overflow: visible;
      &::after {
        opacity: 1;
        transform: scaleX(1.06) scaleY(1.03);
      }
      & mark {
        &::before, &::after {
          color: #fff;
          opacity: 1;
          transition: all .35s ease-in-out;
        }
      }
    }
  }
  .btn--mobile {
    margin: 0 auto;
  }
</style>