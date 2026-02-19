<template>
  <input
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :class="inputClass"
    :disabled="disabled"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: string
  modelValue?: string | number
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  error: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClass = computed(() => {
  const base = 'flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-base transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  
  if (props.error) {
    return `${base} border-danger-500 focus-visible:ring-danger-500`
  }
  
  return `${base} border-border-DEFAULT focus-visible:ring-primary-500`
})
</script>
