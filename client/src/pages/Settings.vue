<template>
  <v-row class="text-left">
    <v-col cols="12" sm="6">
      <v-card>
        <v-form @submit.prevent="submitNickname">
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
              :rules="nicknameRules"
            ></v-text-field>
          </v-card-item>
          <v-card-actions>
            <v-btn type="submit" variant="elevated" color="primary">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-form @submit.prevent="submitEmail">
          <v-card-item>
            <div class="text-h6">
              Change Email
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
            <v-btn type="submit" variant="elevated" color="primary">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Ref } from 'vue'
import { updateEmail, updateProfile } from 'firebase/auth'
import { useNotification } from "@kyvg/vue3-notification";
import type { AppDataType } from '@/types'

const { notify } = useNotification()
const appData = inject<Ref<AppDataType>>('appData')
const nickname = ref(appData?.value?.user?.displayName || '')
const email = ref(appData?.value?.user?.email || '')
const nicknameRules = [(value: string) => !!value || 'Required']
const emailRules = [
  (value: string) => !!value || 'Required',
  (value: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid email'
  }
]

function submitNickname() {
  const user = appData?.value.user
  if (!user || !nickname.value) {
    return
  }

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
}

function submitEmail() {
  const user = appData?.value.user
  if (!user || !email.value) {
    return
  }

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
}
</script>

