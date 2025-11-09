import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { initToast } from '@/utils/toast'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 初始化Toast
initToast()

app.mount('#app')
