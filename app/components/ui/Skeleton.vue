<template>
  <div class="animate-pulse rounded-lg bg-secondary-200" :class="className">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: ''
})
</script>
