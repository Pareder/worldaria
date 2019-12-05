<template>
  <div class="relative">
    <div class="search">
      <input
        class="search__input search_icon"
        type="text"
        placeholder="Search"
        v-model="searchCountry"
        @input="onInput($event.target.value)"
      >
      <div v-if="foundCountries.length > 0" class="foundCountries">
        {{ foundCountries.length }}
      </div>
    </div>
    <transition name="slide-fade">
      <div v-if="searchCountry" class="found">
        <div v-if="foundCountries.length === 0">No countries found</div>
        <div
          v-for="(country, id) in foundCountries"
          :key="id"
          class="found__country"
          @click="$emit('onClick', country)"
        >
          {{ country }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchCountry: ''
      }
    },

    props: {
      foundCountries: {
        type: Array
      }
    },

    created() {
      this.$parent.$on('clearSearch', this.clearSearch)
    },

    methods: {
      onInput(value) {
        if (value) {
          this.$emit('input', value)
          this.$emit('search', value)
        }
      },

      clearSearch() {
        this.searchCountry = ''
      }
    }
  }
</script>

<style scoped>
  .relative {
    position: relative;
  }
  .found {
    position: absolute;
    left: 0;
    right: 0;
    max-height: 300px;
    overflow-y: auto;
    background-color: #fff;
    border: 1px solid #51667f;
  }
  .foundCountries {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: blue;
    border-radius: 50%;
    box-shadow: 0 0 5px blue;
    background-color: rgba(159, 159, 255, 0.2);
  }
  .found__country {
    padding: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .found__country:hover {
    background-color: #9bffe6;  
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
