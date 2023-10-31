<script setup lang="ts">
import { useForm } from 'vee-validate'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import {useToast} from 'vue-toast-notification';
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { useAuthStore } from '../stores/auth';
import { computed } from 'vue'

const $toast = useToast();
const authStore = useAuthStore()


const formSchema = toTypedSchema(
  z.object({
    username: z.string().email('Please enter a valid email address').min(5),
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
  authStore.login(values)
  
})
</script>

<template>
  <div class=" mx-auto px-4 shadow-lg h-screen">
    <div class="image-container -mx-4"></div>
    <h1 class="text-secondary font-bold text-3xl mt-20">Welcome back</h1>
    <p class="text-secondary text-sm">Enter your email and password to log in</p>

    <form @submit="onSubmit" class="mt-10">
      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormLabel><span class="text-secondary text-base font-light">Email Address</span></FormLabel>
          <FormControl>
            <Input id="username" type="email" hasPrefix class="mt-3 mb-4" v-bind="componentField">
              <EnvelopeIcon class="icon w-6 h-6 absolute top-2 left-2" />
            </Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel><span class="text-secondary text-base font-light">Password</span></FormLabel>
          <FormControl>
            <Input id="password" type="password" hasPrefix class="mt-3 mb-4" v-bind="componentField"
              ><LockClosedIcon class="icon w-6 h-6 absolute top-2 left-2"
            /></Input>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex justify-end">
      <Button variant="link" class="text-right">Forgot password</Button>

      </div>

      <Button type="submit" class="w-full mt-6 font-bold " size="lg"> Login </Button>
    </form>
  </div>
</template>

<style scoped>
.image-container {
  height: 200px;
  background-image: url('../assets/images/leyyow-banner.png');
  background-size: cover;
  background-position: center;
}
</style>
