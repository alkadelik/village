<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/auth'
import {
  ChartPieIcon,
  BookmarkIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { useAppStore } from '../stores/app'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
defineProps(['pageTitle', 'hasNavBtn', 'navBtnText', 'stateKey'])
const authStore = useAuthStore()
const appStore = useAppStore()
const route = useRoute()
const openDrawer = (key) => {
  appStore.drawerIsOpen = true
  appStore[key] = true
}

const currentRoute = ref(0)

onMounted(() => {
  console.log(route)
  switch (route.name) {
    case 'dashboard':
      currentRoute.value = 0
      break
    case 'find':
      currentRoute.value = 1
      break
    case 'inventory':
      currentRoute.value = 2
      break
    case 'sales':
      currentRoute.value = 3
      break
    case 'customers':
      currentRoute.value = 4
      break

    default:
      break
  }
})
</script>

<template>
  <div class="h-screen relative p-4 overflow-y-hidden">
    <div class="fixed bg-white top-0 left-0 w-full p-4 flex justify-between">
      <h2 class="font-bold text-xl text-secondary">{{ pageTitle }}</h2>
      <div class="w-6/12 gap-3 justify-end flex">
        <Button v-if="hasNavBtn" size="sm" @click="openDrawer(stateKey, stateKey2)"
          ><PlusIcon class="w-4 h-4"
        /></Button>
        <Button variant="destructive" size="sm" @click="authStore.logout()">Logout</Button>
      </div>
    </div>

    <div class="mt-6 h-screen">
      <slot></slot>
    </div>

    <!-- <v-bottom-navigation
      grow
      v-model="currentRoute"
      :bg-color="color"
      mode="shift"
      text-color="black"
    >
      <router-link to="/dashboard">
        <v-btn size="small">
          <ChartPieIcon class="w-6 h-6 mx-auto text-gray-400" />

          <span>Dashboard{{ currentRoute }}</span>
        </v-btn>
      </router-link>

      <router-link to="/find">
        <v-btn size="small">
          <MagnifyingGlassIcon class="w-6 h-6 mx-auto text-gray-400" />

          <span>Find</span>
        </v-btn>
      </router-link>

      <router-link to="/inventory">
        <v-btn size="small">
          <BookmarkIcon class="w-6 h-6 mx-auto text-gray-400" />

          <span>Inventory</span>
        </v-btn>
      </router-link>

      <router-link to="/sales">
        <v-btn size="small">
          <PresentationChartLineIcon class="w-6 h-6 mx-auto text-gray-400" />

          <span>Sales</span>
        </v-btn>
      </router-link>

      <router-link to="/customers">
        <v-btn>
          <UserGroupIcon class="w-6 h-6 mx-auto text-gray-400" />

          <span>Customer</span>
        </v-btn>
      </router-link>
    </v-bottom-navigation> -->
    <div class="fixed left-0 bottom-0 shadow-2xl h-20 w-full bg-white">
      <ul class="flex justify-between px-6 py-4 text-gray-400">
        <li @click="currentRoute = 0" :class="`${currentRoute == 0 ? 'active text-primary' : ''}`">
          <router-link to="/dashboard">
            <ChartPieIcon class="w-6 h-6 mx-auto " />
            <p class="text-center text-sm">Dashboard</p>
          </router-link>
        </li>
        <li @click="currentRoute = 1" :class="`${currentRoute == 1 ? 'active text-primary' : ''}`">
          <router-link to="/find">
            <MagnifyingGlassIcon class="w-6 h-6 mx-auto " />
            <p class="text-center text-sm">Find</p>
          </router-link>
        </li>
        <li @click="currentRoute = 2" :class="`${currentRoute == 2 ? 'active text-primary' : ''}`">
          <router-link to="/inventory">
            <BookmarkIcon class="w-6 h-6 mx-auto " />
            <p class="text-center text-sm">Inventory</p>
          </router-link>
        </li>
        <li @click="currentRoute = 3" :class="`${currentRoute == 3 ? 'active text-primary' : ''}`">
          <router-link to="/sales">
            <PresentationChartLineIcon class="w-6 h-6 mx-auto " />
            <p class="text-center text-sm">Sales</p>
          </router-link>
        </li>
        <li @click="currentRoute = 4" :class="`${currentRoute == 4 ? 'active text-primary' : ''}`">
          <router-link to="/customers">
            <UserGroupIcon class="w-6 h-6 mx-auto " />
            <p class="text-center text-sm">Customer</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>