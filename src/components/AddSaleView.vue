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
import { saveOrder, saveOrderItems } from '@/services/apiServices'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { boolean } from 'zod'
import { useToast } from 'vue-toast-notification'

interface Sale {
  items_count: number
  total_amount: number
  unique_items: number
  order_ref: string
  products_total: number
  store: number
  shipping: number
  has_customer: boolean
  customer_id: number
  fulfilled: string
  payment_status: string
}

const authStore = useAuthStore()
const appStore = useAppStore()
const $toast = useToast()

const cart_map = ref([])

// products, cart, customer, checkout
const activeStep = ref(0)

const createOrderID = () => {
  var ref_type = '2' // '1' purchase by customer; 2, sale added by merchant
  var rand_int = Math.floor(Math.random() * 9999) + 1000
  const today = new Date()
  var year = today.getFullYear().toString().slice(-2)
  var store_id = authStore.state.store.id.toString() // this allows for up to 9999 stores merchants
  // var customer_id = '0000' // 0 for anonymous
  var month = (today.getMonth() + 1).toString() // cause month is 0 indexed
  var day = today.getDate().toString()
  var cart_count = sale.value.cart.length.toString() // unique items (products) or absolute number of items? I go for absolute
  // var hour = today.getHours().toString();

  // hour = hour.padStart(2,"0")
  month = month.padStart(2, '0')
  day = day.padStart(2, '0')
  cart_count = cart_count.padStart(2, '0')
  store_id = store_id.padStart(4, '0')
  // ref_type + store_id + year + month + day + cart_count // + nth purchase of the day | this.customer_id.padStart(3,"0")
  sale.value.order_ref = ref_type + store_id + month + day + cart_count + year + rand_int
}
const toggleProductInCart = (id) => {
  let index = cart_map.value.indexOf(id)
  if (index == -1) {
    cart_map.value = [...cart_map.value, id]
  } else {
    let temp = [...cart_map.value]
    temp.splice(index, 1)
    cart_map.value = [...temp]
  }
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

// const unpacked_cart = ref([])
const unpacked_cart = computed(() => {
  let temp = []
  let inventory = authStore.state.inventory

  cart_map.value.forEach((item) => {
    temp.push({
      ...inventory.find((x) => x.id === item),
      count: 1,
      selected_option1: '',
      selected_option2: ''
    })
  })

  return temp
})
watch(unpacked_cart, (x) => {
  sale.value.cart = x
})
// watch(cart_map, () => {
//   let temp = unpacked_cart.value
//   // if (cart_map.value.length > 0) {
//   let inventory = [...authStore.state.inventory]

//   cart_map.value.forEach((item) => {
//     let existAlready = unpacked_cart.value.find((x) => x.id === item)

//     if (existAlready) {
//       //remove it
//       let t = unpacked_cart.value
//       t.splice(item, 1)
//       unpacked_cart.value = [...temp]
//     } else {
//       let new_obj: { count?: number } = {}
//       let obj = inventory.find((x) => x.id === item)

//       Object.assign(new_obj, obj)

//       new_obj.count > 0 ? '' : (new_obj.count = 1) // in case cart is recovered from localStorage & has count. Ensure object not created twice
//       temp.push(new_obj)

//     }
//   })
//       unpacked_cart.value = [...temp]

//   //console.log('cartMap change ', temp)

// })

const increase = (idx) => {
  sale.value.cart[idx].count++
}

const decrease = (idx) => {
  if (sale.value.cart[idx].count > 1) {
    sale.value.cart[idx].count--
  }
}

const sale = ref<Sale>({
  items_count: 0,
  total_amount: 0,
  unique_items: 0,
  order_ref: '',
  products_total: 0,
  store: 0,
  shipping: 0,
  has_customer: false,
  customer_id: 0,
  fulfilled: '',
  payment_status: ''
})

// const selectedCustomer = ref(0)
const selectFunction = (id) => {
  switch (sale.value.customer_id) {
    case 0:
      sale.value.customer_id = id
      sale.value.has_customer = true
      break
    case id:
      sale.value.customer_id = 0
      break
    default:
      sale.value.customer_id = id
      sale.value.has_customer = true
  }
}

const fulfillmentStatus = (e) => {
  sale.value.fulfilled = e.target.value
}
const paymentStatus = (e) => {
  console.log(e.target.value)
  sale.value.payment_status = e.target.value
}
const updateShipping = (e) => {
  //console.log(e.target.value)
  sale.value.shipping = e.target.value
}

const orderItems = computed(() => {
  return sale.value.cart.map((item, i) => {
    var order_item = {}
    order_item.price_sold = item.price
    order_item.sub_total = Number(item.price * item.count)
    order_item.index = i + 1
    order_item.order = sale.value.order_ref
    order_item.product = item.id
    order_item.selected_option1 = item.selected_option1
    order_item.selected_option2 = item.selected_option2
    order_item.qty = item.count
    order_item.productid = item.id
    order_item.image_url = item.product_image
    order_item.has_feedback = item.has_feedback
    return order_item
  })
})

const handleSave = () => {
  createOrderID()

  //console.log(sale.value, orderItems)

  sale.value.store = 0
  sale.value.unique_items = sale.value.cart.length
  sale.value.total_amount = sale.value.cart.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  )

  const { cart, ...newObject } = sale.value
  console.log(sale.value)
  saveOrder(newObject)
    .then(async (res) => {
      console.log(res.data.order, orderItems.value)
      authStore.state.orders = [...authStore.state.orders, res.data.order]

      await saveOrderItems(orderItems.value)
        .then((res) => {
          console.log(res, 'res')
        })
        .catch((err) => {
          console.log(err, 'err')
        })
    })

    .finally(() => {
      $toast.success('Sale Created successfully')
      appStore.drawerIsOpen = false
 
      // appStore.drawerIsOpen = false
      // setTimeout(() => {
      //   appStore.showAddSaleView = false
      // }, 300)
    })
}

const reset = () => {
  sale.value = {
    items_count: 0,
    total_amount: 0,
    unique_items: 0,
    order_ref: '',
    products_total: 0,
    store: 0,
    shipping: 0,
    has_customer: false,
    customer_id: 0,
    fulfilled: '',
    payment_status: ''
  }
  cart_map.value = []
}
</script>

<template>
  <DrawerView drawerTitle="Select products" :step="activeStep" :reduceStep="reduceStep"
    stateKey="showNestedAddCustomerView" :showAddCustomerButton="activeStep == 2" @close="reset">
    <!-- {{authStore.state.inventory[4]}} -->

    <div v-show="activeStep == 0" class="px-4 h-full relative">
      <p class="text-center my-3">select products for this sale</p>
      <p v-if="!authStore.state.inventory.length" class="text-center my-3">
        You have no products to sell from please create one
      </p>
      <!-- {{ unpacked_cart }} -->
      <div class="form products">
        <div class="form-group product" v-for="(product, i) in authStore.state.inventory" :key="i">
          <div>
            <input type="checkbox" :id="'product' + i" />
            <label :for="'product' + i">
              <div class="sale-inventory-card" @click="toggleProductInCart(product.id)">
                <div class="img-wrapper">
                  <!-- <img :src="baseUrl + product.product_image" alt="product image" /> -->
                  <!-- <img src="../assets/images/inventory-product-image-1.png" alt=""> -->
                </div>
                <p class="product-name truncate">{{ product.product_name }}</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="absolute bottom-36 left-0 w-full px-4">
        <Button class="w-full" @click="goToCart" :disabled="!unpacked_cart.length">View Cart</Button>
      </div>
    </div>
    <div v-show="activeStep == 1" class="px-4 h-screen relative overflow-y-scroll">
      <p class="text-center my-3">select quantity and specifications</p>
      <!-- <div class="h-4/6 overflow-y-scroll"> -->
      <div class="cart_item" v-for="(item, i) in sale.cart" :key="i">
        <div class="img_wrapper">
          <!-- <img src="../assets/images/inventory-product-image-1.png" alt=""> -->
          <!-- <img :src="'http://127.0.0.1:8000' + item.product_image" alt="product image" /> -->
        </div>
        <div class="item_details">
          <p class="name">{{ item.product_name }}</p>
          <div class="price flex items-center" @click="editPrice(i)" data-bs-toggle="modal" data-bs-target="#editPrice">
            <h3>
              &#8358;{{ item.price }}<span>{{ item.new_price }}</span>
            </h3>
            <PencilSquareIcon class="w-4 h-4" />
          </div>
          <div>
            <div class=" justify-">
              <div class="flex justify-between my-3" v-if="item.first_variant && item.second_variant">

                <Select v-model="item.selected_option1" class="p-0">
                  <SelectTrigger class="w-20">
                    <SelectValue :placeholder="`${item.first_variant_name}`" />
                  </SelectTrigger>
                  <!-- <span >{{ item.first_variant_name }}</span> -->
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="variant_option in item.first_variant.split(',')" :key="variant_option"
                        :value="variant_option">
                        {{ variant_option }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select v-model="item.selected_option2">
                  <!-- <span>{{ item.second_variant_name }}</span> -->

                  <SelectTrigger class="w-20">
                    <SelectValue :placeholder="`${item.second_variant_name}`" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="variant_option in item.second_variant.split(',')" :key="variant_option"
                        :value="variant_option">
                        {{ variant_option }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="counter">
                <div class="counter-button" @click="decrease(i)">
                  <MinusIcon class="w-4 h-4" />
                </div>
                <div class="0">
                  <p>{{ sale.cart.find((cartItem) => cartItem.id == item.id).count }}</p>
                </div>
                <div class="counter-button" @click="increase(i)">
                  <PlusIcon class="w-4 h-4" />
                </div>
              </div>
            </div>


            <!-- <span class="dark">{{ item.variant_1 }}, {{ item.variant_2 }}</span> -->
            <!-- <Variants :count="item.count" :id="item.id"></Variants> -->

          </div>
        </div>
      </div>
      <!-- </div> -->

      <div class="absolute bottom-36 left-0 w-full px-4">
        <Button class="w-full" @click="goToCustomer">Select or add Buyer</Button>
      </div>
    </div>
    <div v-show="activeStep == 2">
      <p class="text-center my-3">select customer to sell to</p>

      <div class="p-2">
        <Input class="w-full" placeholder="Type customer name to search" />

        <div class="select-customer-wrapper" v-for="(customer, i) in authStore.state.customers" :key="i"
          @click="selectFunction(customer.id)">
          <div class="list_style_1 my-4" :class="{ active: sale.customer_id == customer.id }">
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

      <CheckoutForm :sale="sale" @paymentStatus="paymentStatus" @fulfillmentStatus="fulfillmentStatus"
        @updateShipping="updateShipping" />
      <div class="absolute bottom-36 left-0 w-full px-4">
        <Button class="w-full" @click="handleSave">Save </Button>
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

input:checked+label::after {
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
  border: 1px solid #4caf50;
  /* active */
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
