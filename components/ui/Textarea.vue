<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="textareaClass"
    :disabled="disabled"
    :rows="rows"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  disabled?: boolean
  error?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  error: false,
  rows: 4
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaClass = computed(() => {
  const base = 'flex min-h-[80px] w-full rounded-lg border bg-white px-4 py-3 text-base transition-all placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y'
  
  if (props.error) {
    return `${base} border-danger-500 focus-visible:ring-danger-500`
  }
  
  return `${base} border-border-DEFAULT focus-visible:ring-primary-500`
})
</script>
