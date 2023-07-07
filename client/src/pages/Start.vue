<template>
  <div class="start-page">
    <StartBackground />
    <StartHeader />
    <StartMain :start="start" @start="startPressed">
      <div class="left">
        <StartButtons
          :name="buttons.GAME.name"
          :description="buttons.GAME.description"
          @buttonClick="chooseGameMode"
        />
        <StartButtons
          :name="buttons.ONLINE.name"
          :description="buttons.ONLINE.description"
          :signInError="signInError"
          @buttonClick="checkOnlineRoute"
        />
        <StartButtons
          :name="buttons.BOT.name"
          :description="buttons.BOT.description"
          @buttonClick="chooseDifficulty"
        />
      </div>
      <div class="right">
        <StartButtons
          :name="buttons.LEARN.name"
          :description="buttons.LEARN.description"
          @buttonClick="chooseLearnMode"
        />
        <StartButtons
          :name="buttons.DETAILS.name"
          :description="buttons.DETAILS.description"
          :link="buttons.DETAILS.link"
          isRoute
        />
        <StartButtons
          :name="buttons.HISTORY.name"
          :description="buttons.HISTORY.description"
          :link="buttons.HISTORY.link"
          isRoute
        />
      </div>
    </StartMain>
    <ChooseMode v-if="difficulty || gameMode" @close="closeModal" :bot="difficulty" />
    <LearnMode v-if="learnMode" @close="closeModal" />
  </div>
</template>

<script>
import StartBackground from '@/components/Start/StartBackground.vue'
import StartHeader from '@/components/Start/StartHeader.vue'
import StartMain from '@/components/Start/StartMain.vue'
import StartButtons from '@/components/Start/StartButtons.vue'
import ChooseMode from '@/modals/ChooseMode.vue'
import LearnMode from '@/modals/LearnMode.vue'
import buttons from '@/pages/config/buttons'

export default {
  data() {
    return {
      start: false,
      gameMode: false,
      learnMode: false,
      difficulty: false,
      signInError: false,
      buttons
    }
  },

  inject: ['appData'],

  beforeRouteEnter(to, from, next) {
    if (from.name) {
      next(vm => {
        vm.start = true
      })
    }

    next()
  },

  methods: {
    startPressed() {
      this.start = true
    },

    chooseGameMode() {
      this.gameMode = true
    },

    chooseLearnMode() {
      this.learnMode = true
    },

    chooseDifficulty() {
      this.difficulty = true
    },

    closeModal() {
      this.difficulty = false
      this.gameMode = false
      this.learnMode = false
    },

    checkOnlineRoute() {
      if (!this.appData.user) {
        this.signInError = true
      } else {
        this.$router.push('/online')
      }
    }
  },

  components: {
    StartBackground,
    StartHeader,
    StartMain,
    StartButtons,
    ChooseMode,
    LearnMode
  }
}
</script>

<style scoped>
  .start-page {
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: baseline;
    background-color: rgba(0, 0, 0, 0.5);
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
