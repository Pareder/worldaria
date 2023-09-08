<template>
  <v-card>
    <v-form v-model="valid" @submit.prevent="submitAvatar">
      <v-card-item>
        <v-row no-gutters>
          <v-avatar
            :color="appData?.user?.uid ? stringToColor(appData.user.uid) : 'primary'"
            :image="appData?.user?.photoURL || ''"
            size="x-large"
            class="mr-4"
          >
            <span class="text-h5">{{ appData?.user?.displayName?.[0] }}</span>
          </v-avatar>
          <v-file-input
            v-model="avatar"
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            prepend-icon=""
            label="Avatar"
          ></v-file-input>
        </v-row>
      </v-card-item>
      <v-card-actions>
        <v-btn
          v-if="appData?.user?.photoURL"
          type="button"
          variant="outlined"
          color="error"
          :disabled="deleteLoading"
          @click="deleteAvatar"
        >
          Delete
        </v-btn>
        <v-btn type="submit" variant="elevated" color="primary" :loading="submitLoading">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useNotification } from '@kyvg/vue3-notification'
import { deleteObject, getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import type { AppDataType } from '@/types'
import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/config'
import randomString from '@/utils/randomString'
import stringToColor from '@/utils/stringToColor'

const { notify } = useNotification()
const appData = inject<Ref<AppDataType>>('appData')
const valid = ref(false)
const avatar = ref<File[]>()
const submitLoading = ref(false)
const deleteLoading = ref(false)
const rules = [
  (value?: File[]) => !!value?.length || 'Required',
  (value?: File[]) => !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!',
]

function getExtension(name: string) {
  const parts = name.split('.')
  return parts.length >= 2 ? parts[parts.length - 1] : name
}

function extractFileName(url: string) {
  const parts = url.split('/')
  const fileName = parts[parts.length - 1]
  const queryIndex = fileName.indexOf('?')
  if (queryIndex !== -1) {
    return fileName.substring(0, queryIndex)
  }

  return fileName
}

function submitAvatar() {
  const user = appData?.value.user
  const file = avatar.value?.[0]
  if (!user || !file) {
    return
  }

  submitLoading.value = true
  const storage = getStorage()
  const ref = storageRef(storage, `${randomString(16)}.${getExtension(file.name)}`)
  uploadBytes(ref, file)
    .then(snapshot => getDownloadURL(snapshot.ref))
    .then(photoURL => updateProfile(user, { photoURL }).then(() => {
      setDoc(
        doc(firestore, 'users', user.uid),
        { avatar: photoURL },
        { merge: true },
      )
    }))
    .then(() => {
      notify({
        type: 'success',
        title: 'Avatar updated successfully',
      })
    })
    .catch((error) => {
      notify({
        type: 'error',
        title: 'Something bad happened',
        text: error.message,
      })
    })
    .finally(() => submitLoading.value = false)
}

function deleteAvatar() {
  const user = appData?.value.user
  if (!user || !user.photoURL) {
    return
  }

  deleteLoading.value = true
  const storage = getStorage()
  const avatarRef = storageRef(storage, extractFileName(user.photoURL))
  deleteObject(avatarRef)
    .then(() => updateProfile(user, { photoURL: '' }).then(() => {
      setDoc(
        doc(firestore, 'users', user.uid),
        { avatar: '' },
        { merge: true },
      )
    }))
    .then(() => {
      notify({
        type: 'success',
        title: 'Avatar deleted successfully',
      })
    })
    .catch((error) => {
      notify({
        type: 'error',
        title: 'Something bad happened',
        text: error.message,
      })
    })
    .finally(() => deleteLoading.value = false)
}
</script>
