// store/auth.js

import router from '@/router'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { apiLogin, signUp, createStore } from '@/services/apiServices'

import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'

export const useAuthStore = defineStore('auth', () => {
  const $toast = useToast()
  const router = useRouter()
  const localStorageState = JSON.parse(localStorage.getItem('leyyow') || '{}')
  //console.log(localStorageState)

  const state = ref(localStorageState)

  //console.log(state.value)

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
        state.value.customers = res.data.customers
        state.value.inventory = res.data.inventory

        if (store.verified[0] == 0) {
          state.value.email_verified = false
        }
        localStorage.setItem('leyyow', JSON.stringify(state.value))

        $toast.success('Logged in successfully')
      })
      .catch(() => {
        $toast.error('Wrong or invalid credentials, or other error. Please try again')
      })
      .finally(() => {
        router.push('/dashboard')
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
  function register(values: {
    username?: string
    password?: string
    business_type?: string
    store_name?: string
    store_slug?: string
  }) {
    const data = {
      email: values.username,
      password: values.password
    }
    signUp(data)
      .then((res) => {
        localStorage.setItem('leyyow_token', res.data.token)
        axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`

        state.value.loggedIn = true

        localStorage.setItem('leyyow', JSON.stringify(state.value))

        const d2 = {
          store_name: values.store_name,
          slug: values.store_slug,
          business_type: values.business_type
        }
        createStore(d2).then((res) => {
          state.value.inventory = []
          state.value.productTemplates = []
          state.value.store = res.data.store

          router.push('/dashboard')
        })
      })
      .catch(() => {
        $toast.error('Wrong or invalid credentials, or other error. Please try again')
      })
      .finally(() => {
        // state.value.loading = false
      })
  }
  function logout() {
    state.value.loggedIn = false
    localStorage.removeItem('leyyow_token')
    // maybe reset state?

    router.push('/login')
  }
  return { state, login, logout, register }
})

// const myStore = useAuthStore();
// loadStateFromLocalStorage(myStore);
