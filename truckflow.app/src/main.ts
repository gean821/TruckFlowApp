import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useAuthStore } from './stores/AuthStore'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(vuetify);
app.use(VueQueryPlugin)
app.use(createPinia())

const authStore = useAuthStore();
authStore.restoreSession();

app.use(router)

app.mount('#app')
