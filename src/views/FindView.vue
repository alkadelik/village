<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon, PhoneIcon } from '@heroicons/vue/24/outline'
import { search } from '@/services/apiServices'
import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import ViewSearchDetails from '@/components/ViewSearchDetails.vue'
import { UserIcon, MapPinIcon } from '@heroicons/vue/24/outline'

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

      <div class="mt-8 overflow-y-scroll h-screen pb-64 px-2">
        <p v-if="!merchants.length" class="text-center">Search for a product</p>
        <div v-else>
          <p class="text-center">Search results for: {{ searchField }}</p>

          <div
            v-for="product in merchants"
            :key="product.store_id"
            class="shadow-md border rounded-md p-4 my-2"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <UserIcon class="w-6 h-6" />
                <p class="font-bold">{{ product.store_id }}</p>
                <button
                @click="makeCall(product.store__phone1)"
                  class="rounded-full px-3 py-0.5 text-sm bg-primary bg-opacity-30 text-white flex gap-2 items-center"
                >
                  <PhoneIcon class="w-4 h-4" />Call
                </button>
              </div>

              <span
                class="bg-green-400 bg-opacity-30 text-primary py-1 px-3 rounded-full text-sm"
                @click="showAddProductView()"
                >{{ products.length }} in stock</span
              >
            </div>
            <div class="flex justify-between items-center py-4 gap-2 text-sm text-gray-600">
              <MapPinIcon class="w-6 h-6" />
              <p>No 29 Obafemi Awolowo way, Ikeja 101233, lagos</p>
              <!-- <p @click="() => makeCall(product.store__phone1)">{{ product.store__phone1 }}</p>

              <p class="flex gap-2 items-center"><span>Call</span></p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <ViewSearchDetails v-if="appStore.showViewSearchDetails" :products="products" />
  </AppLayout>
</template>

<style></style>
