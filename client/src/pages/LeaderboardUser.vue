<template>
  <v-row no-gutters align="center" class="mb-5">
    <v-avatar :color="stringToColor(user)" :image="data?.avatar || ''">
      <span class="text-h5">{{ data?.name?.[0] }}</span>
    </v-avatar>
    <p class="ml-4 text-h5 text-white">{{ data?.name }}</p>
  </v-row>
  <UserRecords :user="user"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, } from 'firebase/firestore'
import type { UserType } from '@/types'
import { firestore } from '@/config'
import stringToColor from '@/utils/stringToColor'
import UserRecords from '@/components/UserRecords'

const route = useRoute()
const data = ref<UserType>()
const user = [route.params.uid].flat()[0] || ''

onMounted(async () => {
  if (!user) {
    return
  }

  const snapshot = await getDoc(doc(firestore, 'users', user))
  if (snapshot.exists()) {
    data.value = snapshot.data() as UserType
  }
})
</script>
