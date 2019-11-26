import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import VueFire from 'vuefire'
import VueSocketIO from 'vue-socket.io'

Vue.use(VueFire)
Vue.use(VueResource)
Vue.use(VueSocketIO, process.env.PORT ? `0.0.0.0${process.env.PORT}` : '192.168.88.4:5000')

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
const getRandomNumber = range => {
  return Math.floor(Math.random() * range)
}

Vue.prototype.getCookie = name => {
  let matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)")
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}
Vue.prototype.compareRandom = () => {
  return Math.random() - 0.5
}
Vue.prototype.randomColor = () => {
  return `rgb(${getRandomNumber(255)},${getRandomNumber(255)},${getRandomNumber(255)})`
}
Vue.prototype.isMobile = checkMobile()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
