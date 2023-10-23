// store/auth.js

import router from '@/router';
import { defineStore } from 'pinia';
import { useRoute, useRouter } from 'vue-router';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: Boolean(localStorage.getItem('isAuthenticated')),
  }),
  actions: {
    login() {
        this.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', 'true');
        
        router.push('/inventory')
      // Perform your login logic, e.g., validate user credentials.
    //   if (email === 'user@example.com' && password === 'password') {
    //     this.isAuthenticated = true;
    //     localStorage.setItem('isAuthenticated', 'true');
    //   } else {
    //     this.isAuthenticated = false;
    //   }
    },
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated');
      router.push('/login')

    },
  },
});
