import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    geojson: null,
    start: false
  },

  mutations: {
    SET_GEOJSON(state, payload) {
      state.geojson = [...payload]
    },

    SET_START(state) {
      state.start = true
    }
  },

  actions: {
    async getGeoJSON({ commit }, data) {
      const geojson = await Vue.$api.getGeoJSON(data)
      commit('SET_GEOJSON', geojson)
    }
  }
})

export default store