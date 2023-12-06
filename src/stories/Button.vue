<template>
  <Button type="button" :variant="variant" :size="size" :backgroundColor="primary" :class="classes" @click="onClick"
    :style="style">
    <Icon v-if="loading" icon="svg-spinners:180-ring" /> <span v-else>{{ !loading && label }}</span>
  </Button>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'

// import './button.css'
import '../assets/main.css'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the button
     */
    label: string
    /**
     * primary or secondary button
     */
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    /**
     * size of the button
     */
    size?: 'sm' | 'md' | 'lg'
    /**
     * background color of the button
     */
    backgroundColor?: string
    /**
     * loading state of the button
     */
    loading?: boolean
    /**
     * click handler of the button
     */
    onClick?: { action: string }
    /**
     * click handler of the button
     */
    class?: string
  }>(),
  { variant: 'default' }
)

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

const classes = computed(function () {
  return ({
    'w-full': true,
    //   'storybook-button--primary': props.primary,
    //   'storybook-button--secondary': !props.primary,
    [`bg-${props.backgroundColor || 'primary'}`]: true,
    [`${this.class}`]: true
  })
})

const style = computed(() => ({
  backgroundColor: props.backgroundColor
}))

const onClick = () => {
  emit('click', 1)
}
</script>
