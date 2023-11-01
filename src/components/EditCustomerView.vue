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

const formSchema = toTypedSchema(
  z.object({
    firstname: z.string(),
    lastname: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string().email('Please enter a valid email address').min(5),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password can be at most 50 characters')
  })
)

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
  //   authStore.login(values)
})
</script>

<template>
  <DrawerView
    drawerTitle="Select products"

    stateKey="showEditCustomerView"
  >
    <div class="p-4">
      <h2 class="text-center font-medium text-lg">Edit Customer</h2>

      <form @submit="onSubmit" class="mt-10">
        <div class="flex gap-2">
          <FormField v-slot="{ componentField }" name="firstname">
            <FormItem>
              <FormLabel
                ><span class="text-secondary text-base font-light">First Name</span></FormLabel
              >
              <FormControl>
                <Input id="username" type="email" class="mt-3 mb-4" v-bind="componentField">
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
                <Input id="username" type="email" class="mt-3 mb-4" v-bind="componentField">
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
              <Input id="address" type="address" class="mt-3 mb-4" v-bind="componentField">
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
              <Input id="phone" type="phone" class="mt-3 mb-4" v-bind="componentField">
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
