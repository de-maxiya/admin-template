import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    name: 'all',
    meta: { title: '首页', icon: 'HomeFilled', allAccess: true },
    component: Layout,
    type: 'item', // 标识为菜单项
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
    meta: { title: '数据管理', icon: 'FolderChecked' }, // 修正 title
    type: 'submenu',
    component: Layout,
    children: [
      {
        path: 'list', // 移除开头的斜杠，使用相对路径
        name: 'list',
        meta: { title: '计算退休', icon: 'DataLine' },
        component: () => import('@/views/dataList/list/index.vue'),
      },
      {
        path: 'import', // 移除开头的斜杠，使用相对路径
        name: 'import',
        meta: { title: '计算gdp增速', icon: 'DataAnalysis' },
        component: () => import('@/views/dataList/import/index.vue'),
      },
      {
        path: 'export', // 移除开头的斜杠，使用相对路径
        name: 'export',
        meta: { title: '计算个人养老金', icon: 'FolderOpened' },
        component: () => import('@/views/dataList/old/index.vue'),
      },
    ],
  },
  {
    path: '/user',
    name: 'userAll',
    type: 'submenu',
    meta: { title: '用户管理', icon: 'UserFilled' }, // 修正 title
    component: Layout,
    children: [
      {
        path: 'list', // 移除开头的斜杠，使用相对路径
        name: 'userList',
        meta: { title: '用户列表', icon: 'User' },
        component: () => import('@/views/userAll/user/index.vue'),
      },
      {
        path: 'role', // 移除开头的斜杠，使用相对路径
        name: 'role',
        meta: { title: '角色管理', icon: 'Avatar' },
        component: () => import('@/views/userAll/role/index.vue'),
      },
      {
        path: 'permission', // 移除开头的斜杠，使用相对路径
        name: 'permission',
        meta: { title: '权限配置', icon: 'Monitor' },
        component: () => import('@/views/dataList/list/index.vue'),
      },
    ],
  },
  {
    path: '/system',
    name: 'systemList',
    type: 'submenu',
    meta: { title: '系统设置', icon: 'Setting' }, // 修正 title
    component: Layout,
    children: [
      {
        path: 'settings', // 移除开头的斜杠，使用相对路径
        name: 'settings',
        meta: { title: '基本设置', icon: 'Notification' },
        component: () => import('@/views/dataList/list/index.vue'),
      },
      {
        path: 'logs', // 移除开头的斜杠，使用相对路径
        name: 'logs',
        meta: { title: '操作日志', icon: 'Document' },
        component: () => import('@/views/dataList/list/index.vue'),
      },
      {
        path: 'backup', // 移除开头的斜杠，使用相对路径
        name: 'backup',
        meta: { title: '数据备份', icon: 'PieChart' },
        component: () => import('@/views/dataList/list/index.vue'),
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
