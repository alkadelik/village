<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
 const emit = defineEmits(['close'])
const props = defineProps(['step', 'reduceStep', 'stateKey', 'showAddCustomerButton'])

const closeDrawer = () => {
  if (appStore.showNestedAddCustomerView) {
    appStore.showNestedAddCustomerView = false
  } else {
    if (props.step == 0 || !props.step) {
      appStore.drawerIsOpen = false

      if (props.stateKey) {
        emit('close')
        setTimeout(() => {
          appStore[props.stateKey] = false
        }, 300)
      }
    } else {
      props.reduceStep()
    }
  }
}

const openDrawer = (key) => {
  appStore[key] = true
}
</script>

<template>
  <transition name="drawer-slide" mode="out-in">
    <div
      v-if="appStore.drawerIsOpen"
      class="overflow-y-hidden absolute top-0 z-50 left-0 h-full w-full bg-white"
    >
      <div class="flex justify-between w-full items-center px-2">
        <Button @click="closeDrawer" variant="link" class="inline-flex justify-center"
          ><ChevronLeftIcon class="w-6 h-6 text-black"
        /></Button>
        <Button v-if="showAddCustomerButton" class="" size="sm" @click="openDrawer(stateKey)"
          ><PlusIcon class="w-4 h-4"
        /></Button>
      </div>

      <slot></slot>
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
