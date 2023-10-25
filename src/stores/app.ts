// store/auth.js

import router from '@/router';
import { defineStore } from 'pinia';
import { useRoute, useRouter } from 'vue-router';


export const useAppStore = defineStore('auth', {
  state: () => ({
    drawerIsOpen: false,
  }),

});
