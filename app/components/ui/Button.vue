<template>
  <component
    :is="as"
    :class="buttonClass"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  as?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  as: 'button',
  disabled: false
})

const buttonClass = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer'
  
  const variants = {
    default: 'bg-primary-500 text-white hover:bg-primary-600 shadow-metal',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'hover:bg-primary-50 text-primary-600',
    link: 'text-primary-500 underline-offset-4 hover:underline',
    destructive: 'bg-danger-500 text-white hover:bg-danger-600 shadow-metal'
  }
  
  const sizes = {
    default: 'h-12 px-6 py-3',
    sm: 'h-9 px-4 text-sm',
    lg: 'h-14 px-8 text-lg',
    icon: 'h-12 w-12'
  }
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>
