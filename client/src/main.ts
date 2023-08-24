import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import Notifications from '@kyvg/vue3-notification'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
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

const vuetify = createVuetify({
  components,
  directives,
})
app.use(vuetify)

app.mount('#app')
