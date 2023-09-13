<template>
  <ModalTrigger
    default-opened
    persistent
    contained
    :title="inviteTo
      ? 'Waiting for opponent\'s decision'
      : opponentDecline
        ? 'The opponent has declined your invite'
        : 'Find an opponent to play with'
    "
  >
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <template #content>
      <div v-if="users.length">
        <p class="text-subtitle-2 mb-1">Choose your color</p>
        <v-color-picker
          v-model="color"
          hide-inputs
          class="mb-3 picker"
          width="100%"
        ></v-color-picker>
        <p class="text-subtitle-2 mb-1">Choose an opponent</p>
        <v-text-field
          label="Opponent's name"
          variant="outlined"
          color="primary"
          density="compact"
          class="mb-3"
          hide-details
          v-model="searchName"
          @input="sortUsers"
        ></v-text-field>
        <div
          v-for="user in usersList"
          :key="user.uid"
          class="user text-left"
        >
          {{ user.name }}
          <v-radio-group v-model="sort" inline hide-details>
            <v-radio
              v-for="option in populationOptions"
              :key="option.value"
              :value="option.value"
              :label="option.title"
              color="primary"
              class="w-25"
            ></v-radio>
          </v-radio-group>
          <v-btn
            v-if="user.uid === inviteTo"
            variant="outlined"
            size="small"
            color="error"
            class="mt-2"
            @click="invite(user)"
          >
            cancel
          </v-btn>
          <v-row v-else no-gutters justify="space-between" class="mt-2">
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              class="mr-2"
              :disabled="Boolean(inviteTo)"
              @click="invite(user, 'name')"
            >
              Name
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              class="mr-2"
              :disabled="Boolean(inviteTo)"
              @click="invite(user, 'flag')"
            >
              Flag
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              :disabled="Boolean(inviteTo)"
              @click="invite(user, 'capital')"
            >
              Capital
            </v-btn>
          </v-row>
        </div>
        <p v-if="searchName && foundUsers.length === 0">There are no such users</p>
      </div>
      <p v-else class="text-subtitle-1">There are no online users now. You can try another mode.</p>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MY_COLOR } from '@/config/colors'
import { populationOptions } from '@/config'
import ModalTrigger from '@/components/ModalTrigger.vue'

type User = {
  uid: string
  name: string
  socket_id: string
}

const emit = defineEmits(['sendInvite'])
const props = defineProps<{
  users: User[]
  inviteTo: string
  opponentDecline: boolean
}>()
const color = ref(MY_COLOR)
const searchName = ref('')
const foundUsers = ref<User[]>([])
const sort = ref('all')
const usersList = computed(() => {
  return searchName.value ? foundUsers.value : props.users
})

function sortUsers() {
  foundUsers.value = props.users.filter(user => user.name.toLowerCase().startsWith(searchName.value.toLowerCase()))
}

function invite(user: User, type?: string) {
  emit('sendInvite', {
    to: user.uid,
    color: color.value,
    type,
    sort: sort.value,
  })
}
</script>

<style scoped lang="scss">
.picker {
  &:deep(.v-color-picker-preview__alpha) {
    display: none;
  }
  &:deep(.v-color-picker-preview__dot) {
    border: 1px solid black;
  }
}

.user {
  margin-bottom: 10px;
  padding: 10px 20px;
  border-left: 5px solid rgb(var(--v-theme-secondary));
  transition: all 0.3s;
  &:hover {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>