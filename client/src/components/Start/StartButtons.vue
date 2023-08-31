<template>
  <v-row no-gutters align="center" class="text-h5 text-white my-5">
    <span class="mr-1">{{ capitalizedName }} mode</span>
    <v-icon icon="mdi-information-outline" color="white" size="small"></v-icon>
    <v-tooltip max-width="300" activator="parent">
      {{ description }}
    </v-tooltip>
  </v-row>
  <router-link v-if="link" :to="link">
    <v-btn variant="elevated" color="primary">
      {{ capitalizedName }}
    </v-btn>
  </router-link>
  <div v-else-if="name.toLowerCase().includes('online')" class="position-relative">
    <v-tooltip
      :model-value="signInError || false"
      text="* sign in to play online"
      location="top"
      :open-on-hover="false"
    >
      <template #activator="{ props }">
        <v-btn variant="elevated" color="primary" v-bind="props" @click="$emit('buttonClick')">
          {{ capitalizedName }}
        </v-btn>
      </template>
    </v-tooltip>
  </div>
  <v-btn v-else variant="elevated" color="primary" v-bind="props.props">
    {{ capitalizedName }}
  </v-btn>
</template>

<script setup lang="ts">
import capitalize from '@/utils/capitalize'

defineEmits(['buttonClick'])

const props = defineProps<{
  name: string
  description: string
  link?: string
  signInError?: boolean
  props?: object
}>()

const capitalizedName = capitalize(props.name)
</script>
