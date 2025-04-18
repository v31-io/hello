import { createApp } from 'vue'
import VueKeycloak from '@dsb-norge/vue-keycloak-js'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

 app.use(VueKeycloak, {
  init: {
    onLoad: 'login-required',
    checkLoginIframe: false
  },
  config: {
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: 'default',
    clientId: 'hello-chat'
  },
  onInitError: (error) => console.error('Keycloak initialization error:', error),
  onReady: () => app.mount('#app')
})
app.use(pinia)  
app.use(vuetify)