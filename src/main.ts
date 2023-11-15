import './assets/main.css'

import ToastPlugin from 'vue-toast-notification'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vue-toast-notification/dist/theme-bootstrap.css'
// import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const token = localStorage.getItem('leyyow_token')

import { aliases, mdi } from 'vuetify/iconsets/mdi'

if (token) {
  axios.defaults.headers.common['Authorization'] = `Token ${token}`
}

const vuetify = createVuetify({
  components,
  directives,
  ssr: true,
  theme: {
    themes: {
      light: {
        primary: '#3f51b5' // Change this to your desired color
      }
    }
  },

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(App).use(vuetify)

app.use(createPinia())
app.use(ToastPlugin)
app.use(router)
// app.use(vuetify)

app.mount('#app')
