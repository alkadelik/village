<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  hasPrefix?: boolean
  type?: string
  placeholder?: string
  handleChange?: () => void
  handleKeyup?: () => void
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
<div class="input-container relative">
  <input v-model="modelValue" :type="type ?? 'text'" @keyup="handleKeyup" @change="handleChange" :placeholder="placeholder ?? ''" :class="cn(`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${hasPrefix ? 'pl-10' : ''}`, $attrs.class ?? '')">
<slot></slot>
</div>
</template>
