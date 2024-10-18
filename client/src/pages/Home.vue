<template>
  <v-row no-gutters align="center" justify="center" class="wrapper fill-height flex-column">
    <ChooseGameMode v-slot="props">
      <v-tooltip
        :close-delay="30000000000"
        :text="GAME_MODE"
        max-width="300"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            variant="elevated"
            size="x-large"
            color="primary"
            class="btn"
            v-bind="{ ...tooltipProps, ...props }"
          >
            Game
          </v-btn>
        </template>
      </v-tooltip>
    </ChooseGameMode>
    <v-tooltip
      v-if="appData?.user"
      :text="ONLINE_MODE"
      max-width="300"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          to="/online"
          variant="elevated"
          size="x-large"
          color="primary"
          class="btn"
          v-bind="props"
        >
          Online
        </v-btn>
      </template>
    </v-tooltip>
    <ChooseBotMode v-slot="props">
      <v-tooltip
        :text="BOT_MODE"
        max-width="300"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            variant="elevated"
            size="x-large"
            color="primary"
            class="btn"
            v-bind="{ ...tooltipProps, ...props }"
          >
            Bot
          </v-btn>
        </template>
      </v-tooltip>
    </ChooseBotMode>
    <LearnMode v-slot="props">
      <v-tooltip
        :text="LEARN_MODE"
        max-width="300"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-btn
            variant="elevated"
            size="x-large"
            color="primary"
            class="btn"
            v-bind="{ ...tooltipProps, ...props }"
          >
            Learn
          </v-btn>
        </template>
      </v-tooltip>
    </LearnMode>
    <v-tooltip
      :text="DETAILS_MODE"
      max-width="300"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          to="/learn/details"
          size="x-large"
          variant="elevated"
          color="primary"
          class="btn"
          v-bind="props"
        >
          Wiki
        </v-btn>
      </template>
    </v-tooltip>
    <v-tooltip
      :text="HISTORY_MODE"
      max-width="300"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          to="/learn/history"
          size="x-large"
          variant="elevated"
          color="primary"
          class="btn"
          v-bind="props"
        >
          History
        </v-btn>
      </template>
    </v-tooltip>
  </v-row>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'
import type { AppDataType } from '@/types'
import {
  BOT_MODE,
  DETAILS_MODE,
  GAME_MODE,
  HISTORY_MODE,
  LEARN_MODE,
  ONLINE_MODE,
} from '@/config/tooltips'
import ChooseBotMode from '@/modals/ChooseBotMode.vue'
import ChooseGameMode from '@/modals/ChooseGameMode.vue'
import LearnMode from '@/modals/LearnMode.vue'

const appData = inject<Ref<AppDataType>>('appData')
</script>

<style scoped>
.wrapper {
  gap: 16px;
}

.btn {
  width: 100%;
  max-width: 324px;
  font-weight: bold;
}
</style>
