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
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue')
    },
    {
      path: '/inventory/:id',
      name: 'product-details',
      component: () => import('../views/ProductDetails.vue')
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView.vue')
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/CustomersView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/find',
      name: 'find',
      component: () => import('../views/FindView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPassword.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'ErrorView',
      component: () => import('../components/ErrorView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const authRoutes = ['login', 'signup', 'forgot-password']
  setTimeout(() => {
    //console.log(authStore.state.state)
  }, 5000)
  if (!authStore.state) return
  if (
    (!authStore.state.loggedIn && !authRoutes.includes(to.name)) ||
    // ❗️ Avoid an infinite redirect
    to.name == 'home'
  ) {
    // redirect the user to the login page
    return { name: 'login' }
  }

  if (authStore.state.loggedIn && to.name == 'login') {
    return { name: 'inventory' }
  }
})

export default router
