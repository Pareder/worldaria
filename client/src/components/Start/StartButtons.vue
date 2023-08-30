<template>
  <v-row no-gutters align="center" class="text-h5 text-white my-5">
    <span class="mr-1">{{ capitalizedName }} mode</span>
    <InformationSvg color="#fff"></InformationSvg>
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
    <div class="error error--sign" v-if="signInError">* sign in to play online</div>
    <v-btn variant="elevated" color="primary" @click="$emit('buttonClick')">
      {{ capitalizedName }}
    </v-btn>
  </div>
  <v-btn v-else variant="elevated" color="primary" v-bind="props.props">
    {{ capitalizedName }}
  </v-btn>
</template>

<script setup lang="ts">
import capitalize from '@/utils/capitalize'
import InformationSvg from '@/components/InformationSvg.vue'

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
