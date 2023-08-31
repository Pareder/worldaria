<template>
  <ModalTrigger
    default-opened
    persistent
    title="Congratulations!"
  >
    <template #content>
      <div v-if="!route.query.sort">
        <div class="text-h5 text-center">
          Your score:
          <span class="text-blue">{{ score }}</span>
        </div>
        <LeaderboardTable v-if="withSavingResult"/>
      </div>
      <div v-else class="text-h5 text-center">
        You have guessed all the countries.
      </div>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { onValue, ref, update } from 'firebase/database'
import type { AppDataType } from '@/types'
import { database } from '@/config'
import LeaderboardTable from '@/components/LeaderboardTable.vue'
import ModalTrigger from '@/components/ModalTrigger.vue'

const props = defineProps<{ score: number }>()
const route = useRoute()
const appData = inject<Ref<AppDataType>>('appData')
const userId = appData?.value.user?.uid
const nickname = appData?.value.user?.displayName
const withSavingResult = !route.query.sort

onMounted(() => {
  if (!withSavingResult || !userId) {
    return
  }

  onValue(ref(database, `users/${userId}`), snapshot => {
    const user = snapshot.val()
    if (!user?.score || user.score < props.score) {
      update(ref(database), {
        [`users/${userId}`]: {
          name: nickname,
          score: props.score,
          scoreDate: new Date().toUTCString()
        }
      })
    }
  }, {
    onlyOnce: true
  })
})
</script>
