<template>
  <div>
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-content">
        <div class="status">
          <img class="status__img" src="../assets/images/global.svg" width="32" height="32" />
          You have been invited to game in mode
          <span class="mode__name">{{ capitalizedType }}</span>
          <span class="population">population: {{ modeName }}</span>
          by <span class="opponentColor">{{ opponent }}</span>
        </div>
      </div>
      <div class="buttons">
        <button class="btn--invite btn--blue" @click="$emit('makeDecision', true)">Accept</button>
        <button class="btn--invite btn--red" @click="$emit('makeDecision', false)">Decline</button>
      </div>
    </div>
  </div>
</template>

<script>
import { populationOptions } from '@/config'

export default {
  props: {
    opponent: {
      type: String
    },
    mode: {
      type: [Number, undefined, String]
    },
    type: {
      type: String
    }
  },

  computed: {
    capitalizedType() {
      if (!this.type) {
        return ''
      }

      const value = this.type.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },

    modeName() {
      const option = populationOptions.find(option => option.value === this.mode)

      return option?.description || 'all'
    }
  },
}
</script>

<style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    width: 100%;
    max-width: 500px;
    max-height: 100vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    padding-bottom: 3px;
    z-index: 1051;
    background: #fff;
    overflow-y: auto;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.3);
  }
  .modal::before {
    background: linear-gradient(to right, #9BFFE6 0%, #A3CCFF 100%);
    content: "";
    display: block;
    height: 3px;
    width: 100%;
  }
  .modal-content {
    height: auto;
    position: relative;
    z-index: 1052;
    background: #fff;
    font-size: 24px;
  }
  .status {
    padding: 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .status__img {
    position: relative;
    top: 8px;
  }
  .buttons {
    margin-bottom: 20px;
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .mode__name {
    padding: 0 5px;
    background-color: #000;
    color: #fff;
  }
  .population {
    margin-left: 5px;
    padding: 0 5px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .opponentColor {
    color: blue;
  }
</style>