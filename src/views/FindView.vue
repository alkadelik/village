<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon, PhoneIcon } from '@heroicons/vue/24/outline'
import { search } from '@/services/apiServices'
import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import ViewSearchDetails from '@/components/ViewSearchDetails.vue'

function debounce(fn, wait) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer) // clear any pre-existing timer
    }
    const context = this // get the current context
    timer = setTimeout(() => {
      fn.apply(context, args) // call the function if time expires
    }, wait)
  }
}

const searchField = ref('')
const products = ref([])
const merchants = ref([])

const appStore = useAppStore()

const handleChange = async (e) => {
  if (e.target.value) {
    searchField.value = e.target.value
    search(e.target.value).then((res) => {
      console.log(res.data['Products: '])
      products.value = res.data['Products: '] || []
      merchants.value = res.data.Merchants || []
    })
  } else {
    products.value = []
    merchants.value = []
  }
}

function makeCall(phoneNumber) {
  // Replace the phone number with the desired numbe

  // Use the tel protocol to initiate the call
  window.location.href = 'tel:' + phoneNumber
}

const showAddProductView = () => {
  appStore.drawerIsOpen = true
  appStore.showViewSearchDetails = true
}
</script>

<template>
  <AppLayout class="relative p-4" pageTitle="Find">
    <div class="pt-">
      <Input
        id="username"
        type="text"
        placeholder="What are you looking for"
        hasPrefix
        class="mt-3 mb-4"
        v-model="searchField"
        :handleInput="debounce((e) => handleChange(e), 500)"
      >
        <MagnifyingGlassIcon class="icon w-6 h-6 absolute top-2 left-2" />
      </Input>

      <div class="mt-8 overflow-y-scroll h-screen pb-64">
        <p v-if="!merchants.length" class="text-center">Search for a product</p>
        <div v-else>
          <p class="text-center">Search results for: {{ searchField }}</p>

          <div
            v-for="product in merchants"
            :key="product.store_id"
            class="border rounded-md p-4 my-2"
          >
            <div class="flex justify-between items-center">
              <p class="font-bold">{{ product.store_id }}</p>

              <span class="border py-1 px-3 rounded-md" @click="showAddProductView()">{{ products.length }}</span>
            </div>
            <div class="flex justify-between items-center py-4">
              <p @click="() => makeCall(product.store__phone1)">{{ product.store__phone1 }}</p>

              <p class="flex gap-2 items-center"><span>Call</span> <PhoneIcon class="w-4 h-4" /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ViewSearchDetails v-if="appStore.showViewSearchDetails" :products="products"/>

  </AppLayout>
</template>

<style></style>
