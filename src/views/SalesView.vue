<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import { fetchOrders } from '@/services/apiServices'
import AppLayout from '@/layouts/AppLayout.vue'
import AddSaleView from '@/components/AddSaleView.vue'
import AddProductView from '@/components/AddProductView.vue'
import OrderCard from '@/components/OrderCard.vue'
import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const showAddProductView = () => {
  appStore.drawerIsOpen = true
  appStore.showAddSaleView = true
}

onMounted(() => {
  fetchOrders() // do this in orders in orders, maybe?
    .then((res) => {
      console.log(res.data, ' f')
      authStore.state.orders = res.data
      authStore.state.has_sale = authStore.state.orders.length > 0
    })
})

const customers = ref(authStore.state?.customers)

const computedOrdersWithCustomer = computed(() => {
  console.log(authStore.state.orders, customers.value)
  let res = authStore.state.orders.filter(order => customers.value.find(customer => customer.id == order.customer))

  return res
})
</script>

<template>
  <AppLayout class="relative p-4" pageTitle="Sales" stateKey="showAddSaleView" navBtnText="add Sale" :hasNavBtn="true">
    <div v-if="!computedOrdersWithCustomer?.length" class="flex justify-center items-center h-full">
      <div class="text-center w-8/12">
        <img src="../assets/images/product-skeleton.png" class="w-32 mx-auto" alt="product skeleton icon" />
        <h3 class="text-xl font-bold">No Sales Added</h3>
        <p class="font-light my-3">Add sales to your store so you can take orders easily.</p>
        <Button class="my-4 w-10/12" size="lg" @click="showAddProductView">Add Sale</Button>
      </div>
    </div>

    <div v-else class="h-screen overflow-y-scroll pb-56">
      <div v-for="(item, i) in computedOrdersWithCustomer" :key="item.key">
        <!-- .find(customer => customer.id === item.customer ) -->
        <OrderCard :customer="customers.find(customer => customer.id === item.customer)" :order="item"
          :index="i" />
      </div>
    </div>

    <AddSaleView v-if="appStore.showAddSaleView" />
  </AppLayout>
</template>
