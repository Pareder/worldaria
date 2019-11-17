<template>
  <div class="start-page">
    <StartBackground />
    <StartHeader @toggleSignError="toggleSignError" @setNickname="setNickname" />
    <StartMain :start="start" @start="startPressed">
      <div class="left">
        <StartButtons
          name="Game"
          description="In Game mode you have 5 attempts for each country. Each right answer will give you 1 point. After 5 wrong attempts you will lose 1 point. You can save your current game anytime just quiting it if you are guessing by name."
          @buttonClick="chooseGameMode"
        />
        <StartButtons
          name="Online"
          description="In Online mode you will play with real person one by one. Each player has 15 seconds to guess the country. After 5 wrong attempts you will not lose points."
          :signInError="signInError"
          @buttonClick="checkOnlineRoute"
        />
        <StartButtons
          name="Bot"
          description="In Bot mode you will play with bot, whose difficulty you can choose. You have 15 seconds to guess the country."
          @buttonClick="chooseDifficulty"
        />
      </div>
      <div class="right">
        <StartButtons
          name="Learn"
          description="In Learn mode you have unlimited attempts. After 5 wrong attempts the right country will be accentuated. You can use search bar to find the right country."
          @buttonClick="chooseLearnMode"
        />
        <StartButtons
          name="Details"
          description="In Details mode you can learn additional information about countries."
          isRoute
          link="/learn/details"
        />
        <StartButtons
          name="History"
          description="In History mode you can learn historical countries."
          isRoute
          link="/learn/history"
        />
      </div>
    </StartMain>
    <ChooseMode v-if="difficulty || gameMode" @close="closeModal" :bot="difficulty ? true : false" />
    <LearnMode v-if="learnMode" @close="closeModal" />
  </div>
</template>
<script>
import StartBackground from '../components/Start/StartBackground'
import StartHeader from '../components/Start/StartHeader'
import StartMain from '../components/Start/StartMain'
import StartButtons from '../components/Start/StartButtons'
import ChooseMode from '../modals/ChooseMode'
import LearnMode from '../modals/LearnMode'

export default {
  data () {
    return {
      start: false,
      nickname: '',
      gameMode: false,
      learnMode: false,
      difficulty: false,
      signInError: false
    }
  },
  created () {
    if (this.getCookie('name')) {
      this.nickname = JSON.parse(this.getCookie('name')).name
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name) {
      next(vm => {
        vm.start = true
      })
    }
    next()
  },
  methods: {
    startPressed () {
      this.start = true
    },
    setNickname (name) {
      this.nickname = name
    },
    chooseGameMode () {
      this.gameMode = true
    },
    chooseLearnMode () {
      this.learnMode = true
    },
    chooseDifficulty () {
      this.difficulty = true
    },
    closeModal () {
      this.difficulty = false
      this.gameMode = false
      this.learnMode = false
    },
    toggleSignError () {
      this.signInError = false
    },
    checkOnlineRoute () {
      if (!this.nickname) {
        this.signInError = true
        return
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
<style scoped lang="scss">
.start-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  background-color: rgba(0,0,0,0.5);
}
</style>
