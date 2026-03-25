<template>
  <div
    :id="`feature-card-${icon}`"
    class="bg-surface-container-low p-5 rounded-lg border-l-4 border-primary"
  >
    <div class="flex items-start gap-4">
      <div class="bg-surface-container-highest p-2 rounded-md">
        <span class="material-symbols-outlined text-primary">{{ icon }}</span>
      </div>
      <div>
        <h3 class="font-headline text-on-surface font-bold">{{ title }}</h3>
        <p class="text-sm text-on-surface-variant">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FeatureCard',
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
})
</script>
