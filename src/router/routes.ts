import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    name: 'all',
    meta: { title: '首页', icon: 'home', allAccess: true },
    component: Layout,
    children: [
      {
        path: '', // 空路径，继承父路由的路径
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },

  {
    path: '/data',
    name: 'dataList',
    meta: { title: '数据管理', icon: 'data' }, // 修正 title
    component: Layout,
    children: [
      {
        path: 'list', // 移除开头的斜杠，使用相对路径
        name: 'list',
        meta: { title: '数据列表', icon: 'list' },
        component: () => import('@/views/list/index.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
  },

  {
    path: '/:pathMatch(.*)*', // 通配符路由，捕获所有未匹配的路径
    redirect: '/404',
    hidden: true,
  },

  // 错误页面（可选，已通过通配符路由处理）
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errPage/404.vue'),
    hidden: true,
  },
]

export default routes
