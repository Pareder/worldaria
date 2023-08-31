<template>
  <v-autocomplete
    label="Search"
    variant="outlined"
    density="compact"
    clearable
    class="w-100 mt-4"
    :items="items"
    :custom-filter="filter"
    @input="onInput($event.target.value)"
    @update:model-value="onChange"
  ></v-autocomplete>
</template>

<script setup lang="ts">
type Props = {
  items: string[]
  showAmount?: boolean
}

const emit = defineEmits(['search', 'onClick'])
withDefaults(defineProps<Props>(), {
  showAmount: true
})

function onInput(value: string) {
  emit('search', value)
}

function onChange(value: string | null) {
  emit('onClick', value)
}

function filter(country: string, search: string) {
  return country.toLowerCase().startsWith(search?.toLowerCase())
}
</script>
