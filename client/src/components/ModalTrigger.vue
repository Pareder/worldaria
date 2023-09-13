<template>
  <v-dialog
    v-model="open"
    width="500"
    :contained="contained || false"
    :persistent="persistent || false"
    transition="dialog-bottom-transition"
  >
    <template #activator="{ props }">
      <slot name="activator" v-bind="props"></slot>
    </template>
    <template #default>
      <v-card>
        <v-toolbar color="primary">
          <v-icon v-if="icon" :icon="icon" class="ml-4"></v-icon>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn v-if="!persistent" icon="mdi-close" @click="close"></v-btn>
        </v-toolbar>
        <v-card-text>
          <slot name="content" :close="close"></slot>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Props = {
  title: string,
  icon?: string
  defaultOpened?: boolean,
  persistent?: boolean
  contained?: boolean
}

const props = defineProps<Props>()
const open = ref(props.defaultOpened || false)

function close() {
  open.value = false
}
</script>
