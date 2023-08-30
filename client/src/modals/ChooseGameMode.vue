<template>
  <ModalTrigger title="Guess countries by">
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <template #content>
      <p class="my-2">Mode</p>
      <v-radio-group v-model="mode" inline hide-details>
        <v-radio
          v-for="option in options"
          :key="option.id"
          :value="option.id"
          color="primary"
        >
          <template #label>
            <span class="mr-1">{{ option.name }}</span>
            <InformationSvg />
            <v-tooltip activator="parent" max-width="300" location="top">
              {{ option.description }}
            </v-tooltip>
          </template>
        </v-radio>
      </v-radio-group>
      <p class="my-2">Population</p>
      <v-radio-group v-model="sort" inline hide-details>
        <v-radio
          v-for="option in populationOptions"
          :key="option.id"
          :value="option.value"
          :label="option.name"
          color="primary"
        ></v-radio>
      </v-radio-group>
      <v-row no-gutters justify="space-between" class="mt-2">
        <router-link :to="{ name: mode === 'hard' ? 'Hard' : 'Game', query: { sort } }">
          <v-btn variant="elevated" color="primary">
            Name
          </v-btn>
        </router-link>
        <router-link :to="{ name: 'Flag', query: { mode, sort } }">
          <v-btn variant="elevated" color="primary">
            Flag
          </v-btn>
        </router-link>
        <router-link :to="{ name: 'Capital', query: { mode, sort } }">
          <v-btn variant="elevated" color="primary">
            Capital
          </v-btn>
        </router-link>
        <router-link :to="{ name: 'Area', query: { mode, sort } }">
          <v-btn variant="elevated" color="primary">
            Area
          </v-btn>
        </router-link>
      </v-row>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InformationSvg from '@/components/InformationSvg.vue'
import { populationOptions } from '@/config'
import ModalTrigger from '@/components/ModalTrigger.vue'

const mode = ref('normal')
const sort = ref('')
const options = [
  {
    id: 'normal',
    name: 'Normal',
    description: 'In Normal mode you have unlimited time on each country.'
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'In Hard mode you have only 15 seconds on each country. After 15 seconds you will lose 1 point.'
  }
]
</script>
