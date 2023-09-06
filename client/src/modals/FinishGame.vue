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
      <div v-if="!appData?.user" class="mt-4 text-center">
        <SignModal/> to save your record
      </div>
      <LeaderboardTable :type="type" :mode="mode" :sort="sort" />
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import type { AppDataType } from '@/types'
import { firestore } from '@/config'
import LeaderboardTable from '@/components/LeaderboardTable.vue'
import ModalTrigger from '@/components/ModalTrigger.vue'
import SignModal from '@/modals/SignModal.vue'

const props = defineProps<{ score: number }>()
const route = useRoute()
const appData = inject<Ref<AppDataType>>('appData')
const type = route.path.split('/').pop() || 'name'
const mode = route.query.mode === 'hard' ? 'hard' : 'normal'
const sort = (Array.isArray(route.query.sort) ? route.query.sort[0] : route.query.sort)  || 'all'

onMounted(() => {
  if (!appData?.value.user) {
    const unsubscribe = onAuthStateChanged(getAuth(), user => {
      if (user) {
        saveRecord()
        unsubscribe()
      }
    })
    return
  }

  saveRecord()
})

async function saveRecord() {
  const user = appData?.value.user
  if (!user) {
    return
  }

  await addDoc(collection(firestore, 'games'), {
    user: user.uid,
    score: props.score,
    type,
    mode,
    sort,
    date: Date.now(),
  } as object)
  await setDoc(
    doc(firestore, 'users', user.uid),
    { name: user.displayName },
    { merge: true }
  )
}
</script>
