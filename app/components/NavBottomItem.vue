<template>
  <div
    :id="`nav-item-${icon}`"
    class="flex flex-col items-center gap-1"
    :class="active ? 'text-primary' : 'text-on-surface-variant'"
  >
    <span
      class="material-symbols-outlined"
      :style="filled ? `font-variation-settings: 'FILL' 1` : ''"
    >{{ icon }}</span>
    <span class="text-[10px]" :class="active ? 'font-bold' : ''">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBottomItem',
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    active: { type: Boolean, default: false },
    filled: { type: Boolean, default: false },
  },
})
</script>
