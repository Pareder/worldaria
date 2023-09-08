<template>
  <UserRecords :user="appData?.user?.uid || ''"/>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'
import UserRecords from '@/components/UserRecords'
import type { AppDataType } from '@/types'

const appData = inject<Ref<AppDataType>>('appData')
</script>
