<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/auth'
import {
  ChartPieIcon,
  BookmarkIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { useAppStore } from '../stores/app'
defineProps(['pageTitle', 'hasNavBtn', 'navBtnText', 'stateKey', ])
const authStore = useAuthStore()
const appStore = useAppStore()

const openDrawer = (key) => {
  appStore.drawerIsOpen = true
  appStore[key] = true
}
</script>

<template>
  <div class=" h-screen relative p-4 overflow-y-hidden">
    <div class="fixed top-0 left-0 w-full p-4 flex justify-between ">
      <h2 class="font-bold text-xl text-secondary">{{ pageTitle }}</h2>
      <div class="w-6/12 gap-3 justify-end flex">
        <Button v-if="hasNavBtn" size="sm" @click="openDrawer(stateKey, stateKey2)"><PlusIcon class="w-4 h-4" /></Button>
        <Button variant="destructive" size="sm" @click="authStore.logout()">Logout</Button>
      </div>
    </div>

<div class="mt-6 h-5/6 overflow-y-scroll flex justify-center items-center">
    <slot></slot>

</div>

    <div class="fixed left-0 bottom-0 shadow-2xl h-20 w-full bg-white">
      <ul class="flex justify-between px-6 py-4 text-gray-400">
        <li>
          <router-link to="/dashboard">
            <ChartPieIcon class="w-6 h-6 mx-auto text-gray-400" />
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/inventory">
            <BookmarkIcon class="w-6 h-6 mx-auto text-gray-400" />
            <span>Inventory</span>
          </router-link>
        </li>
        <li>
          <router-link to="/sales">
            <PresentationChartLineIcon class="w-6 h-6 mx-auto text-gray-400" />
            <span>Sales</span>
          </router-link>
        </li>
        <li>
          <router-link to="/customers">
            <UserGroupIcon class="w-6 h-6 mx-auto text-gray-400" />
            <span>Customer</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
