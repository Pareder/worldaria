<template>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab value="game">Game History</v-tab>
      <v-tab value="bot">Bot History</v-tab>
      <v-tab value="online">Online History</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="game">
          <GameHistory :user="user"/>
        </v-window-item>
        <v-window-item value="bot">
          <BotHistory :user="user"/>
        </v-window-item>
        <v-window-item value="online">
          <OnlineHistory :user="user"/>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BotHistory from './BotHistory.vue'
import GameHistory from './GameHistory.vue'
import OnlineHistory from './OnlineHistory.vue'

defineProps<{ user: string }>()
const tab = ref('one')
</script>
