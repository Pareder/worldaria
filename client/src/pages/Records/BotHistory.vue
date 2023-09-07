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
        v-model="filters.mode"
        label="Mode"
        variant="outlined"
        density="compact"
        multiple
        hide-details
        class="select"
        :menu-props="{ class: 'history-select-menu' }"
        :items="['easy', 'hard', 'extreme', 'impossible']"
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
          win: item.columns.score > item.raw.bot_score,
          lose: item.columns.score < item.raw.bot_score,
          draw: item.columns.score === item.raw.bot_score,
        }"
      >
        <td class="bg-shades-transparent">
          <v-row no-gutters align="center" class="flex-nowrap">
            <v-icon :icon="getTypeIcon(item.columns.type)" color="grey" class="mr-1"></v-icon>
            {{ capitalize(item.columns.type) }}
          </v-row>
        </td>
        <td class="bg-shades-transparent">
          <v-chip :color="getModeColor(item.columns.mode)">
            {{ capitalize(item.columns.mode) }}
          </v-chip>
        </td>
        <td class="bg-shades-transparent">{{ getSort(item.columns.sort) }}</td>
        <td class="bg-shades-transparent">
          <CompetitiveScore :first="item.columns.score" :last="item.raw.bot_score"/>
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
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import type { AppDataType, BotRecordType } from '@/types'
import { firestore, populationOptions } from '@/config'
import capitalize from '@/utils/capitalize'
import { getModeColor, getSort, getTypeIcon } from './utils'
import CompetitiveScore from './CompetitiveScore.vue'

type SortItem = {
  key: string
  order: 'asc' | 'desc'
}

type Filters = {
  type: string[]
  mode: string[]
  sort: (string | number)[]
}

const defaultFilters: Filters = {
  type: [],
  mode: [],
  sort: [],
}

const appData = inject<Ref<AppDataType>>('appData')
const history = ref<BotRecordType[]>([])
const filteredHistory = ref<BotRecordType[]>([])
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
    win: obj.win + (record.score > record.bot_score ? 1 : 0),
    lose: obj.lose + (record.score < record.bot_score ? 1 : 0),
    draw: obj.draw + (record.score === record.bot_score ? 1 : 0),
  }), { win: 0, lose: 0, draw: 0 })
})
const headers = [
  { title: 'Type', key: 'type' },
  { title: 'Mode', key: 'mode' },
  { title: 'Population', key: 'sort' },
  { title: 'Score', key: 'score' },
  { title: 'Date', key: 'date' },
]

watch(filters, (newFilters) => {
  filteredHistory.value = history.value.filter(record => {
    if (newFilters.type.length && !newFilters.type.includes(record.type)) {
      return false
    }

    if (newFilters.mode.length && !newFilters.mode.includes(record.mode)) {
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
    collection(firestore, 'bot'),
    where('user', '==', user.uid),
    orderBy(sortBy.value[0].key, sortBy.value[0].order),
  )
  const snapshot = await getDocs(q)
  const data: BotRecordType[] = []
  snapshot.forEach(doc => {
    data.push(doc.data() as BotRecordType)
  })
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