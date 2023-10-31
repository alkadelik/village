import './assets/main.css'

import ToastPlugin from 'vue-toast-notification';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vue-toast-notification/dist/theme-bootstrap.css';

import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios';

const token = localStorage.getItem("leyyow_token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;
}

const app = createApp(App)

app.use(createPinia())
app.use(ToastPlugin);
app.use(router)

app.mount('#app')
