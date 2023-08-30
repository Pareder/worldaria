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
    <div class="error" v-if="signInError">* sign in to play online</div>
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

<style scoped>
.error {
  position: absolute;
  top: -22px;
  left: 50%;
  padding: 0 5px;
  font-size: 14px;
  background-color: tomato;
  color: #fff;
  opacity: 0;
  animation: opacityChanger 0.5s forwards;
  white-space: nowrap;
  transform: translateX(-50%);
}

@keyframes opacityChanger {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>