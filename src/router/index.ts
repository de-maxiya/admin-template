import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import routes from './routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  // if (to.meta.title) {
  //   document.title = to.meta.title as string
  // }
  nextTick(() => {
    next()
  })
})

export default router
