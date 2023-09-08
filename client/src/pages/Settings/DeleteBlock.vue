<template>
  <v-card variant="outlined" color="error">
    <v-card-item>
      <v-row no-gutters align="start" class="flex-nowrap">
        <div class="mt-1 mr-2 pa-2 d-flex bg-red-lighten-5 rounded-circle">
          <v-icon icon="mdi-alert-outline" color="red"></v-icon>
        </div>
        <div>
          <div class="text-h6">
            Delete Account?
          </div>
          <p class="text-subtitle-1 text-grey">
            The entire data including all data and records will be deleted. This action cannot be undone, so proceed with caution.
          </p>
        </div>
      </v-row>
      <v-divider class="mt-4"></v-divider>
    </v-card-item>
    <v-card-actions>
      <v-btn
        variant="elevated"
        color="error"
        class="ml-auto"
        :loading="loading"
        @click="approveDelete"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteUser } from 'firebase/auth'
import { useNotification } from '@kyvg/vue3-notification'
import type { AppDataType } from '@/types'

const router = useRouter()
const { notify } = useNotification()
const appData = inject<Ref<AppDataType>>('appData')
const loading = ref(false)

function approveDelete() {
  const user = appData?.value.user
  if (!user) {
    return
  }

  loading.value = true
  deleteUser(user)
    .then(() => {
      notify({
        type: 'success',
        title: 'Account deleted successfully',
      })
      router.replace('/')
    })
    .catch(error => {
      notify({
        type: 'error',
        title: 'Something bad happened',
        text: error.message,
      })
    })
    .finally(() => loading.value = false)
}
</script>
