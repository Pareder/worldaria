<template>
  <div class="text-h5 my-5">
    {{ capitalizedName }} mode
    <img src="@/assets/images/information.svg" width="24" height="24" />
    <v-tooltip max-width="300" activator="parent">
      {{ description }}
    </v-tooltip>
  </div>
  <router-link v-if="isRoute" :to="link">
    <v-btn variant="elevated" color="primary">
      {{ capitalizedName }}
    </v-btn>
  </router-link>
  <div v-else-if="name.toLowerCase().includes('online')" class="position-relative">
    <div class="error error--sign" v-if="signInError">* sign in to play online</div>
    <v-btn variant="elevated" color="primary" @click="$emit('buttonClick')">
      {{ capitalizedName }}
    </v-btn>
  </div>
  <v-btn v-else variant="elevated" color="primary" @click="$emit('buttonClick')">
    {{ capitalizedName }}
  </v-btn>
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

    computed: {
      capitalizedName() {
        if (!this.name) return ''
        const value = this.name.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }
</script>
