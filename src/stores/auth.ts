// store/auth.js

import router from '@/router'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { apiLogin } from '@/services/apiServices'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toast-notification'

export const useAuthStore = defineStore('auth', () => {
  const $toast = useToast()
  const router = useRouter()
  const localStorageState = JSON.parse(localStorage.getItem('leyyow') || '').state
  console.log(localStorageState)
  const state = computed(() => ({
    isAuthenticated: Boolean(localStorage.getItem('isAuthenticated')),
    loggedIn:
      localStorage.getItem('leyyow_token') == null
        ? false
        : Boolean(localStorage.getItem('leyyow_token')),
    store: {},
    store_slug: '',
    account_id: '',
    custormers: [],
    has_customer: false,
    inventory: [],
    has_product: false,
    email_verified: false,
    loading: false,
    ...localStorageState
  }))

  function login(values: { username?: string; password?: string }) {
    apiLogin(values)
      .then((res) => {
        localStorage.setItem('leyyow_token', res.data.token)
        axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`

        const store = res.data.store
        store.slug = res.data.slug

        state.value.loggedIn = true
        state.value.store = store
        state.value.store_slug = res.data.slug
        state.value.account_id = res.data.account_id
        state.value.custormers = res.data.customers
        state.value.inventory = res.data.inventory

        if (store.verified[0] == 0) {
          state.value.email_verified = false
        }

        router.push('/inventory')

        $toast.success('Logged in successfully')
      })
      .catch(() => {
        $toast.error('Wrong or invalid credentials, or other error. Please try again')
      })
      .finally(() => {
        state.value.loading = false
      })

    // Perform your login logic, e.g., validate user credentials.
    //   if (email === 'user@example.com' && password === 'password') {
    //     this.isAuthenticated = true;
    //     localStorage.setItem('isAuthenticated', 'true');
    //   } else {
    //     this.isAuthenticated = false;
    //   }
  }
  function logout() {
    state.value.loggedIn = false
    localStorage.removeItem('leyyow_token')
    // maybe reset state?

    router.push('/login')
  }
  return { state, login, logout }
})

// const myStore = useAuthStore();
// loadStateFromLocalStorage(myStore);
