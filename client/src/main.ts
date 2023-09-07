import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import Notifications from '@kyvg/vue3-notification'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable } from 'vuetify/labs/VDataTable'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'leaflet/dist/leaflet.css'

import './assets/css/style.css'
import App from './App.vue'
import router from './router'
import compareRandom from './utils/compareRandom'
import isMobile from './utils/checkMobile'

const app = createApp(App)
app.config.globalProperties.isMobile = isMobile()
app.config.globalProperties.compareRandom = compareRandom

app.use(router)
app.use(VueGtag, {
  config: { id: import.meta.env.VITE_APP_GA_ID }
}, router)
app.use(Notifications)

const vuetify = createVuetify({
  theme: {
    themes: {
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          tertiary: '#E57373',
          accent: '#FF4081',
          quarternary: '#B0D1E8',
          'surface-bright': '#474747',
        },
      },
    },
    defaultTheme: 'dark',
  },
  components: {
    ...components,
    VDataTable,
  },
  directives,
})
app.use(vuetify)

app.mount('#app')
