<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'info' | 'warning' | 'danger' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium'
  
  const variants = {
    default: 'bg-primary/10 text-primary',
    info: 'bg-info/10 text-info',
    warning: 'bg-accent/10 text-accent',
    danger: 'bg-danger/10 text-danger',
    success: 'bg-success/10 text-success'
  }
  
  return `${base} ${variants[props.variant]}`
})
</script>
