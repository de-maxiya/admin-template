import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcon from '@element-plus/icons'
import App from './App.vue'
import router from './router'
const app = createApp(App)

for (const [key, value] of Object.entries(ElIcon)) {
  app.component(key, value)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
