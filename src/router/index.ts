import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  if (
    // make sure the user is authenticated
    !authStore.state.loggedIn &&
    // ❗️ Avoid an infinite redirect
(    to.name !== 'login')
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  }
  
  if (authStore.state.loggedIn && to.name == 'login') {
    return { name: 'inventory' }
  }
})

export default router
