import Layout from '@/layout/index.vue'
const routes = [
  {
    path: '/',
    name: 'all',
    meta: { title: '', icon: 'home', allAccess: true },
    component: Layout,
    children: [
      {
        path: '/',
        name: 'home',
        meta: { title: '首页', icon: 'home', allAccess: true },
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },

  {
    path: '/shop',
    name: 'shopList',
    meta: { title: '', icon: 'home', allAccess: true },
    component: Layout,
    children: [
      {
        path: '/shop',
        name: 'shop',
        meta: { title: '商品管理', icon: 'home', allAccess: true },
        component: () => import('@/views/shop/index.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {},
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errPage/404.vue'),
    meta: {},
    hidden: true,
  },
  {
    path: '/401',
    name: 'error_401',
    hidden: true,
    meta: {},
    component: () => import('@/views/errPage/401.vue'),
  },
  {
    path: '/500',
    name: 'error_500',
    hidden: true,
    meta: {},
    component: () => import('@/views/errPage/500.vue'),
  },
]

export default routes
