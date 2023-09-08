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
        :items="['name', 'flag', 'capital', 'area']"
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
        :items="['normal', 'hard']"
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
      <tr>
        <td>
          <v-row no-gutters align="center" class="flex-nowrap">
            <v-icon :icon="getTypeIcon(item.columns.type)" color="grey" class="mr-1"></v-icon>
            {{ capitalize(item.columns.type) }}
          </v-row>
        </td>
        <td>
          <v-chip :color="item.columns.mode === 'hard' ? 'red' : 'green'">
            {{ capitalize(item.columns.mode) }}
          </v-chip>
        </td>
        <td>{{ getSort(item.columns.sort) }}</td>
        <td>{{ item.columns.score }}</td>
        <td class="text-no-wrap">{{ new Date(item.columns.date).toLocaleString() }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import type { RecordType } from '@/types'
import { firestore, populationOptions } from '@/config'
import capitalize from '@/utils/capitalize'
import { getSort, getTypeIcon } from './utils'

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

const props = defineProps<{ user: string }>()
const history = ref<RecordType[]>([])
const filteredHistory = ref<RecordType[]>([])
const itemsPerPage = ref(10)
const itemsLength = ref(0)
const loading = ref(true)
const sortBy = ref<SortItem[]>([{ key: 'date', order: 'desc' }])
const filters = ref<Filters>({ ...defaultFilters })

const isFiltered = computed(() => {
  return Object.values(filters.value).some(filter => filter.length)
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
  if (!props.user) {
    return
  }

  const q = query(
    collection(firestore, 'games'),
    where('user', '==', props.user),
    orderBy(sortBy.value[0].key, sortBy.value[0].order),
  )
  const snapshot = await getDocs(q)
  const data: RecordType[] = []
  snapshot.forEach(doc => {
    data.push(doc.data() as RecordType)
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
</style>

<style>
.history-select-menu .v-list-item-title {
  text-transform: capitalize;
}
</style>