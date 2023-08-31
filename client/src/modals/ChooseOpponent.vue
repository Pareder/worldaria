<template>
  <ModalTrigger
    default-opened
    persistent
    :title="inviteSent
      ? 'Waiting for opponent\'s decision'
      : opponentDecline
        ? 'The opponent has declined your invite'
        : 'Find an opponent or play with random one'
    "
  >
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <template #content>
      <div v-if="users.length > 1">
        <v-btn
          variant="elevated"
          color="primary"
          :disabled="inviteSent"
          @click="$emit('randomOpponent')"
        >
          Random
        </v-btn>
        <v-text-field
          label="Opponent's name"
          variant="outlined"
          color="primary"
          density="compact"
          class="my-3"
          hide-details
          v-model="searchName"
          @input="sortUsers"
        ></v-text-field>
        <div
          :key="id"
          class="user"
          v-for="(user, id) in usersList"
        >
          {{ user }}
          <v-radio-group v-model="sort" inline hide-details>
            <v-radio
              v-for="option in populationOptions"
              :key="option.id"
              :value="option.value"
              :label="option.name"
              color="primary"
            ></v-radio>
          </v-radio-group>
          <v-btn
            v-if="idPressed === id && inviteSent"
            variant="outlined"
            size="small"
            color="error"
            @click="invite(user, id)"
          >
            cancel
          </v-btn>
          <div v-else>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              class="mr-2"
              :disabled="(idPressed !== id && inviteSent)"
              @click="invite(user, id, 'name')"
            >
              Name
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              class="mr-2"
              :disabled="(idPressed !== id && inviteSent)"
              @click="invite(user, id, 'flag')"
            >
              Flag
            </v-btn>
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              :disabled="(idPressed !== id && inviteSent)"
              @click="invite(user, id, 'capital')"
            >
              Capital
            </v-btn>
          </div>
        </div>
        <p v-if="searchName && foundUsers.length === 0">There are no such users</p>
      </div>
      <p v-else class="text-subtitle-1">There are no online users now. You can try another mode.</p>
    </template>
  </ModalTrigger>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { populationOptions } from '@/config'
import ModalTrigger from '@/components/ModalTrigger.vue'

const emit = defineEmits(['sendInvite', 'randomOpponent'])
const props = defineProps<{
  users: string[]
  nickname?: string
  inviteSent: boolean
  opponentDecline: boolean
}>()
const searchName = ref('')
const idPressed = ref<number>()
const foundUsers = ref<string[]>([])
const sort = ref('')
const usersList = computed(() => {
  return (searchName.value ? foundUsers.value : props.users).filter(user => user !== props.nickname)
})

function sortUsers() {
  foundUsers.value = props.users.filter(user => user.startsWith(searchName.value))
}

function invite(name: string, id: number, type?: string) {
  idPressed.value = id
  emit('sendInvite', {
    name,
    type,
    sort: sort.value,
  })
}
</script>

<style scoped>
.user {
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: #f2f2f2;
  border-left: 5px solid #003842;
  transition: all 0.3s;
}

.user:hover {
  background-color: #f9f9f9;
  border-color: #00BDE8;
}
</style>