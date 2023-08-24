<template>
  <div>
    <div class="modal-backdrop" @click="$emit('close')"></div>
    <transition name="fade" appear>
      <div class="modal">
        <div class="modal-content">
          <img class="cancel" src="@/assets/images/cancel.svg" @click.prevent="$emit('close')" />
          <div class="status">
            <img
              class="status__img"
              :src="`/img/${bot ? 'artificial-intelligence' : 'mode'}.svg`"
              width="32"
              height="32"
            />
            {{ bot ? 'Choose bot difficulty' : 'Guess countries by' }}
          </div>
          <p class="title">Mode</p>
          <ul v-if="bot" class="game_options mode">
            <li
              class="option"
              v-for="option in botOptions"
              :key="option.id"
            >
              <input
                class="option__input"
                type="radio"
                :id="option.id"
                name="botMode"
                v-model="mode"
                :value="option.id"
              >
              <label class="option__label" :for="option.id">
                <div class="check"></div>
                {{ option.name }}
                <InformationSvg />
                <v-tooltip activator="parent" max-width="300" location="top">
                  {{ option.description }}
                </v-tooltip>
              </label>
            </li>
          </ul>
          <ul v-else class="game_options mode">
            <li
              class="option"
              v-for="option in gameOptions"
              :key="option.id"
            >
              <input
                class="option__input"
                type="radio"
                :id="option.id"
                name="selector"
                v-model="mode"
                :value="option.id"
                :checked="mode === option.id"
              >
              <label class="option__label" :for="option.id">
                <div class="check"></div>
                {{ option.name }}
                <InformationSvg />
                <v-tooltip activator="parent" max-width="300" location="top">
                  {{ option.description }}
                </v-tooltip>
              </label>
            </li>
          </ul>
          <p class="title">Population</p>
          <ul class="game_options">
            <li
              class="option"
              v-for="option in populationOptions"
              :key="option.id"
            >
              <input
                class="option__input"
                type="radio"
                :id="option.id"
                name="sort"
                v-model="sort"
                :value="option.value"
                :checked="sort === option.value"
              >
              <label class="option__label" :for="option.id">
                <div class="check"></div>
                <span class="mode_name">
                  {{ option.name }}
                </span>
              </label>
            </li>
          </ul>
          <div v-if="bot" class="buttons">
            <router-link
              :to="{ name: 'Bot', query: { mode, sort, by: 'name' }}"
              class="btn btn--small"
            >
              Name
            </router-link>
            <router-link
              :to="{ name: 'Bot', query: { mode, sort, by: 'flag' }}"
              class="btn btn--small"
            >
              Flag
            </router-link>
            <router-link
              :to="{ name: 'Bot', query: { mode, sort, by: 'capital' }}"
              class="btn btn--small"
            >
              Capital
            </router-link>
          </div>
          <div v-else class="buttons">
            <router-link
              :to="{ name: mode === 'hard' ? 'Hard' : 'Game', query: { sort } }"
              class="btn"
            >
              Name
            </router-link>
            <router-link
              :to="{ name: 'Flag', query: { mode, sort } }"
              class="btn"
            >
              Flag
            </router-link>
            <router-link
              :to="{ name: 'Capital', query: { mode, sort } }"
              class="btn"
            >
              Capital
            </router-link>
            <router-link
              :to="{ name: 'Area', query: { mode, sort } }"
              class="btn"
            >
              Area
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import InformationSvg from '@/components/InformationSvg.vue'
import { populationOptions } from '@/config'

export default {
  data() {
    return {
      mode: '',
      sort: '',
      gameOptions: [
        {
          id: 'normal',
          name: 'Normal',
          description: 'In Normal mode you have unlimited time on each country.'
        },
        {
          id: 'hard',
          name: 'Hard',
          description: 'In Hard mode you have only 15 seconds on each country. After 15 seconds you will lose 1 point.'
        }
      ],
      botOptions: [
        {
          id: 'easy',
          name: 'Easy',
          description: 'In Easy mode bot makes a lot of mistakes.'
        },
        {
          id: 'hard',
          name: 'Hard',
          description: 'In Hard mode bot makes not a lot of mistakes.'
        },
        {
          id: 'extreme',
          name: 'Extreme',
          description: 'In Extreme mode there are no borders between the countries'
        },
        {
          id: 'impossible',
          name: 'Impossible',
          description: 'In Impossible mode map is invisible, only hardcore.'
        }
      ],
      populationOptions
    }
  },

  props: {
    bot: {
      type: Boolean
    }
  },

  created() {
    this.mode = this.bot ? 'easy' : 'normal'
  },

  components: {
    InformationSvg
  }
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
    overflow-y: visible;
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
    padding-bottom: 30px;
    background: #fff;
    font-size: 24px;
  }
  .cancel {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  .cancel:hover {
    transform: scale(1.2);
  }
  .status {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }
  .status__img {
    margin-right: 5px;
  }
  .buttons {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .buttons > button,
  .buttons > a {
    margin-bottom: 10px;
    text-overflow: ellipsis;
  }
  .title {
    margin: 10px 0;
  }
  .mode li {
    flex-basis: 50%;
  }
</style>