import Vue from 'vue'
import VueResource from 'vue-resource'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import Notifications from 'vue-notification'
import VueAnalytics from 'vue-analytics'
import App from './App.vue'
import router from './router'
import { getCookie, compareRandom, randomColor } from '../utils'
import plugins from './plugins'

Vue.use(VueResource)
Vue.use(new VueSocketIO({
  connection: SocketIO(process.env.NODE_ENV === 'production' ? window.location.host : `${window.location.hostname}:5000`)
}))
Vue.use(Notifications)
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GA_ID,
  router
})
Vue.use(plugins)

Vue.router = router
Vue.config.productionTip = false

const checkMobile = () => {
  const WIDTH = 768
  const RATIO = 3
  const { body } = document

  if (!document.hidden) {
    const rect = body.getBoundingClientRect()
    return (rect.width - RATIO < WIDTH)
  }

  return true
}

Vue.prototype.getCookie = getCookie
Vue.prototype.compareRandom = compareRandom
Vue.prototype.randomColor = randomColor
Vue.prototype.isMobile = checkMobile()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
