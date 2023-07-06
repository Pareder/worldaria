import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import Notifications from '@kyvg/vue3-notification'
import 'leaflet/dist/leaflet.css'

import './assets/css/style.css'
import App from './App.vue'
import router from './router'
import isMobile from './utils/checkMobile'

const app = createApp(App)
app.config.globalProperties.isMobile = isMobile()

app.use(router)
app.use(VueGtag, {
  config: { id: import.meta.env.VITE_APP_GA_ID }
}, router)
app.use(Notifications)

app.mount('#app')
