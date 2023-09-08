<template>
  <v-card>
    <v-form v-model="valid" @submit.prevent="submitEmail">
      <v-card-item>
        <div class="d-flex align-center text-h6">
          Change Email
          <v-icon
            v-if="emailVerified"
            icon="mdi-check-circle"
            color="success"
            size="24"
            class="ml-1"
          ></v-icon>
        </div>
        <v-divider class="my-4"></v-divider>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          variant="outlined"
          color="primary"
          density="compact"
          :rules="emailRules"
        ></v-text-field>
      </v-card-item>
      <v-card-actions>
        <v-btn type="submit" variant="elevated" color="primary" :loading="isSubmitLoading">
          Save
        </v-btn>
        <v-btn
          type="button"
          class="ml-auto verify"
          :variant="emailVerified ? 'text' : 'outlined'"
          :color="emailVerified ? 'success' : 'primary'"
          :prepend-icon="emailVerified ? 'mdi-check' : ''"
          :disabled="emailVerified"
          :loading="isVerifyLoading"
          @click="sendVerification"
        >
          {{ emailVerified ? 'Email Verified' : 'Send Verification Email' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useNotification } from '@kyvg/vue3-notification'
import { sendEmailVerification, updateEmail } from 'firebase/auth'
import type { AppDataType } from '@/types'

const { notify } = useNotification()
const appData = inject<Ref<AppDataType>>('appData')
const email = ref(appData?.value?.user?.email || '')
const isSubmitLoading = ref(false)
const isVerifyLoading = ref(false)
const valid = ref(true)
const emailVerified = computed(() => Boolean(appData?.value?.user?.emailVerified))

const emailRules = [
  (value: string) => !!value || 'Required',
  (value: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid email'
  }
]

function submitEmail() {
  const user = appData?.value.user
  if (!user || !valid.value) {
    return
  }

  isSubmitLoading.value = true
  updateEmail(user, email.value)
    .then(() => {
      notify({
        type: 'success',
        title: 'Email updated successfully',
      })
    })
    .catch((error) => {
      notify({
        type: 'error',
        title: 'Something bad happened',
        text: error.message,
      })
    })
    .finally(() => isSubmitLoading.value = false)
}

function sendVerification() {
  const user = appData?.value.user
  if (!user) {
    return
  }

  isVerifyLoading.value = true
  sendEmailVerification(user)
    .then(() => {
      notify({
        type: 'success',
        title: 'Verification email sent successfully',
      })
    })
    .catch((error) => {
      notify({
        type: 'error',
        title: 'Something bad happened',
        text: error.message,
      })
    })
    .finally(() => isVerifyLoading.value = false)
}
</script>

<style scoped>
.verify {
  opacity: 1;
}
</style>