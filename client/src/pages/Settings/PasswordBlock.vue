<template>
  <v-card>
    <v-form v-model="valid" @submit.prevent="submitPassword">
      <v-card-item>
        <div class="text-h6">
          Change Password
        </div>
        <v-divider class="my-4"></v-divider>
        <PasswordField
          v-model="oldPassword"
          label="Old Password"
          variant="outlined"
          color="primary"
          density="compact"
          :rules="oldRules"
        ></PasswordField>
        <PasswordField
          v-model="newPassword"
          label="New Password"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-2"
          :rules="newRules"
        ></PasswordField>
        <PasswordField
          v-model="repeatPassword"
          label="Repeat Password"
          variant="outlined"
          color="primary"
          density="compact"
          class="mt-2"
          :rules="repeatRules"
        ></PasswordField>
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
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useNotification } from '@kyvg/vue3-notification'
import type { AppDataType } from '@/types'
import PasswordField from '@/components/PasswordField.vue'

const { notify } = useNotification()
const appData = inject<Ref<AppDataType>>('appData')
const oldPassword = ref('')
const newPassword = ref('')
const repeatPassword = ref('')
const loading = ref(false)
const valid = ref(false)

const oldRules = [(value: string) => !!value || 'Required']
const newRules = [oldRules[0], (value: string) => value.length >= 6 || 'Minimum 6 characters']
const repeatRules = [
  oldRules[0],
  (value: string) => value === newPassword.value || 'Passwords do not match',
]

async function submitPassword() {
  const user = appData?.value.user
  if (!user || !valid.value) {
    return
  }

  loading.value = true
  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email as string, oldPassword.value))
    await updatePassword(user, newPassword.value)
    notify({
      type: 'success',
      title: 'Password updated successfully',
    })
    oldPassword.value = ''
    newPassword.value = ''
    repeatPassword.value = ''
  } catch (error) {
    const message = error !== null && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message
    notify({
      type: 'error',
      title: 'Something bad happened',
      text: message || '',
    })
  } finally {
    loading.value = false
  }
}
</script>
