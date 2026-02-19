<template>
  <label class="block text-sm font-semibold text-text-primary mb-2 cursor-pointer">
    <slot />
  </label>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Label'
})
</script>
