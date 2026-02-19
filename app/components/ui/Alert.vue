<template>
  <div :class="alertClass" role="alert">
    <div v-if="$slots.icon" class="flex-shrink-0">
      <slot name="icon" />
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const alertClass = computed(() => {
  const base = 'flex items-start gap-3 rounded-lg p-4 border-l-4'
  
  const variants = {
    default: 'bg-primary-50 border-primary-500 text-primary-800',
    success: 'bg-success-50 border-success-500 text-success-800',
    warning: 'bg-warning-50 border-warning-500 text-warning-800',
    danger: 'bg-danger-50 border-danger-500 text-danger-800',
    info: 'bg-info-50 border-info-500 text-info-800'
  }
  
  return `${base} ${variants[props.variant]}`
})
</script>
