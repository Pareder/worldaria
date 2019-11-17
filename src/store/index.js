import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    geojson: null,
    start: false
  },

  mutations: {
    SET_GEOJSON (state, payload) {
      state.geojson = [...payload]
    },
    SET_START (state) {
      state.start = true
    }
  },

  actions: {
    getGeojson ({ commit }, data) {
      return new Promise((resolve, reject) => {
        Vue.http.get(`../json/${data}.json`)
          .then(response => {
            commit('SET_GEOJSON', response.body.features)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
})

export default store