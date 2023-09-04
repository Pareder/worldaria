<template>
  <v-card>
    <v-form v-model="valid" @submit.prevent="submitNickname">
      <v-card-item>
        <div class="text-h6">
          Change Nickname
        </div>
        <v-divider class="my-4"></v-divider>
        <v-text-field
          v-model="nickname"
          label="Nickname"
          variant="outlined"
          color="primary"
          density="compact"
          :rules="rules"
        ></v-text-field>
      </v-card-item>
      <v-card-actions>
        <v-btn type="submit" variant="elevated" color="primary" :loading="loading">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Ref } from 'vue'
import { updateProfile } from 'firebase/auth'
import { useNotification } from '@kyvg/vue3-notification'
import type { AppDataType } from '@/types'

const { notify } = useNotification()
const appData = inject<Ref<AppDataType>>('appData')
const nickname = ref(appData?.value?.user?.displayName || '')
const loading = ref(false)
const valid = ref(true)
const rules = [(value: string) => !!value || 'Required']

function submitNickname() {
  const user = appData?.value.user
  if (!user || !valid.value) {
    return
  }

  loading.value = true
  updateProfile(user, { displayName: nickname.value })
    .then(() => {
      notify({
        type: 'success',
        title: 'Nickname updated successfully',
      })
    })
    .catch((error) => {
      notify({
        type: 'error',
        title: 'Something bad happened',
        text: error.message,
      })
    })
    .finally(() => loading.value = false)
}
</script>
