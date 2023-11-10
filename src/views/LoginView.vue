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
import { useToast } from 'vue-toast-notification'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { useAuthStore } from '../stores/auth'
import { computed } from 'vue'

const $toast = useToast()
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
  //console.log('Form submitted!', values)
  authStore.login(values)
})
</script>

<template>
  <div class="flex">
    <div class="w-6/12 hidden left md:flex justify-center items-center">
      <div class="text-white text-center w-5/12">
        <div class="flex justify-center">
          <img src="@/assets/images/store-icon.png" class="w-60" alt="" />
        </div>
        <h2 class="font-bold text-lg mb-4">Welcome back</h2>
        <p class="text-slate-100">Enter your email and password to log in.</p>
      </div>
      <v-carousel show-arrows hide-delimiter-background>
        <template v-slot:prev="{ props }">
          <v-btn variant="elevated" color="success" @click="props.onClick">Previous slide</v-btn>
        </template>
        <template v-slot:next="{ props }">
          <v-btn variant="elevated" color="info" @click="props.onClick">Next slide</v-btn>
        </template>
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet :color="colors[i]" height="100%">
            <div class="d-flex fill-height justify-center align-center">
              <div class="text-h2">{{ slide }} Slide</div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="w-full md:w-6/12 flex justify-center h-full bg-slate-100">
      <div class="md:w-8/12">
        <div class="mx-auto px-4 md:shadow-none h-screen">
          <div class="image-container -mx-4 md:hidden"></div>
          <h2 class="font-bold text-primary text-lg my-6">Leyyow</h2>
          <h1 class="font-bold text-3xl mt-12 md:mt-0 md:mb-4">Create your store</h1>
          <p class="text-secondary text-sm">
            Enter your store name and link, and select your store type.
          </p>
          <div class="bg-white py-6 px-6 md:px-8 rounded-t-2xl mt-12 md:h-full">
            <form @submit="onSubmit" class="md:mt-0 mt-10">
              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel
                    ><span class="text-secondary text-base font-light"
                      >Email Address</span
                    ></FormLabel
                  >
                  <FormControl>
                    <Input
                      id="username"
                      type="email"
                      hasPrefix
                      class="mt-3 mb-4"
                      v-bind="componentField"
                    >
                      <EnvelopeIcon class="icon w-6 h-6 absolute top-2 left-2" />
                    </Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                  <FormLabel
                    ><span class="text-secondary text-base font-light">Password</span></FormLabel
                  >
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      hasPrefix
                      class="mt-3 mb-4"
                      v-bind="componentField"
                      ><LockClosedIcon class="icon w-6 h-6 absolute top-2 left-2"
                    /></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="flex justify-end">
                <router-link to="/forgot-password">
                  <Button variant="link" class="text-right text-primary">Forgot password</Button>
                </router-link>
              </div>

              <Button type="submit" class="w-full mt-6 font-bold" size="lg"> Login </Button>
              <p class="text-center my-2">
                Don't have an account?
                <router-link to="/signup"
                  ><span class="text-primary hover:underline">Sign up</span>
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left {
  background-image: url('../assets/images/auth-bg.png');
  background-size: cover;
  background-position: center;
}
.image-container {
  height: 200px;
  background-image: url('../assets/images/leyyow-banner.png');
  background-size: cover;
  background-position: center;
}
</style>
