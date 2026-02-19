<template>
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    :class="selectClass"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  error: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectClass = computed(() => {
  const base = 'flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10'
  
  if (props.error) {
    return `${base} border-danger-500 focus-visible:ring-danger-500`
  }
  
  return `${base} border-border-DEFAULT focus-visible:ring-primary-500`
})
</script>
