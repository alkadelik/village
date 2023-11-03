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
  appStore.showAddProductView = true
}
</script>

<template>
  <AppLayout class="relative p-4" pageTitle="Inventory" stateKey="showAddProductView"  navBtnText="add Product" :hasNavBtn="true">
    <div v-if="!authStore.state.inventory.length" class="h-auto flex justify-center items-center">
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

    <div class="inventory ">
      <div class="" v-for="product, i in authStore.state.inventory" :key="i">
      <div class="product" @click="viewProductDetail(product)">
        <div class="img-wrapper">
          <!-- <img :src="baseUrl + product.product_image" alt=""> -->
        </div>
        <div class="content-wrapper">
          <h3>{{ product.product_name }} </h3>
          <p class="dark">&#8358;{{ product.price }}</p>
          <span>{{ product.description }}</span>
        </div>
      </div>
      <!-- <a>Product Review</a> -->
    </div>
    </div>

    <AddProductView v-if="appStore.showAddProductView"/>
  </AppLayout>
</template>


<style scoped>
.inventory {
  display: grid;
  grid-template-columns: 48% 48%;
  align-items: top;
  justify-content: center;
  gap: 15px;
  text-align: left;
}
h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #445B54;
}
h3::first-letter {
  text-transform: capitalize;
}
p {
  margin: 3px 0;
}
.product span {
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  color: #848282;

  width: 160px;
  /* white-space: ; */
  overflow: hidden;
  text-overflow: ellipsis;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  /* height:56px; */
}
.inventory a {
  display: block;
  text-decoration: underline !important;
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  color: #4CAF50 !important;
  cursor: pointer;
}
.img-wrapper {
  width: 100%;
  height: 90px;
  background: ghostwhite;
  border-radius: 8px;
  overflow: hidden;
}
.img-wrapper img {
  max-width: 100%;
}
.content-wrapper {
  margin-top: 5px;
}
</style>