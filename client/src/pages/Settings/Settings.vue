<template>
  <v-row class="text-left">
    <v-col cols="12" sm="6">
      <NicknameBlock/>
    </v-col>
    <v-col cols="12" sm="6">
      <EmailBlock/>
    </v-col>
    <v-col cols="12" sm="6">
      <PasswordBlock/>
    </v-col>
    <v-col cols="12" sm="6">
      <DeleteBlock/>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import DeleteBlock from './DeleteBlock.vue'
import EmailBlock from './EmailBlock.vue'
import NicknameBlock from './NicknameBlock.vue'
import PasswordBlock from './PasswordBlock.vue'
</script>
