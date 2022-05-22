<template>
  <label>
    {{ options[sortBy].text }}
    <br>
    <select @change="onChange" :value="value" @input="$emit('input', $event.target.value)">
      <option v-for="option in options[sortBy].data" :value="option.value" :key="option.name">
        {{ option.name }}
      </option>
    </select>
  </label>
</template>

<script>
  import selectOptions from '../config/selectOptions'

  export default {
    data() {
      return {
        options: null
      }
    },

    props: {
      sortBy: {
        type: String
      },
      value: {
        type: String
      }
    },

    created() {
      this.options = { ...selectOptions }
    },

    methods: {
      onChange() {
        this.$emit('sortBy', this.sortBy)
      }
    }
  }
</script>

<style scoped>
  label {
    padding: 10px;
  }
  select {
    width: 100px;
    padding: 5px;
    border: 1px solid #2c3e50;
    outline: 0;
    border-radius: 5px;
    font: 12px 'Montserrat';
    transition: all 0.3s;
  }
  select:focus {
    box-shadow: 0 0 10px #2c3e50;
  }
</style>
