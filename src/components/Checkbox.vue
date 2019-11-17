<template>
  <div class="squaredThree">
    Timezones
    <br>
    <input type="checkbox" id="squaredThree" name="check" v-model="checkBox" @change="onChange" />
    <label for="squaredThree"></label>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checkBox: false
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.checkBox)
      this.$emit('toggleTimezone')
    }
  }
}
</script>
<style scoped lang="scss">
  .squaredThree {
    position: relative;
    padding: 0 10px;
    label {
      width: 20px;
      height: 20px;
      cursor: pointer;
      position: absolute;
      bottom: 0;
      left: calc(50% - 10px);
      background: linear-gradient(to top, #222 0%, #45484d 100%);
      border-radius: 4px;
      box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,.4);
      &:after {
        content: '';
        width: 9px;
        height: 5px;
        position: absolute;
        top: 4px;
        left: 4px;
        border: 3px solid #fcfff4;
        border-top: none;
        border-right: none;
        background: transparent;
        opacity: 0;
        transform: rotate(-45deg);
      }
      &:hover::after {
        opacity: 0.3;
      }
    }
    input[type=checkbox] {
      visibility: hidden;
      &:checked + label:after {
        opacity: 1;
      }    
    }
  }
</style>
