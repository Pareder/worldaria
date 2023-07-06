<template>
  <div>
    <div class="mode details-mode">
      <span class="mode_name">
        {{ name | capitalize }} mode
        <img src="../../assets/images/information.svg" width="24" height="24" />
      </span>
      <div class="hidden">
        <p class="px5">{{ description }}</p>
      </div>
    </div>
    <router-link v-if="isRoute" :to="link" tag="button" class="btn btn--start">{{ name | capitalize }}</router-link>
    <div v-else-if="name.toLowerCase().includes('online')" class="btn--online">
      <div class="error error--sign" v-if="signInError">* sign in to play online</div>
      <button class="btn btn--start" @click="$emit('buttonClick')">{{ name | capitalize }}</button>
    </div>
    <button v-else class="btn btn--start" @click="$emit('buttonClick')">{{ name | capitalize }}</button>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String
      },
      description: {
        type: String
      },
      link: {
        type: String
      },
      isRoute: {
        type: Boolean
      },
      signInError: {
        type: Boolean
      }
    },

    filters: {
      capitalize(value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }
</script>

<style scoped>
  .mode {
    position: relative;
    margin: 20px 0;
    font-size: 24px;
  }
  .mode img {
    position: relative;
    top: 3px;
    cursor: pointer;
  }
</style>
