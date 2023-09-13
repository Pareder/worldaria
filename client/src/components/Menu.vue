<template>
  <v-list density="compact" class="text-left" nav>
    <ChooseGameMode v-slot="props">
      <v-tooltip
        :text="GAME_MODE"
        max-width="300"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-list-item
            prepend-icon="mdi-gamepad-circle"
            title="Game"
            v-bind="{ ...tooltipProps, ...props }"
          ></v-list-item>
        </template>
      </v-tooltip>
    </ChooseGameMode>
    <v-tooltip
      v-if="isAuth"
      :text="ONLINE_MODE"
      max-width="300"
    >
      <template v-slot:activator="{ props }">
        <v-list-item
          to="/online"
          prepend-icon="mdi-web"
          title="Online"
          v-bind="props"
        ></v-list-item>
      </template>
    </v-tooltip>
    <ChooseBotMode v-slot="props">
      <v-tooltip
        :text="BOT_MODE"
        max-width="300"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-list-item
            prepend-icon="mdi-robot"
            title="Bot"
            v-bind="{ ...tooltipProps, ...props }"
          ></v-list-item>
        </template>
      </v-tooltip>
    </ChooseBotMode>
    <LearnMode v-slot="props">
      <v-tooltip
        :text="LEARN_MODE"
        max-width="300"
      >
        <template v-slot:activator="{ props: tooltipProps }">
          <v-list-item
            prepend-icon="mdi-school"
            title="Learn"
            v-bind="{ ...tooltipProps, ...props }"
          ></v-list-item>
        </template>
      </v-tooltip>
    </LearnMode>
    <v-tooltip
      :text="DETAILS_MODE"
      max-width="300"
    >
      <template v-slot:activator="{ props }">
        <v-list-item
          to="/learn/details"
          prepend-icon="mdi-information-variant"
          title="Details"
          v-bind="props"
        ></v-list-item>
      </template>
    </v-tooltip>
    <v-tooltip
      :text="HISTORY_MODE"
      max-width="300"
    >
      <template v-slot:activator="{ props }">
        <v-list-item
          to="/learn/history"
          prepend-icon="mdi-history"
          title="History"
          v-bind="props"
        ></v-list-item>
      </template>
    </v-tooltip>
    <template v-if="isAuth">
      <v-divider class="my-2"></v-divider>
      <v-list-item to="/profile/records" prepend-icon="mdi-seal" title="Records"></v-list-item>
      <v-list-item to="/profile/leaderboard" prepend-icon="mdi-podium" title="Leaderboard"></v-list-item>
      <v-divider class="my-2"></v-divider>
      <v-list-item to="/profile/settings" prepend-icon="mdi-cog" title="Settings"></v-list-item>
    </template>
  </v-list>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
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
const isAuth = computed(() => Boolean(appData?.value?.user))
</script>
