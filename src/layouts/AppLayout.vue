<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/auth'
import {
  ChartPieIcon,
  BookmarkIcon,
  PresentationChartLineIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
</script>

<template>
    <div class="relative p-4">
    <div class="flex justify-between">
      <h2 class="font-bold text-xl text-secondary">Inventory</h2>
      <Button variant="destructive" size="sm" @click="authStore.logout()">Logout</Button>
    </div>
    
    <slot></slot>

    <div class="fixed left-0 bottom-0 shadow-2xl h-20 w-full">
      <ul class="flex justify-between px-6 py-4 text-gray-400">
        <li>
          <ChartPieIcon class="w-8 h-8 mx-auto text-gray-400" />
          <span>Dashboard</span>
        </li>
        <li>
          <BookmarkIcon class="w-8 h-8 mx-auto text-gray-400" />
          <span>Inventory</span>
        </li>
        <li>
          <PresentationChartLineIcon class="w-8 h-8 mx-auto text-gray-400" />
          <span>Sales</span>
        </li>
        <li>
          <UserGroupIcon class="w-8 h-8 mx-auto text-gray-400" />
          <span>Customer</span>
        </li>
      </ul>
    </div>
  </div>
</template>
