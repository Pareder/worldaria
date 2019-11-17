<template>
  <div class="flag"></div>
</template>
<script>
export default {
  props: {
    country: {
      type: String,
      required: true
    }
  },
  computed: {
    imageSource () {
      const formattedName = this.country.replace(/ /g, '').toLowerCase()
      const cryptedName = this.xorEncrypt('worldaria', formattedName)
      return `../img/flags/new/${cryptedName}.svg`
    }
  },
  watch: {
    async country () {
      this.getSvg()
    }
  },
  async mounted () {
    this.getSvg()
  },
  methods: {
    async getSvg () {
      const svg = await fetch(this.imageSource).then(r => r.text());
      this.$el.innerHTML = svg;
    },
    keyCharAt (key, i) {
      return key.charCodeAt(Math.floor(i % key.length))
    },
    xorEncrypt (key, data) {
      return data.split('').map((c, i) => {
        return c.charCodeAt(0) ^ this.keyCharAt(key, i)
      }).join('')
    }
  }
}
</script>
<style scoped>
  .flag {
    width: 70%;
    height: 186px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
<style>
  .flag svg {
    width: 100%;
    height: auto;
    display: block;
  }
</style>