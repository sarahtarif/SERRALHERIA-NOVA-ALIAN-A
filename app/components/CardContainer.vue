<template>
  <div
    :id="`card-container-${id}`"
    class="group/card"
    style="perspective: 1000px;"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div
      ref="inner"
      class="transition-transform duration-200 ease-out"
      :style="transformStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CardContainer',
  props: {
    id: { type: String, required: true },
  },
  setup() {
    const rotateX = ref(0)
    const rotateY = ref(0)
    const inner = ref<HTMLElement | null>(null)

    const transformStyle = computed(() =>
      `transform: rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg);`
    )

    function onMouseMove(e: MouseEvent) {
      const el = inner.value?.parentElement
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      rotateY.value = ((x / rect.width) - 0.5) * 10
      rotateX.value = -((y / rect.height) - 0.5) * 10
    }

    function onMouseLeave() {
      rotateX.value = 0
      rotateY.value = 0
    }

    return { inner, transformStyle, onMouseMove, onMouseLeave }
  },
})
</script>
