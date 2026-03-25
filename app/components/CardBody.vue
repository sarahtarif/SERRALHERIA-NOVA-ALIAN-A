<template>
  <div
    id="card-body"
    class="relative bg-surface-container-low rounded-2xl border border-outline-variant/15 hover:border-primary/20 transition-all duration-300 overflow-hidden"
    style="transform-style: preserve-3d;"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardBody',
})
</script>
