<template>
  <div class="bg-white rounded-xl shadow-metal border border-border-light overflow-hidden transition-all hover:shadow-metal-lg">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Card'
})
</script>
