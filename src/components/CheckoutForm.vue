<script setup lang="ts">
import { Input } from '@/components/ui/input'
</script>

<template>
  <div class="form nav-margin-top py-6 px-4">
    <div class="form-group">
      <label for="your-email">Enter deliver fee if any</label>
      <Input  class="my-2" />
    </div>

    <div v-if="vegan" id="sales-added-modal" centered title="BootstrapVue">
      <div class="sales-added-body-wrapper">
        <div class="product-body">
          <img src="@/assets/images/icons/sales-added-check-icon.svg" alt="" />
          <h2 class="black">Sales Added</h2>
          <p class="dark">
            A link has been sent to customer_name <br />
            to give feedback.
          </p>
        </div>
      </div>
    </div>

    <div class="payment-status">
      <p class="dark label my-2">Has this order been pad for?</p>
      <div class="form-group">
        <input
          id="paid"
          name="payment-status"
          type="radio"
          value="1"
          @change="paymentStatus($event)"
        />
        <label for="paid" class="radio-label">Yes</label>
      </div>
      <div class="form-group">
        <input
          id="not-paid"
          name="payment-status"
          type="radio"
          value="0"
          @change="paymentStatus($event)"
        />
        <label for="not-paid" class="radio-label">No</label>
      </div>
    </div>
    <div class="delivery-status">
      <p class="dark label my-2">Has this order been fulfilled?</p>
      <div class="form-group">
        <input
          id="delivered"
          name="delivery-status"
          type="radio"
          value="1"
          @change="fulfillmentStatus($event)"
        />
        <label for="delivered" class="radio-label">Fulfilled</label>
        <span>A receipt and feedback request will be emailed to the customer</span>
      </div>
      <div class="form-group">
        <input
          id="not-delivered"
          name="delivery-status"
          type="radio"
          value="0"
          @change="fulfillmentStatus($event)"
        />
        <label for="not-delivered" class="radio-label">Not fulfilled</label>
        <span>Only a receipt will be emailed to the customer</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* checkout styles */

.form {
  text-align: left;
}
.delivery-status,
.payment-status {
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  background: #f5f5f5;
  border: 0.5px solid #f3f3f3;
  border-radius: 8px;
  /* text-align: left; */
  margin-bottom: 25px;
}
.form-group:first-of-type {
  margin-bottom: 20px;
}
.form-group label {
  color: #0c3e26;
  font-weight: bold;
  margin-left: 11px;
}
.form-group span {
  display: block;
  margin-left: 25px;
  color: #626c7a;
}
</style>
