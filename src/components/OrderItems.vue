<template>
  <div class="items" :class="{ active: manageOrder }">
    <div class="product-detail">
      <div class="img-wrapper" v-if="item.product_image">
        <img :src="baseUrl + item.product_image" alt="product_image" />
      </div>

      <div class="name">
        <p class="p">{{ item.product_name }}f</p>
        <p>Qty: {{ item.qty }}</p>
      </div>
    </div>
    <div class="price">
      <div class="product-price">
    
        <p class="p">&#8358;{{ item.sub_total }} g</p>

            <div class="flex items-center gap-2">
          <label for="mark-all">fulfilled</label>
          <input type="checkbox" name="mark-all" id="mark-all" />
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
  flex-direction: row;
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
