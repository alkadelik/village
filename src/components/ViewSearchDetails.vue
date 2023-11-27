<script setup lang="ts">
import DrawerView from '@/components/DrawerView.vue'
import { ref } from 'vue'
const props = defineProps(['products'])

const cart = ref(props.products)
</script>

<template>
  <DrawerView>
    <div>search details

          <div v-show="activeStep == 1" class="px-4 h-screen relative overflow-y-scroll">
      <p class="text-center my-3">select quantity and specifications</p>
      <!-- <div class="h-4/6 overflow-y-scroll"> -->
      <div class="cart_item" v-for="(item, i) in cart" :key="i">
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
              <Select v-model="item.selected_option1">
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

              <Select v-model="item.selected_option2">
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
              <div class="0">
                <p>{{ sale.cart.find((cartItem) => cartItem.id == item.id).count }}</p>
              </div>
              <div class="counter-button" @click="increase(i)">
                <PlusIcon class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div> -->

      <div class="absolute bottom-36 left-0 w-full px-4">
        <Button class="w-full" @click="goToCustomer">Select or add Buyer</Button>
      </div>
    </div>
    </div>
  </DrawerView>
</template>

<style></style>
