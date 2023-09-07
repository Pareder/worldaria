<template>
  <ModalTrigger title="Choose bot difficulty">
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
          class="w-50"
        >
          <template #label>
            <span class="mr-1">{{ option.name }}</span>
            <v-icon icon="mdi-information-outline" color="white" size="small"></v-icon>
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
          :key="option.value"
          :value="option.value"
          :label="option.title"
          color="primary"
          class="w-25"
        ></v-radio>
      </v-radio-group>
      <v-row no-gutters justify="space-between" class="mt-2">
        <router-link :to="{ name: 'Bot', query: { mode, sort, type: 'name' }}">
          <v-btn variant="elevated" color="primary">
            Name
          </v-btn>
        </router-link>
        <router-link :to="{ name: 'Bot', query: { mode, sort, type: 'flag' }}">
          <v-btn variant="elevated" color="primary">
            Flag
          </v-btn>
        </router-link>
        <router-link :to="{ name: 'Bot', query: { mode, sort, type: 'capital' }}">
          <v-btn variant="elevated" color="primary">
            Capital
          </v-btn>
        </router-link>
      </v-row>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { populationOptions } from '@/config'
import ModalTrigger from '@/components/ModalTrigger.vue'

const mode = ref('easy')
const sort = ref('')

const options = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'In Easy mode bot makes a lot of mistakes.'
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'In Hard mode bot makes not a lot of mistakes.'
  },
  {
    id: 'extreme',
    name: 'Extreme',
    description: 'In Extreme mode there are no borders between the countries'
  },
  {
    id: 'impossible',
    name: 'Impossible',
    description: 'In Impossible mode map is invisible, only hardcore.'
  }
]
</script>
