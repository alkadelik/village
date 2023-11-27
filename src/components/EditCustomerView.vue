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
import { updateCustomer } from '@/services/apiServices'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const formSchema = toTypedSchema(
  z.object({
    firstname: z.string(),
    lastname: z.string(),
    address: z.string(),
    phone: z.number(),
    email: z.string().email('Please enter a valid email address').min(5)
  })
)

const props = defineProps(['customer'])
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    ...props.customer,
    phone: Number(props.customer.phone),
    firstname: props.customer.first_name,
    lastname: props.customer.last_name,
    address: props.customer.line1
  }
})

function editCustomer(updatedCustomer) {
  updateCustomer(updatedCustomer, props.customer.id).then((res) => {
    // console.log(res.data)
    const index = appStore.state.customers.findIndex(obj => obj.id === res.data.id);

  // If the object with the specified id is found, replace it with the newObject
  if (index !== -1) {
    appStore.state.customers[index] = res.data;
  }
    
    // give feedback
  })
}

const onSubmit = form.handleSubmit((values) => {
  let formattedValues = {
    ...values,
    phone: String(values.phone),
    first_name: values.firstname,
    last_name: values.lastname,
    line1: values.address
  }
  console.log('Form submitted!', formattedValues, values)
  editCustomer(formattedValues)
  //   authStore.login(values)
})
</script>

<template>
  <DrawerView drawerTitle="Select products" stateKey="showEditCustomerView">
    <div class="p-4">
      <h2 class="text-center font-medium text-lg">Edit Customer</h2>
      <!-- {{ customer }} -->
      <form @submit="onSubmit" class="mt-10">
        <div class="flex gap-2">
          <FormField v-slot="{ componentField }" name="firstname">
            <FormItem>
              <FormLabel
                ><span class="text-secondary text-base font-light">First Name</span></FormLabel
              >
              <FormControl>
                <Input id="firstname" type="text" class="mt-3 mb-4" v-bind="componentField">
                  <!-- <EnvelopeIcon class="icon w-6 h-6 absolute top-2 left-2" /> -->
                </Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastname">
            <FormItem>
              <FormLabel
                ><span class="text-secondary text-base font-light">Last Name</span></FormLabel
              >
              <FormControl>
                <Input id="lastname" type="text" class="mt-3 mb-4" v-bind="componentField">
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
              <Input id="address" type="text" class="mt-3 mb-4" v-bind="componentField">
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

        <button class="w-full">
          <Button type="submit" class="w-full mt-6 font-bold text-white" size="lg">
            Save Customer
          </Button>
        </button>
      </form>
    </div>
  </DrawerView>
</template>

<style scoped></style>
