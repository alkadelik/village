<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import dayjs from 'dayjs/esm'
import { fetchOrders, fetchMetrics } from '@/services/apiServices'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ShoppingBagIcon,
  ChartBarSquareIcon,
  ShoppingCartIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()

const updateMetrics = () => {
  fetchMetrics(period.value).then((res) => {
    authStore.state.metrics = res.data
    metrics.value = res.data
    //console.log(res.data)
  })
}

onMounted(() => {
  updateMetrics()
})

const timeOfDay = computed(() => {
  let hrs = dayjs().get('hours')
  return hrs < 12 ? 'morning' : hrs >= 12 && hrs < 6 ? 'afternoon' : 'evening'
})

const period = ref('1')
const metrics = ref([])

watch(period, () => {
  updateMetrics()
})
</script>

<template>
  <AppLayout class="relative p-4" pageTitle="Dashboard">
    <div class="mt-20 h-screen overflow-y-scroll">
      <section id="dashboard">
        <div class="">
          <div class="text-center my-8">
            <h3 class="font-bold text-lg">
              Good {{ timeOfDay }}, {{ authStore.state.store.store_name }}
            </h3>
            <p class="">Here’s how is your bussiness is doing</p>
          </div>

          <div class="report-wrapper border border-black">
            <div class="flex justify-end mb-4">
              <Select v-model="period" @change="updateMetrics">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0"> Today </SelectItem>
                    <SelectItem value="1"> This week </SelectItem>
                    <SelectItem value="2"> This month </SelectItem>
                    <SelectItem value="3"> This year </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <!-- {{metrics}} -->
            <div class="report-card" v-for="(data, i) in metrics" :key="i">
              <div :class="`img-wrapper ${i == 0 ? 'yellow' : i == 1 ? 'blue' : 'pink'}`">
                <ShoppingBagIcon v-if="data.icon == 'Sale'" class="w-5 h-5 text-orange-300" />
                <ChartBarSquareIcon
                  v-if="data.icon == 'Transaction'"
                  class="w-5 h-5 text-blue-300"
                />
                <ArrowsUpDownIcon v-if="data.icon == 'Arrows'" class="w-5 h-5 text-pink-300" />
              </div>
              <div class="content-wrapper">
                <p class="text-sm">{{ data.title }}</p>
                <div class="total">
                  <h3 class="text-lg font-bold"><span v-if="data.currency == 1">&#8358;</span>{{ data.data }}</h3>
                  <span class="triangle-arrow">
                    {{ (data.up = 0 ? '-' : '+') }} {{ data.percent }}%
                  </span>
                </div>
                <span class="text-sm">vs {{ data.period }}</span>
              </div>
            </div>
          </div>

          <div class="dashboard-chart-wrapper">
            <div class="dashboard-chart-header">
              <div class="content-wrapper">
                <div class="total">
                  <!-- <p>Total sale</p>
                <span class="triangle-arrow">+25%</span> -->
                </div>
                <!-- <h3 class="h3">N200,000.00</h3> -->
              </div>
              <div class="form">
                <!-- <select v-model="period" @change="updateMetrics">
                  <option value="0">Today</option>
                  <option value="1">This week</option>
                  <option value="2">This month</option>
                  <option value="3">This year</option>
                  <option value="4">Year to date</option>
                </select> -->
              </div>
            </div>
            <!-- <LineChartGenerator
						:chart-options="chartOptions"
						:chart-data="chartData"
						:chart-id="chartId"
						:dataset-id-key="datasetIdKey"
						:plugins="plugins"
						:css-classes="cssClasses"
						:styles="styles"
						:width="width"
						:height="height"
					/> -->
            <!-- <span class="space">YOU made an extra <strong>N20,000</strong> this week</span> -->
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard-top-margin {
  /* margin-top: 120px; */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  z-index: 2;
}
.welcome {
  text-align: left;
}
.report-wrapper {
  background: #f9f9f9;
  border: 0.5px solid #f9f9f9;
  border-radius: 16px;
  padding: 14px 14px 24px;
  margin-bottom: 16px;
}
.report-card {
  padding: 16px 16px;
  display: grid;
  grid-template-columns: 48px auto;
  align-items: center;
  grid-gap: 14px;
  text-align: left;
  background: #ffffff;
  border: 0.5px solid #e2e8f0;
  box-shadow: -2px 8px 16px rgba(181, 181, 181, 0.08);
  border-radius: 8px;
}
.report-card p,
.report-card h3 {
  margin: 0;
}
.report-card:not(:last-of-type) {
  margin-bottom: 16px;
}
.img-wrapper.blue {
  background: rgba(0, 179, 255, 0.08); /* blue */
}
.img-wrapper.yellow {
  background: rgba(255, 195, 80, 0.08); /* yellow */
}
.img-wrapper.pink {
  background: rgba(248, 78, 140, 0.08); /* pink */
}
.img-wrapper {
  border-radius: 8px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
p {
  color: #9c9c9c;
}
.total {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 5px 0 0;
  font-size: 12px;
  font-weight: bold;
}
.triangle-arrow::before {
  /* content: url(http://127.0.0.1:8000/img/dashboard-triangle-icon.97f0869f.svg); */
  position: relative;
  left: -4px;
}
::before,
::after {
  box-sizing: border-box;
}
.total span {
  color: #4caf50;
}
.dashboard-chart-header {
  display: flex;
  justify-content: space-between;
  margin: 20px 0 40px;
}
.dashboard-chart-header p,
h3 {
  margin: 0;
}
.space {
  margin-bottom: 50px;
}
select {
  /* background: url(http://127.0.0.1:8000/img/dropdown-arrow.7cfba250.svg), #fff; */
  background-position-x: 0%, 0%;
  background-position-y: 0%, 0%;
  background-repeat: repeat, repeat;
  background-size: auto, auto;
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: auto 20%;
  height: 45px;
  padding: 5px 30px 5px 10px;
  color: #9c9c9c;
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: 1px solid #c9c9c9 !important;
  border-radius: 7.79618px;
}
</style>
