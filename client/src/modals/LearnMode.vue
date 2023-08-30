<template>
  <ModalTrigger title="Learn countries by">
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <template #content>
      <v-row no-gutters justify="space-between">
        <router-link to="/learn/full">
          <v-btn variant="elevated" color="primary">
            Full
          </v-btn>
        </router-link>
        <router-link to="/learn/continent">
          <v-btn variant="elevated" color="primary">
            Lands
          </v-btn>
        </router-link>
        <router-link to="/learn/countries">
          <v-btn variant="elevated" color="primary">
            Regions
          </v-btn>
        </router-link>
      </v-row>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import ModalTrigger from '@/components/ModalTrigger.vue'
</script>
