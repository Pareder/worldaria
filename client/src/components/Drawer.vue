<template>
  <v-sheet
    :elevation="4"
    rounded
    class="pa-4 notification"
  >
    <v-row no-gutters justify="space-between" class="w-100">
      <p class="text-subtitle-2">
        {{ hasTimeLimit && game ? `Time: ${game.seconds}` : ''}}
      </p>
      <p v-if="game" class="text-subtitle-2">
        <slot name="header">
          <span class="font-weight-bold">{{ game.count + 1 }}</span> of {{ game.length }}
        </slot>
      </p>
    </v-row>
    <div class="w-100 text-h6">
      <slot></slot>
    </div>
    <v-row v-if="game?.score !== undefined" no-gutters justify="space-between" class="w-100 mt-2">
      <p class="text-subtitle-1">
        Score: {{ game.score }}
      </p>
      <p class="text-subtitle-1">
        Attempts: {{ game.attempts }}
      </p>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
defineProps<{
  game?: {
    count: number
    attempts: number
    length: number
    score?: number
    seconds: number
  }
  hasTimeLimit?: boolean
}>()
</script>

<style scoped>
.notification {
  position: absolute;
  right: 50px;
  top: 50px;
  z-index: 1000;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media screen and (max-width: 400px) {
  .notification {
    top: unset;
    bottom: 0;
    right: 0;
    width: 100%;
  }
}
</style>