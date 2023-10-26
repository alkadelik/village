<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import {
  ChartPieIcon,
  BookmarkIcon,
  PresentationChartLineIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/layouts/AppLayout.vue'
import AddProductView from '@/components/AddProductView.vue'
import { ref } from 'vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const showAddProductView = () => {
  appStore.drawerIsOpen = true
}
</script>

<template>
  <AppLayout class="relative p-4">
    <div class="h-screen flex justify-center items-center">
      <div class="text-center w-8/12">
        <img
          src="../assets/images/product-skeleton.png"
          class="w-32 mx-auto"
          alt="product skeleton icon"
        />
        <h3 class="text-xl font-bold">No Products Added</h3>
        <p class="font-light my-3">Add products to your store so you can take orders easily.</p>
        <Button class="my-4 w-10/12" size="lg" @click="showAddProductView">Add Product</Button>
      </div>
    </div>

    <AddProductView />
  </AppLayout>
</template>
