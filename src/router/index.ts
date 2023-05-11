import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/const/router.const';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: RouteName.LOGIN,
      component: () => import('@/views/LoginPage.vue')
    }
  ]
})

export default router
