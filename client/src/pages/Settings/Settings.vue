<template>
  <v-row class="text-left">
    <v-col cols="12">
      <AvatarBlock/>
    </v-col>
    <v-col cols="12" md="6">
      <NicknameBlock/>
    </v-col>
    <v-col cols="12" md="6">
      <EmailBlock/>
    </v-col>
    <v-col cols="12" md="6">
      <PasswordBlock/>
    </v-col>
    <v-col cols="12" md="6">
      <DeleteBlock/>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AvatarBlock from '@/pages/Settings/AvatarBlock.vue'
import DeleteBlock from './DeleteBlock.vue'
import EmailBlock from './EmailBlock.vue'
import NicknameBlock from './NicknameBlock.vue'
import PasswordBlock from './PasswordBlock.vue'
</script>
