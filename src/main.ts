import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const toastOptions = {
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
}

app.use(createPinia())
app.use(router)

app.use(Toast, toastOptions)

app.mount('#app')
