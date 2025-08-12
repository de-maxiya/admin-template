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

  // 关键：用token是否存在判断登录状态（而非count）
  const isLogin = !!loginStore.token // 假设store中用`token`存储令牌

  // 未登录且目标不是登录页 → 强制跳转登录
  if (!isLogin && to.name !== 'login') {
    return { name: 'login' }
  }

  // 已登录且目标是登录页 → 强制跳转首页
  if (isLogin && to.name === 'login') {
    return { name: 'home' }
  }

  return true
})

export default router
