<template>
  <div class="start-page">
    <StartBackground />
    <StartHeader />
    <div class="left">
      <ChooseGameMode v-slot="props">
        <StartButtons
          :name="buttons.GAME.name"
          :description="buttons.GAME.description"
          :props="props"
        />
      </ChooseGameMode>
      <StartButtons
        :name="buttons.ONLINE.name"
        :description="buttons.ONLINE.description"
        :signInError="signInError"
        @buttonClick="checkOnlineRoute"
      />
      <ChooseBotMode v-slot="props">
        <StartButtons
          :name="buttons.BOT.name"
          :description="buttons.BOT.description"
          :props="props"
        />
      </ChooseBotMode>
    </div>
    <div class="right">
      <LearnMode v-slot="props">
        <StartButtons
          :name="buttons.LEARN.name"
          :description="buttons.LEARN.description"
          :props="props"
        />
      </LearnMode>
      <StartButtons
        :name="buttons.DETAILS.name"
        :description="buttons.DETAILS.description"
        :link="buttons.DETAILS.link"
      />
      <StartButtons
        :name="buttons.HISTORY.name"
        :description="buttons.HISTORY.description"
        :link="buttons.HISTORY.link"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AppDataType } from '@/types'
import StartBackground from '@/components/Start/StartBackground.vue'
import StartHeader from '@/components/Start/StartHeader.vue'
import StartButtons from '@/components/Start/StartButtons.vue'
import ChooseBotMode from '@/modals/ChooseBotMode.vue'
import ChooseGameMode from '@/modals/ChooseGameMode.vue'
import LearnMode from '@/modals/LearnMode.vue'
import buttons from '@/pages/config/buttons'

const router = useRouter()
const appData = inject<Ref<AppDataType>>('appData')
const signInError = ref(false)

function checkOnlineRoute() {
  if (!appData?.value.user) {
    signInError.value = true
    return
  }

  router.push('/online')
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
