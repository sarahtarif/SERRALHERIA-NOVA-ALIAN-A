<template>
  <div
    :id="`card-item-${translateZ}`"
    :style="`transform: translateZ(${translateZ}px);`"
    style="transform-style: preserve-3d;"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardItem',
  props: {
    translateZ: { type: Number, default: 0 },
  },
})
</script>
