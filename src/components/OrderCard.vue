<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

import { computed, onMounted, ref } from 'vue'
import { fetchOrderItems } from '@/services/apiServices'
import OrderItems from '@/components/OrderItems.vue'

const props = defineProps(['customer', 'order'])

const order_items = ref([])

const getOrderItems = (ref) => {
  fetchOrderItems(ref).then((res) => {
    console.log(res)
    order_items.value = res.data
  })
}

const order_date = computed(() => {
  const ms_per_day = 1000 * 60 * 60 * 24
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const ty = ['Today', 'Yesterday']
  let order_year = parseInt(props.order.created.substring(0, 4))
  let order_month = parseInt(props.order.created.substring(5, 7)) - 1
  let order_date = parseInt(props.order.created.substring(8, 10))
  const today = new Date()
  const this_day = today.getDay() // position in week
  const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const utc2 = Date.UTC(order_year, order_month, order_date)
  let difference = Math.floor((utc1 - utc2) / ms_per_day)
  if (difference > 6) {
    return months[order_month] + ' ' + order_date
  } else if (difference > 1) {
    if (this_day - difference < 0) {
      //  months[order_month] +  " - " +
      return months[order_month] + ' ' + order_date
    }
    return months[order_month] + ' - ' + order_date
  } else {
    return ty[difference]
  }
})
const ordinal_suffix = computed(() => {
  let l_order_date = parseInt(props.order.created.substring(8, 10))
  var j = l_order_date % 10,
    k = l_order_date % 100
  if (j == 1 && k != 11) {
    return 'st'
  }
  if (j == 2 && k != 12) {
    return 'nd'
  }
  if (j == 3 && k != 13) {
    return 'rd'
  }
  if (order_date.value == 'Today' || order_date.value == 'Yesterday') {
    return ''
  }
  return 'th'
})
onMounted(() => { })
</script>

<template>
  <Collapsible v-if="order">
    <div class="border border-slate p-4 rounded-md my-2" @click.once="getOrderItems(order.order_ref)">
      <CollapsibleTrigger v-if="customer" class="w-full">
        <div class="flex justify-between">
          <div class="order-customer">
            <h3>{{ customer.first_name }}</h3>
          </div>
          <p>&#8358;{{ order.products_total }}</p>
        </div>

        <div class="flex justify-between">
          <div class="flex">
            #
            <p class="ellipses">{{ order.order_ref }}</p>
            &#x2022;
            <p style="margin-left: 5px">
              {{ order_date }}
              <!-- {{  order_date == 'Today' || order_date == 'Yesterday'
                  ? '' :ordinal_suffix }} -->
              {{
                order_date == 'Today' || order_date == 'Yesterday'
                ? ''
                : parseInt(order.created.substring(0, 4))
              }}
            </p>
          </div>
          <p>{{ order.fulfilled }}/{{ order.items_count }}</p>
        </div>
        <div id="fulfillment">
          <p>
            {{ order.unique_items }} items
            <!-- {{ order.unique_items > 1 ? `& ${order.unique_items - 1} other items` : "" }} -->
          </p>
          <p v-if="order.fulfilled == 1 " class="pending text-primary">Fullfiled</p>
          <p v-else class="pending text-error">Pending</p>
        </div>

      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="bg-gray-100 bg-opacity-30 p-4 my-2 rounded-md w-full">

          <div class="flex justify-between w-full ">
            <h4 class="font-bold">Products</h4>
            <div class="flex items-center gap-2">
              <span class="text-sm underline">Check All</span>
              <!-- <input type="checkbox" name="mark-all" id="mark-all" /> -->
            </div>
          </div>
          <OrderItems v-for="(item, i) in [1, 2, 3]" :key="i" :item="item"></OrderItems>

          <Collapsible>
            <div class="w-full flex justify-between bg-slate-200 bg-opacity-30 rounded-md p-2">
              <div class="w-full rounded-md p-2">Customer Details </div>
              <CollapsibleTrigger>
                <div class="w-full rounded-md p-2">
                  <ChevronDownIcon class="w-4 h-4" />
                  </div>
              </CollapsibleTrigger>

            </div>
            <CollapsibleContent>
              <div :id="'customer' + customer.id" class="mt-4">
                <ul class="customer-details">
                  <li>
                    <img src="../assets/images/icons/customer-name-icon.svg" alt="" />
                    <p>{{ customer.first_name }} {{ customer.last_name }}</p>
                  </li>
                  <li>
                    <img src="../assets/images/icons/customer-email-icon.svg" alt="" />
                    <p>{{ customer.email }}</p>
                  </li>
                  <li>
                    <img src="../assets/images/icons/customer-phone-icon.svg" alt="" />
                    <p>{{ customer.phone }}</p>
                  </li>
                  <li>
                    <img src="../assets/images/icons/customer-location-icon.svg" alt="" />
                    <p>
                      {{ customer.line1 }} {{ customer.line2 }} {{ customer.city }}
                      {{ customer.state }}
                    </p>
                  </li>
                  <button>Share order info</button>
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CollapsibleContent>
    </div>
  </Collapsible>
</template>

<style scoped>
.order-details {
  display: flex;
  flex-direction: column;
}

/* .order-details div { */
.order-details div {
  display: flex;
  justify-content: flex-start;
  width: 300px;
  color: #445b54;
}

h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.ellipses {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70px;
  direction: rtl;
  text-align: left;
  margin-right: 5px;
}

.date p {
  margin-bottom: 10px;
}

.date ul {
  padding: 0;
}

.order-items {
  /* border: 1px solid pink; */
  background: #f4f4f4;
  border-radius: 8px;
  margin: 15px;
  padding: 10px;
}

.item-header {
  display: flex;
  justify-content: space-between;
}

.call {
  font-size: 18px;
  font-weight: lighter;
  color: #4caf50;
  padding: 2px 10px;
  background: #f4fff4;
  border-radius: 42px;
}

.customer-details {
  background: #fff;
  border: 0.5px solid grey;
  border-radius: 8px;
  padding: 10px;
  /* padding: 0; */
  text-align: left;
}

.customer-details li {
  display: flex;
  padding-bottom: 10px;
}

.customer-details p {
  margin: 0;
  padding-left: 10px;
}

.customer-details button {
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  border: none;
}

#fulfillment p {
  margin: 0;
}

#fulfillment {
  display: flex;
  justify-content: space-between;
}

.accordion-button {
  padding: 15px;
}

.accordion-button:not(.collapsed) {
  background-color: none;
  color: #445b54;
}

.accordion-button:not(.collapsed)::after,
.accordion-button::after {
  /* background-image: var(--bs-accordion-btn-active-icon); */
  background-image: none;
}

.accordion-header {
  /* background-color: none; */
}

.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.125);
}

.accordion {
  margin-bottom: 15px;
  --bs-accordion-active-bg: none;
}</style>
