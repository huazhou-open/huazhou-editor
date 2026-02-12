import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue'),
    redirect: '/settings/models',
    children: [
      {
        path: 'models',
        name: 'ModelManagement',
        component: () => import('@/components/settings/ModelManagement.vue')
      },
      {
        path: 'basic',
        name: 'BasicConfig',
        component: () => import('@/components/settings/BasicConfig.vue')
      },
      {
        path: 'appearance',
        name: 'AppearanceConfig',
        component: () => import('@/components/settings/AppearanceConfig.vue')
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
