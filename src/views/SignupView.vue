<script setup lang="ts">
import { useForm } from 'vee-validate'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import { computed, ref } from 'vue'
import axios from 'axios'

const $toast = useToast()
const authStore = useAuthStore()

const step = ref(0)
const store_slug = ref('')

const cleanSlug = (str) => {
  return (
    str
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') //remove diacritics
      .toLowerCase()
      .replace(/\s+/g, '-') //spaces to dashes
      .replace(/_/g, '-') //underscore to dashes
      .replace(/&/g, '-and-') //ampersand to and
      .replace(/[^\w-]+/g, '') //remove non-words
      .replace(/--+/g, '-') //collapse multiple dashes
      // .replace(/\-\-+/g, '-') //collapse multiple dashes
      .replace(/^-+/, '')
  ) //trim starting dash
}

const store_link = computed(() => (store_slug.value !== '' ? store_slug.value + '.leyyow.com' : ''))

const formSchema = toTypedSchema(
  z.object({
    store_name: z.string(),
    business_type: z.string(),
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

  
  authStore.register({...values, store_slug: store_slug.value})
})

const store_types = ref([
  // get this from API (not built yet)
  // {name: "Food", type: 0}, doesn't recognise as true
  { name: 'Food', type: '6' },
  { name: 'Fashion & Accessories', type: '1' },
  { name: 'Health & Beauty', type: '2' },
  { name: 'Gadgets & Electronics', type: '3' },
  { name: 'Events', type: '4' },
  { name: 'Other', type: '5' }
])

const createAccount = () => {
  // e.preventDefault()

  if (this.step1 && this.step2 == true) {
    let data = {
      email: this.email.trim().toLowerCase(),
      password: this.password
    }
    signUp(data)
      .then((res) => {
        window.sessionStorage.setItem('leyyow_token', res.data.token)
        axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`

        let data = {
          store_name: this.store_name,
          slug: this.store_slug,
          business_type: this.store_type
        }
        createStore(data)
      })
      .catch(() => {
        EventBus.$emit('open_alert', 'error', 'Signup error')
      })
      .finally(() => {
        this.loading = false
        this.$router.push('/dash')
        EventBus.$emit('open_alert', 'success', 'Sign up successful')
      })
  }
}
</script>

<template>
  <div class="flex h-screen ">
    <div class="w-6/12 hidden left md:flex justify-center items-center">
      <div class="text-white text-center w-5/12">
        <div class="flex justify-center">
          <img src="@/assets/images/store-icon.png" class="w-60" alt="" />
        </div>
        <h2 class="font-bold text-lg mb-4">Seamless online store</h2>
        <p class="text-slate-100">Generate business model with no hustle and headache</p>
      </div>
    </div>
    <div class="w-full md:w-6/12 flex justify-center h-full bg-slate-100">
      <div class="md:w-8/12 w-full">
        <div class="mx-auto md:mx-0 px-4 md:shadow-none shadow-lg">
          <div class="image-container -mx-4 md:hidden"></div>
          <h2 class="font-bold text-primary text-lg my-6">Leyyow</h2>
          <h1 class="font-bold text-3xl mt-12 md:mt-0 md:mb-4">Welcome back</h1>
          <p class="text-secondary text-sm">Enter your email and password to log in.</p>
          <div class="bg-white py-6 px-6 md:px-8 rounded-t-2xl mt-12 md:h-full pb-44">
            <form @submit="onSubmit" class="md:mt-0 mt-10">
              <div class="flex items-center justify-center mb-8">
                <span
                  :class="`${
                    step == 0 && 'border-primary text-primary'
                  } border py-1 px-3 rounded-md cursor-pointer`"
                  @click="step = 0"
                  >1</span
                >
                <hr class="w-4/12 text-secondary" />
                <span
                  :class="`${
                    step == 1 && 'border-primary text-primary'
                  } border py-1 px-3 rounded-md cursor-pointer`"
                  @click="step = 1"
                  >2</span
                >
              </div>

              <div v-show="step == 0">
                <FormField v-slot="{ componentField }" name="store_name">
                  <FormItem>
                    <FormLabel
                      ><span class="text-secondary text-base font-light"
                        >Store name</span
                      ></FormLabel
                    >
                    <FormControl>
                      <Input id="store_name" type="text" class="mt-3 mb-4" v-bind="componentField">
                        <!-- <EnvelopeIcon class="icon w-6 h-6 absolute top-2 left-2" /> -->
                      </Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="store_link">
                  <FormItem>
                    <FormLabel
                      ><span class="text-secondary text-base font-light"
                        >Store link</span
                      ></FormLabel
                    >
                    <FormControl>
                      <Input
                        :handleKeyup="(e) => (store_slug = cleanSlug(e.target.value))"
                        id="store_link"
                        type="text"
                        class="mt-3 mb-4"
                        v-bind="componentField"
                      >
                        <!-- <EnvelopeIcon class="icon w-6 h-6 absolute top-2 left-2" /> -->
                      </Input>
                      <p class="text-slate-500">{{ store_link }}</p>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="business_type">
                  <FormItem>
                    <FormLabel
                      ><span class="text-secondary text-base font-light"
                        >Store Type</span
                      ></FormLabel
                    >
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger>
                          <SelectValue placeholder="Select store type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Store type</SelectLabel>
                            <SelectItem
                              v-for="item in store_types"
                              :key="item.type"
                              :value="item.type"
                            >
                              {{ item.name }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <Button @click="step = 1" class="w-full mt-6 font-bold" size="lg">
                  Continue
                </Button>
              </div>

              <div v-show="step == 1">
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
                <Button type="submit" class="w-full mt-6 font-bold" size="lg">
                  Take me to my store
                </Button>
              </div>

              <p class="text-center my-2">
                Already have an account?
                <router-link to="/login"
                  ><span class="text-primary hover:underline">Login</span>
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
