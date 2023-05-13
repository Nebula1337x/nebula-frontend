import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/const/router.const'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: RouteName.Login,
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/forget-password',
      name: RouteName.ForgetPassword,
      component: () => import('@/views/ResetPasswordPage.vue')
    },
    {
      path: '/register',
      name: RouteName.Register,
      component: () => import('@/views/RegisterPage.vue')
    }
  ]
})

export default router
