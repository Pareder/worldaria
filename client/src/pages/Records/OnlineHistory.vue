<template>
  <v-row align="center" class="mt-2 mb-4">
    <v-col cols="12" sm="6" lg="3" xl="2">
      <v-select
        v-model="filters.type"
        label="Type"
        variant="outlined"
        density="compact"
        multiple
        hide-details
        class="select"
        :menu-props="{ class: 'history-select-menu' }"
        :items="['name', 'flag', 'capital']"
      ></v-select>
    </v-col>
    <v-col cols="12" sm="6" lg="3" xl="2">
      <v-select
        v-model="filters.sort"
        label="Population"
        variant="outlined"
        density="compact"
        multiple
        hide-details
        :items="populationOptions"
      ></v-select>
    </v-col>
    <v-col v-if="isFiltered" class="flex-grow-0">
      <v-btn variant="outlined" color="primary" @click="clearFilters">Clear</v-btn>
    </v-col>
  </v-row>
  <p class="mb-2 text-subtitle-1 text-left">
    <span class="mr-2">Total: {{ filteredHistory.length }}</span>
    <span class="mr-2 text-green">Won: {{ stats.win }}</span>
    <span class="mr-2 text-red">Lost: {{ stats.lose }}</span>
    <span class="mr-2 text-grey">Drew: {{ stats.draw }}</span>
    <span class="mr-2">
      Win rate: {{ (stats.win / (filteredHistory.length || 1) * 100).toFixed(2) }}%
    </span>
  </p>
  <v-data-table
    v-model:items-per-page="itemsPerPage"
    v-model:sort-by="sortBy"
    :headers="headers"
    :items-length="itemsLength"
    :items="filteredHistory"
    :loading="loading"
    class="elevation-1 text-left"
  >
    <template #item="{ item }">
      <tr
        :class="{
          win: item.raw.my_score > item.raw.enemy_score,
          lose: item.raw.my_score < item.raw.enemy_score,
          draw: item.raw.my_score === item.raw.enemy_score,
        }"
      >
        <td class="bg-shades-transparent">
          <v-row no-gutters align="center" class="flex-nowrap">
            <v-icon :icon="getTypeIcon(item.columns.type)" color="grey" class="mr-1"></v-icon>
            {{ capitalize(item.columns.type) }}
          </v-row>
        </td>
        <td class="bg-shades-transparent">{{ getSort(item.columns.sort) }}</td>
        <td class="bg-shades-transparent">{{ item.columns.enemy }}</td>
        <td class="bg-shades-transparent">
          <CompetitiveScore :first="item.raw.my_score" :last="item.raw.enemy_score"/>
        </td>
        <td class="text-no-wrap bg-shades-transparent">
          {{ new Date(item.columns.date).toLocaleString() }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import type { AppDataType, OnlineRecordType } from '@/types'
import { firestore, populationOptions } from '@/config'
import capitalize from '@/utils/capitalize'
import { getSort, getTypeIcon } from './utils'
import CompetitiveScore from './CompetitiveScore.vue'

type UserOnlineRecordType = OnlineRecordType & {
  enemy: string
  my_score: number
  enemy_score: number
}

type SortItem = {
  key: string
  order: 'asc' | 'desc'
}

type Filters = {
  type: string[]
  sort: (string | number)[]
}

const defaultFilters: Filters = {
  type: [],
  sort: [],
}

const appData = inject<Ref<AppDataType>>('appData')
const history = ref<UserOnlineRecordType[]>([])
const filteredHistory = ref<UserOnlineRecordType[]>([])
const itemsPerPage = ref(10)
const itemsLength = ref(0)
const loading = ref(true)
const sortBy = ref<SortItem[]>([{ key: 'date', order: 'desc' }])
const filters = ref<Filters>({ ...defaultFilters })

const isFiltered = computed(() => {
  return Object.values(filters.value).some(filter => filter.length)
})
const stats = computed(() => {
  return filteredHistory.value.reduce((obj, record) => ({
    win: obj.win + (record.my_score > record.enemy_score ? 1 : 0),
    lose: obj.lose + (record.my_score < record.enemy_score ? 1 : 0),
    draw: obj.draw + (record.my_score === record.enemy_score ? 1 : 0),
  }), { win: 0, lose: 0, draw: 0 })
})
const headers = [
  { title: 'Type', key: 'type' },
  { title: 'Population', key: 'sort' },
  { title: 'Enemy', key: 'enemy' },
  { title: 'Score', key: 'scores' },
  { title: 'Date', key: 'date' },
]

watch(filters, (newFilters) => {
  filteredHistory.value = history.value.filter(record => {
    if (newFilters.type.length && !newFilters.type.includes(record.type)) {
      return false
    }

    if (newFilters.sort.length && !newFilters.sort.includes(String(record.sort))) {
      return false
    }

    return true
  })
}, { deep: true })

onMounted(async () => {
  const user = appData?.value?.user
  if (!user) {
    return
  }

  const q = query(
    collection(firestore, 'online'),
    where('users', 'array-contains', user.uid),
    orderBy(sortBy.value[0].key, sortBy.value[0].order),
  )
  const snapshot = await getDocs(q)
  const promises: Promise<UserOnlineRecordType | null>[] = []
  snapshot.forEach(recordDoc => {
    const record = recordDoc.data() as OnlineRecordType
    const enemyIndex = record.users.findIndex(item => item !== user.uid)
    promises.push(new Promise(resolve => {
      getDoc(doc(firestore, 'users', record.users[enemyIndex]))
        .then(userDoc => {
          const enemyUser = userDoc.data() as { name: string }
          resolve({
            ...record,
            my_score: record.scores[enemyIndex ? 0 : 1],
            enemy: enemyUser.name,
            enemy_score: record.scores[enemyIndex],
          })
        })
        .catch(() => resolve(null))
    }))
  })
  const data = (await Promise.all(promises)).filter(Boolean) as UserOnlineRecordType[]
  itemsLength.value = data.length
  history.value = data
  filteredHistory.value = data
  loading.value = false
})

function clearFilters() {
  filters.value = { ...defaultFilters }
}
</script>

<style scoped>
.select:deep(.v-select__selection-text) {
  text-transform: capitalize;
}

.win {
  background-color: rgba(var(--v-theme-success), 0.12);
}

.lose {
  background-color: rgba(var(--v-theme-error), 0.12);
}

.draw {
  background-color: rgba(var(--v-theme-on-surface-variant), 0.12);
}
</style>

<style>
.history-select-menu .v-list-item-title {
  text-transform: capitalize;
}
</style>