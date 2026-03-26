<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useSiteConfig } from './composables/useSiteConfig'

export default defineComponent({
  name: 'App',
  setup() {
    const { carregar } = useSiteConfig()
    onMounted(() => carregar())
  },
})
</script>
