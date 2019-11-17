import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import VueFire from 'vuefire'
import VueSocketio from 'vue-socket.io'

Vue.use(VueFire)
Vue.use(VueResource)
Vue.use(VueSocketio, process.env.PORT ? `0.0.0.0${process.env.PORT}` : '192.168.88.4:5000')

Vue.router = router
Vue.config.productionTip = false

const handler = () => {
  const WIDTH = 768
  const RATIO = 3
  const { body } = document
  if (!document.hidden) {
    const rect = body.getBoundingClientRect()
    return (rect.width - RATIO < WIDTH)
  }
}

Vue.prototype.getCookie = (name) => {
  let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"))
  return matches ? decodeURIComponent(matches[1]) : undefined
}
Vue.prototype.compareRandom = () => {
  return Math.random() - 0.5
}
Vue.prototype.randomColor = () => {
  return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
}
Vue.prototype.isMobile = handler()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

const publicVapidKey = 'BPdU-iybDRh1u5rJq4ZnxWeG-8znxECUucI89lhNOurf31cl11t1Adv13vkj-34YUgjeqYyKR-HdeKzIqb2kBVs'

const makeServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    run().catch(error => console.error(error))
  }
}

async function run() {
  try {
    const registration = await navigator.serviceWorker.
      register('/sw.js', {scope: '/'})
    const subscription = await registration.pushManager.
      subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })
    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json'
      }
    })
  } catch (e) {
    console.log(e)
  }
}

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

makeServiceWorker()