<template>
  <div
    :id="`trust-card-${icon}`"
    class="glass-panel p-6 rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all group"
  >
    <div
      class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors"
      :class="accent === 'secondary'
        ? 'bg-secondary-container/10 group-hover:bg-secondary-container/20'
        : 'bg-primary/10 group-hover:bg-primary/20'"
    >
      <span
        class="material-symbols-outlined"
        :class="accent === 'secondary' ? 'text-secondary' : 'text-primary'"
      >{{ icon }}</span>
    </div>
    <h3 class="font-headline font-bold text-lg mb-1 text-on-surface">{{ title }}</h3>
    <p class="text-xs text-on-surface-variant leading-snug">{{ description }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TrustCard',
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    accent: { type: String as () => 'primary' | 'secondary', default: 'primary' },
  },
})
</script>
