<template>
  <v-card>
    <v-card-text>
      <v-row align="center" class="mb-4">
        <v-col cols="8" sm="6" lg="4" xl="3">
          <v-text-field
            v-model="search"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            label="Search"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col v-if="search" class="flex-grow-0">
          <v-btn variant="outlined" color="primary" @click="search = ''">Clear</v-btn>
        </v-col>
      </v-row>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items-length="filteredLeaderboard.length"
        :items="filteredLeaderboard"
        item-value="name"
        :loading="loading"
        :search="search"
        class="elevation-1 text-left"
      >
        <template #item="{ item }">
          <tr role="button" @click="onClick(item.raw.uid)">
            <td>
              <v-row no-gutters align="center" class="flex-nowrap">
                <v-avatar
                  :color="stringToColor(item.raw.uid)"
                  :image="item.raw.avatar"
                  size="small"
                  class="mr-2"
                >
                  {{ item.columns.name[0] }}
                </v-avatar>
                {{ item.columns.name }}
                <v-icon v-if="item.raw.uid === appData?.user?.uid" icon="mdi-account" class="ml-1"></v-icon>
              </v-row>
            </td>
            <td>{{ item.columns.games || 0 }}</td>
            <td>{{ item.columns.bot_games || 0 }}</td>
            <td>{{ item.columns.online_games || 0 }}</td>
            <td>{{ item.columns.total_games || 0 }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import type { AppDataType, UserType } from '@/types'
import { firestore } from '@/config'
import stringToColor from '@/utils/stringToColor'

type SortItem = {
  key: string
  order: 'asc' | 'desc'
}

const router = useRouter()
const appData = inject<Ref<AppDataType>>('appData')
const leaderboard = ref<UserType[]>([])
const filteredLeaderboard = ref<UserType[]>([])
const loading = ref(true)
const itemsPerPage = ref(10)
const sortBy = ref<SortItem[]>([{ key: 'total_games', order: 'desc' }])
const search = ref('')
const headers = [
  { title: 'User', key: 'name' },
  { title: 'Games', key: 'games' },
  { title: 'Bot games', key: 'bot_games' },
  { title: 'Online games', key: 'online_games' },
  { title: 'Total', key: 'total_games' },
]

onMounted(async () => {
  const q = query(collection(firestore, 'users'), orderBy(sortBy.value[0].key, sortBy.value[0].order))
  const snapshot = await getDocs(q)
  const data: UserType[] = []
  snapshot.forEach(doc => {
    data.push({
      ...doc.data(),
      uid: doc.id,
    } as UserType)
  })
  leaderboard.value = data
  filteredLeaderboard.value = data
  loading.value = false
})

function onClick(uid: string) {
  router.push(uid === appData?.value.user?.uid ? '/profile/records' : `/profile/leaderboard/${uid}`)
}
</script>
