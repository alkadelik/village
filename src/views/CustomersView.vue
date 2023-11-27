<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import {
  ChartPieIcon,
  BookmarkIcon,
  PresentationChartLineIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/layouts/AppLayout.vue'
import AddCustomerView from '@/components/AddCustomerView.vue'
import EditCustomerView from '@/components/EditCustomerView.vue'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const searchText = ref('')

const filteredCustomers = computed(() => {
  return !searchText.value
    ? authStore.state.customers
    : authStore.state.customers.filter((item) =>
        `${item.first_name} ${item.last_name} ${item.email} ${item.phone}`
          .toLowerCase()
          .includes(searchText.value)
      )
})

const showAddProductView = () => {
  appStore.drawerIsOpen = true
  appStore.showAddCustomerView = true
}

const showEditProductView = () => {
  appStore.drawerIsOpen = true
  appStore.showEditCustomerView = true
}

const customer_id = ref(0)
const customerToEdit = ref({})

const selectFunction = (id, customer) => {
  customerToEdit.value = customer
  showEditProductView()
}
</script>

<template>
  <AppLayout
    class="relative p-4"
    pageTitle="Customers"
    stateKey="showAddCustomerView"
    navBtnText="add Customer"
    :hasNavBtn="true"
  >
    <div v-if="!authStore.state.customers.length" class="h-full flex justify-center items-center">
      <div class="text-center w-8/12">
        <img
          src="../assets/images/product-skeleton.png"
          class="w-32 mx-auto"
          alt="product skeleton icon"
        />
        <h3 class="text-xl font-bold">No Customers Added</h3>
        <p class="font-light my-3">Add customers to your store so you can take orders easily.</p>
        <Button class="my-4 w-10/12" size="lg" @click="showAddProductView">Add Customer</Button>
      </div>
    </div>

    <div v-else class="p-2">
      <Input class="w-full" v-model="searchText" placeholder="Type customer name to search" />
      <p v-if="!filteredCustomers.length" class="mt-8">no customers found</p>
      <div
        v-else
        class="select-customer-wrapper"
        v-for="(customer, i) in filteredCustomers"
        :key="i"
        @click="selectFunction(customer.id, customer)"
      >
        <div class="list_style_1 my-4" :class="{ active: customer_id == customer.id }">
          <div style="display: flex">
            <div class="customer_img">
              <img src="@/assets/images/icons/select-customer-author-icon.svg" alt="" />
            </div>
            <h3>{{ customer.first_name }} {{ customer.last_name }}</h3>
          </div>
          <div class="customer_details font-light">
            <p class="black">
              {{ customer.house_no }} {{ customer.line1 }} {{ customer.line2 }} {{ customer.city }}
            </p>
            <p>{{ customer.phone }} &#x2022; {{ customer.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <AddCustomerView v-if="appStore.showAddCustomerView" />
    <EditCustomerView v-if="appStore.showEditCustomerView" :customer="customerToEdit" />
  </AppLayout>
</template>

<style scoped>
.select-customer-wrapper {
  cursor: pointer;
}
.list_style_1 {
  /* display: flex; */
  /* flex-direction: row; */
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #4caf50; /* active */
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.customer_details,
.all-products {
  /* padding-left: 15px; */
  text-align: left;
}
h3 {
  margin: 7px 0 0 10px;
  font-size: 20px;
  font-weight: bold;
  color: #445b54;
}
.customer_details p {
  margin: 0;
  padding: 2px 0;
}
.active {
  border: 1px solid #4caf50;
}
</style>
