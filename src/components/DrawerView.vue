<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { Button } from '@/components/ui/button'

import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const props = defineProps(['step', 'reduceStep'])

const closeDrawer = () => {
  if (props.step == 0) {
    appStore.drawerIsOpen = false
  }else {
    props.reduceStep()
  }
}
</script>

<template>
  <transition name="drawer-slide" mode="out-in">
    <div
      v-if="appStore.drawerIsOpen"
      class="overflow-y-hidden absolute top-0 z-50 left-0 h-full w-full bg-white"
    >
      <Button @click="closeDrawer" variant="link" class="inline-flex justify-center"
        ><ChevronLeftIcon class="w-6 h-6 text-black"
      /></Button>
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
