<template>
  <ModalTrigger
    default-opened
    persistent
    title="Congratulations!"
  >
    <template #content>
      <div class="text-h5 text-center">
        Your score:
        <span class="text-blue">{{ score }}</span>
      </div>
      <LeaderboardTable :type="type" :mode="mode" :sort="sort" />
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import type { AppDataType } from '@/types'
import { firestore } from '@/config'
import LeaderboardTable from '@/components/LeaderboardTable.vue'
import ModalTrigger from '@/components/ModalTrigger.vue'

const props = defineProps<{ score: number }>()
const route = useRoute()
const appData = inject<Ref<AppDataType>>('appData')
const userId = appData?.value.user?.uid
const nickname = appData?.value.user?.displayName
const type = route.path.split('/').pop() || 'name'
const mode = route.query.mode === 'hard' ? 'hard' : 'normal'
const sort = (Array.isArray(route.query.sort) ? route.query.sort[0] : route.query.sort)  || 'all'

onMounted(async () => {
  if (!userId) {
    return
  }

  await addDoc(collection(firestore, 'games', mode, type), {
    user: userId,
    score: props.score,
    sort,
    date: Date.now(),
  } as object)
  await setDoc(
    doc(firestore, 'users', userId),
    { name: nickname },
    { merge: true }
  )
})
</script>
