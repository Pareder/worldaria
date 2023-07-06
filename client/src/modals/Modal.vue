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
            Congratulations {{ nickname }}!
            <br>
            You win!
          </div>
          <div v-if="!this.$route.params.sort">
            <div class="score">
              Your score: 
              <span class="score__number">{{ score }}</span>
            </div>
            <LeaderboardTable v-if="withSavingResult"/>
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
import { ref, onValue, update } from 'firebase/database'
import { database } from '@/config'
import LeaderboardTable from '@/components/LeaderboardTable.vue'

export default {
  data() {
    return {
      leaderboard: {}
    }
  },

  inject: ['appData'],

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
    userId() {
      return this.appData.user?.uid
    },

    nickname() {
      return this.appData.user?.displayName || ''
    },

    withSavingResult() {
      return this.mode === 'game' && !this.$route.params.sort
    },

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
    },
  },

  created() {
    if (this.withSavingResult && this.userId) {
      onValue(ref(database, `users/${this.userId}`), snapshot => {
        const user = snapshot.val()
        if (!user?.score || user.score < this.score) {
          update(ref(database), {
            [`users/${this.userId}`]: {
              name: this.nickname,
              score: this.score,
              scoreDate: new Date().toUTCString()
            }
          })
        }
      }, {
        onlyOnce: true
      })
    }
  },

  components: {
    LeaderboardTable
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
  .btn--mobile {
    margin: 0 auto;
  }
</style>