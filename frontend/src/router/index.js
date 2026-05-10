import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/analyze',
    name: 'AnalysisConfig',
    component: () => import('../views/AnalysisConfig.vue'),
  },
  {
    path: '/result/:taskId',
    name: 'AnalysisResult',
    component: () => import('../views/AnalysisResult.vue'),
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/HistoryPage.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsPage.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
