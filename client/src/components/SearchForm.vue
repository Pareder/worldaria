<template>
  <form @submit.prevent="$emit('search', searchingText)" class="search">
    <div v-if="error" class="error">no such country</div>
    <input type="text" v-model="searchingText" placeholder="Country" class="search_icon" @input="checkError">
    <br>
    <input type="submit" value="Search" class="btn">
  </form>
</template>

<script>
  export default {
    data() {
      return {
        searchingText: null
      }
    },

    props: {
      error: {
        type: Boolean
      }
    },

    methods: {
      checkError() {
        if (this.error) {
          this.$emit('removeError')
        }
      }
    }
  }
</script>

<style scoped>
  input:not([type="checkbox"]) {
    width: 100px;
    padding: 5px;
    border: 1px solid #2c3e50;
    outline: 0;
    border-radius: 5px;
    font: 12px 'Montserrat';
    transition: all 0.3s;
  }
  .search input {
    width: 150px;
    margin: 0;
    font-size: 15px;
  }
  .search {
    position: relative;
    padding: 10px;
  }
  .search__label {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    background-image: url('search.svg');
  }
  input[type="text"] {
    padding: 5px 10px 5px 30px;
  }
  input[type="submit"] {
    height: auto;
    background: #51667f;
    color: #fff;
  }
  input[type="submit"]:hover {
    background-color: #354354;
  }
  input:focus {
    box-shadow: 0 0 10px #2c3e50;
  }
  .error {
    position: absolute;
    top: -10px;
    left: 10px;
    padding: 1px;
    background-color: tomato;
    color: #fff;
    font-size: 14px;
    opacity: 0;
    animation: error 0.5s forwards;
  }
  @keyframes error {
    100% {
      opacity: 1;
    }
  }
</style>
