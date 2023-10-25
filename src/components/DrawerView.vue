<script setup>

import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { Button } from '@/components/ui/button'

import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const closeDrawer = () => {
  appStore.drawerIsOpen = false
}
</script>

<template>
 <transition name="drawer-slide" mode="out-in" >
    <div v-if="appStore.drawerIsOpen"  class="fixed top-0 z-20 left-0 h-screen w-full bg-white overflow-y-scroll ">
        <Button @click="closeDrawer" variant="link" class="inline-flex justify-center"><ChevronLeftIcon class="w-6 h-6 text-black" /></Button>
        <slot></slot>
        <div class="h-32"></div>
    </div>
 </transition>
</template>

<style scoped>
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 300ms ease-in-out;
}

.drawer-slide-enter,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.drawer-slide-enter {
  transform: translateX(0);
}

.drawer-slide-leave {
  transform: translateX(0);
}
</style>