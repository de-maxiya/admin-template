import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useLoginStore } from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 全局前置守卫
router.beforeEach((to, from) => {
  const loginStore = useLoginStore()

  // if (to.meta.title) {
  //   document.title = to.meta.title
  // }

  if (!loginStore.count && to.name !== 'login') {
    return { name: 'login' }
  }

  if (loginStore.count && to.name === 'login') {
    return { name: 'home' }
  }
  return true
})

export default router
