<script setup lang="ts">
import { watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'

import { useAuthStore } from '../stores/auth'
import DrawerView from '@/components/DrawerView.vue'
import { Button } from '@/components/ui/button'
import { computed, onMounted, ref } from 'vue'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { saveCustomer } from '@/services/apiServices'
import { useToast } from 'vue-toast-notification'
import { useAppStore } from '../stores/app'

const authStore = useAuthStore()
const appStore = useAppStore()
const $toast = useToast()

const formSchema = toTypedSchema(
  z.object({
    first_name: z.string(),
    last_name: z.string(),
    address: z.string(),
    city: z.string(),
    phone: z.number(),
    email: z.string().email('Please enter a valid email address').min(5),
  })
)

const form = useForm({
  validationSchema: formSchema
})
const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)

  		saveCustomer({...values, line1: ''})
			.then((res) => {
				// this.new_customer_id = res.data.customer.id
				authStore.state.customers.push(res.data.customer)
        $toast.success("Customer createed successfully")
    appStore.showAddCustomerView = false

			})
      .catch(() =>{
        $toast.error("Something went wrong")

      })
  //   authStore.login(values)
})
</script>

<template>
  <DrawerView drawerTitle="Select products" stateKey="showAddCustomerView">
    <div class="p-4">
      <h2 class="text-center font-medium text-lg">Add Customer</h2>

      <form @submit="onSubmit" class="mt-10">
        <div class="flex gap-2">
          <FormField v-slot="{ componentField }" name="first_name">
            <FormItem>
              <FormLabel
                ><span class="text-secondary text-base font-light">First Name</span></FormLabel
              >
              <FormControl>
                <Input
                  id="username"
                  type="text"
                  
                  class="mt-3 mb-4"
                  v-bind="componentField"
                >
                  <!-- <EnvelopeIcon class="icon w-6 h-6 absolute top-2 left-2" /> -->
                </Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="last_name">
            <FormItem>
              <FormLabel
                ><span class="text-secondary text-base font-light">Last Name</span></FormLabel
              >
              <FormControl>
                <Input
                  id="username"
                  type="text"
                
                  class="mt-3 mb-4"
                  v-bind="componentField"
                >
                  <!-- <EnvelopeIcon class="icon w-6 h-6 absolute top-2 left-2" /> -->
                </Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel
              ><span class="text-secondary text-base font-light">Email Address</span></FormLabel
            >
            <FormControl>
              <Input id="email" type="email" class="mt-3 mb-4" v-bind="componentField">
                <!-- <LockClosedIcon class="icon w-6 h-6 absolute top-2 left-2"
              /> -->
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="address">
          <FormItem>
            <FormLabel><span class="text-secondary text-base font-light">address</span></FormLabel>
            <FormControl>
              <Input
                id="address"
                type="text"
            
                class="mt-3 mb-4"
                v-bind="componentField"
              >
                <!-- <LockClosedIcon class="icon w-6 h-6 absolute top-2 left-2"
              /> -->
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
          <FormField v-slot="{ componentField }" name="city">
          <FormItem>
            <FormLabel><span class="text-secondary text-base font-light">city</span></FormLabel>
            <FormControl>
              <Input
                id="address"
                type="text"
            
                class="mt-3 mb-4"
                v-bind="componentField"
              >
                <!-- <LockClosedIcon class="icon w-6 h-6 absolute top-2 left-2"
              /> -->
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel><span class="text-secondary text-base font-light">Phone</span></FormLabel>
            <FormControl>
              <Input id="phone" type="number" class="mt-3 mb-4" v-bind="componentField">
                <!-- <LockClosedIcon class="icon w-6 h-6 absolute top-2 left-2"
              /> -->
              </Input>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full mt-6 font-bold" size="lg"> Save Customer </Button>
      </form>
    </div>
  </DrawerView>
</template>

<style scoped></style>
