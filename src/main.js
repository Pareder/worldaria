import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import VueFire from 'vuefire'
import VueSocketIO from 'vue-socket.io'
import Notifications from 'vue-notification'
import { getCookie, compareRandom, randomColor } from '../utils'
import plugins from './plugins'

Vue.use(VueFire)
Vue.use(VueResource)
Vue.use(VueSocketIO, process.env.PORT ? `0.0.0.0${process.env.PORT}` : '192.168.1.84:5000')
Vue.use(Notifications)
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

  return true;
}

Vue.prototype.getCookie = getCookie
Vue.prototype.compareRandom = compareRandom
Vue.prototype.randomColor = randomColor
Vue.prototype.isMobile = checkMobile()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
