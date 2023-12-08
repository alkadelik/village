<template>
  <div class="flex justify-between my-4" :class="{ active: manageOrder }">
    <div class="flex items-center gap-2">
      <div class=" w-12 h-12 bg-white rounded-md" v-if="!item.product_image">
        <img v-if="!item.image_url" :src="baseUrl + item.image_url" alt="product_image" />
      </div>

      <div class="name">
        <p class="font-bold text-sm">{{ item.product_name }}</p>
        <p class="text-left text-sm">Qty: {{ item.qty }}</p>
      </div>
    </div>
    <div class="price">
      <div class="product-price">
    
        <p class="text-sm font-bold text-right">&#8358;{{ item.price_sold }}</p>

            <div class="flex items-center gap-2 ">
          <label for="mark-all">fulfilled</label>
          <input type="checkbox" name="mark-all" id="mark-all"  :checked="item.status" :disabled="item.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['item'])
</script>

<style scoped>
.items {
}
.items,
.product-detail {
  display: flex;
  /* flex-direction: row; */
}
.items {
  justify-content: space-between;
  text-align: left;
}
.items img {
  height: 50px;
  margin-right: 10px;
}
.items p {
  margin: 0;
}
.product-detail {
  margin-bottom: 20px;
}
</style>
