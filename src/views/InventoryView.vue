<script setup>
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/auth'
import { ChartPieIcon, BookmarkIcon, PresentationChartLineIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
</script>

<template>
  <div class="relative p-4">
    <div class="flex justify-between">
      <h2 class="font-bold text-xl text-secondary">Inventory</h2>
      <Button variant="destructive" size="sm" @click="authStore.logout()">Logout</Button>
    </div>
    <div class="h-screen flex justify-center items-center">
      <div class="text-center w-8/12">
        <img
          src="../assets/images/product-skeleton.png"
          class="w-32 mx-auto"
          alt="product skeleton icon"
        />
        <h3 class="text-xl font-bold">No Products Added</h3>
        <p class="font-light my-3">Add products to your store so you can take orders easily.</p>
        <Button class="my-4 w-10/12" size="lg">Add Product</Button>
      </div>
    </div>

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
