<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/auth'
import {
  ChartPieIcon,
  BookmarkIcon,
  PresentationChartLineIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
defineProps(['pageTitle'])
const authStore = useAuthStore()
</script>

<template>
  <div class="relative p-4">
    <div class="flex justify-between">
      <h2 class="font-bold text-xl text-secondary">{{ pageTitle }}</h2>
      <Button variant="destructive" size="sm" @click="authStore.logout()">Logout</Button>
    </div>

    <slot></slot>

    <div class="fixed left-0 bottom-0 shadow-2xl h-20 w-full">
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
