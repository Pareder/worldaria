import API from '../api'

export default {
  install(Vue) {
    Vue.prototype.$api = API.create()
  }
}