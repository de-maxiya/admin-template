import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcon from '@element-plus/icons'
import App from './App.vue'
import router from './router'
import axios from './utils/axios'
const app = createApp(App)

for (const [key, value] of Object.entries(ElIcon)) {
  app.component(key, value)
}
// 将axios实例挂载到Vue的全局属性上
app.provide('axiosInstance', axios)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
