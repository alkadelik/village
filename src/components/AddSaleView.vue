<script setup lang="ts">
import { watch } from 'vue'
import DrawerView from '@/components/DrawerView.vue'
import NestedAddCustomerView from '@/components/NestedAddCustomerView.vue'
import CheckoutForm from '@/components/CheckoutForm.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'
import { PencilSquareIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
const authStore = useAuthStore()
const appStore = useAppStore()

const cart_map = ref([])

// products, cart, customer, checkout
const activeStep = ref(0)

const toggleProductInCart = (id) => {
  let index = cart_map.value.indexOf(id)
  index == -1 ? (cart_map.value = [...cart_map.value, id]) : ''
}

const goToCart = () => {
  //   authStore.state.cart_map = cart_map
  activeStep.value = 1
}
const goToCustomer = () => {
  //   authStore.state.cart_map = cart_map
  activeStep.value = 2
}
const goToCheckout = () => {
  //   authStore.state.cart_map = cart_map
  activeStep.value = 3
}

const reduceStep = () => {
  activeStep.value -= 1
}

const unpacked_cart = ref([])

watch(cart_map, () => {
  let temp = []
  if (cart_map.value.length > 0) {
    let inventory = authStore.state.inventory

    cart_map.value.map((item_id) => {
      let obj = inventory.find((item) => item.id == item_id)
      let new_obj: { count?: number } = {}
      Object.assign(new_obj, obj)

      new_obj.count > 0 ? '' : (new_obj.count = 1) // in case cart is recovered from localStorage & has count. Ensure object not created twice
      temp.push(new_obj)
    })
    // this.$store.commit(mutationTypes.SAVE_UNPACKED_CART, unpacked_cart)
    unpacked_cart.value = temp
  }
})

const increase = (idx) => {
  unpacked_cart.value[idx].count++
}

const decrease = (idx) => {
  unpacked_cart.value[idx].count--
}

const customer_id = ref()
</script>

<template>
  <DrawerView
    drawerTitle="Select products"
    :step="activeStep"
    :reduceStep="reduceStep"
    stateKey="showNestedAddCustomerView"
    :showAddCustomerButton="activeStep == 2"
  >
    <!-- {{authStore.state.inventory[4]}} -->

    <div v-show="activeStep == 0" class="px-4 h-full relative">
      <p class="text-center my-3">select products for this sale</p>
      <div class="form products">
        <div
          class="form-group product"
          v-for="(product, i) in authStore.state.inventory"
          :key="i"
          @click="toggleProductInCart(product.id)"
        >
          <input type="checkbox" :id="'product' + i" />
          <label :for="'product' + i">
            <div class="sale-inventory-card">
              <div class="img-wrapper">
                <!-- <img :src="baseUrl + product.product_image" alt="product image" /> -->
                <!-- <img src="../assets/images/inventory-product-image-1.png" alt=""> -->
              </div>
              <p class="product-name truncate">{{ product.product_name }}</p>
            </div>
          </label>
        </div>
      </div>

      <div class="absolute bottom-36 left-0 w-full px-4">
        <Button class="w-full" @click="goToCart">View Cart</Button>
      </div>
    </div>
    <div v-show="activeStep == 1" class="px-4 h-full relative overflow-y-scroll">
      <p class="text-center my-3">select quantity and specifications</p>

      <div class="cart_item" v-for="(item, i) in unpacked_cart" :key="i">
        <div class="img_wrapper">
          <!-- <img src="../assets/images/inventory-product-image-1.png" alt=""> -->
          <!-- <img :src="'http://127.0.0.1:8000' + item.product_image" alt="product image" /> -->
        </div>
        <div class="item_details">
          <p class="name">{{ item.product_name }}</p>
          <div
            class="price"
            @click="editPrice(i)"
            data-bs-toggle="modal"
            data-bs-target="#editPrice"
          >
            <h3>
              &#8358;{{ item.price }}<span>{{ item.new_price }}</span>
            </h3>
            <PencilSquareIcon class="w-4 h-4" />
          </div>
          <div>
            <div class="flex justify-between my-3" v-if="item.first_variant && item.second_variant">
              <Select>
                <SelectTrigger class="w-[100px]">
                  <SelectValue :placeholder="`${item.first_variant_name}`" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="variant_option in item.first_variant.split(',')"
                      :key="variant_option"
                      :value="variant_option"
                    >
                      {{ variant_option }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger class="w-[100px]">
                  <SelectValue :placeholder="`${item.second_variant_name}`" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="variant_option in item.second_variant.split(',')"
                      :key="variant_option"
                      :value="variant_option"
                    >
                      {{ variant_option }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- <span class="dark">{{ item.variant_1 }}, {{ item.variant_2 }}</span> -->
            <!-- <Variants :count="item.count" :id="item.id"></Variants> -->
            <div class="counter">
              <div class="counter-button" @click="decrease(i)">
                <MinusIcon class="w-4 h-4" />
              </div>
              <div class="number">
                <p>{{ item.count }}</p>
              </div>
              <div class="counter-button" @click="increase(i)">
                <PlusIcon class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-36 left-0 w-full px-4">
        <Button class="w-full" @click="goToCustomer">Select or add Buyer</Button>
      </div>
    </div>
    <div v-show="activeStep == 2">
      <p class="text-center my-3">select customer to sell to</p>

      <div class="p-2">
        <Input class="w-full" placeholder="Type customer name to search" />

        <div
          class="select-customer-wrapper"
          v-for="(customer, i) in authStore.state.customers"
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
                {{ customer.house_no }} {{ customer.line1 }} {{ customer.line2 }}
                {{ customer.city }}
              </p>
              <p>{{ customer.phone }} &#x2022; {{ customer.email }}</p>
            </div>
          </div>
        </div>

        <div class="absolute bottom-36 left-0 w-full px-4">
          <Button class="w-full" @click="goToCheckout">Go to checkout </Button>
        </div>
        <NestedAddCustomerView v-if="appStore.showNestedAddCustomerView" />
      </div>
    </div>
    <div v-show="activeStep == 3">
      <p class="text-center my-3">Checkout</p>

      <CheckoutForm />
       <div class="absolute bottom-36 left-0 w-full px-4">
          <Button class="w-full" @click="goToCheckout">Save </Button>
        </div>
    </div>
    <div></div>
  </DrawerView>
</template>

<style scoped>
.products {
  display: grid;
  grid-template-columns: 33% 33% 32%;
  align-items: center;
  justify-content: center;
  gap: 3px;
}
.product input {
  display: none;
}
label {
  position: relative;
  cursor: pointer;
  display: block;
}
.form label {
  color: #0c3e26;
  margin-bottom: 8px;
}
label::before {
  content: '';
  /* -webkit-appearance: none; */
  background-color: transparent;
  border: 2px solid #171717;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
  padding: 8px;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 5px;
  position: absolute;
  right: 10px;
  top: 10px;
}
input:checked + label::after {
  content: '';
  display: block;
  position: absolute;
  top: 14px;
  right: 17px;
  width: 6px;
  height: 10px;
  border: solid #171717;
  border-top-width: medium;
  border-right-width: medium;
  border-bottom-width: medium;
  border-left-width: medium;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.form .form-group:nth-of-type(2n + 1) .sale-inventory-card {
  background: #cef6d4;
}
.form .form-group:nth-of-type(2n) .sale-inventory-card {
  background: #f9eeeb;
}
.form .form-group .sale-inventory-card {
  border-radius: 10px;
  padding: 12px;
  min-height: 143px;
  margin-bottom: 3px;
}
.img-wrapper {
  border-radius: 8px;
  overflow: hidden;
  height: 80px;
}
.sale-inventory-card .img-wrapper img {
  display: block;
  max-width: 80px;
  margin: auto;
  min-height: 72px;
  -o-object-fit: cover;
  object-fit: cover;
}
img {
  border-style: none;
}
.sale-inventory-card p {
  background: rgba(255, 255, 255, 0.5);
  -webkit-backdrop-filter: blur(304px);
  backdrop-filter: blur(304px);
  border-radius: 4px;
  min-width: 90px;
  padding: 8px 5px;
  margin-top: 10px;
  color: #111827;
  margin: 5px 0;
  font-size: 12px;
}

/* cart styles */

.cart_item {
  /* display: flex;
	flex-direction: row; */
  background: #ffffff;
  box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.04);
  border-radius: 20px;
  padding: 9px;
  display: grid;
  grid-template-columns: 35% 60%;
  grid-gap: 15px;
}
.cart_item:not(:last-of-type) {
  margin-bottom: 11px;
}
.img_wrapper {
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  height: 111px;
  /* border-radius: 20px; */

  /* width: 100%; */
  /* height: 91px; */
  border: 0.5px solid grey;
  border-radius: 20px;
  overflow: hidden;
}
.img_wrapper img {
  width: 100%;
}
.item_details {
  text-align: left;
}
.name,
.price h3,
.counter p {
  margin: 0;
}
.price {
  padding: 5px 0;
  cursor: pointer;
}
.price h3,
.price img {
  display: inline-block;
}
.price h3 {
  margin-right: 5px;
}
.qty,
.counter {
  display: flex;
  flex-direction: row;
}
.qty {
  justify-content: space-between;
}
.counter {
  align-items: center;
  justify-content: space-around;
  min-width: 78px;
  min-height: 32px;
  background: #f8f8f8;
  border-radius: 4px;
}
.counter img {
  vertical-align: middle;
}
.number {
  background: #e9e9e9;
  border-radius: 4px;
  min-width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
}

/* customer card styles  */

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
