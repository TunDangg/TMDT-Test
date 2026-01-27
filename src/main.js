import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // thư viện quản lý lưu dữ liệu
import App from './App.vue'
import router from './router'

const app = createApp(App)

// gọi pinia trước vì cần đảm bảo dữ liệu để gọi
app.use(createPinia()) 
app.use(router)

app.mount('#app')