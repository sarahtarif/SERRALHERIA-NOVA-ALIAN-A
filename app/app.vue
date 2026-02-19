<template>
  <div class="min-h-screen bg-white">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <WhatsAppFloatingButton />
  </div>
</template>

<script setup lang="ts">
import { inject } from '@vercel/analytics'

inject()

useHead({
  htmlAttrs: { lang: 'pt-BR' },
  titleTemplate: '%s | Serralheria Nova Aliança',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#0056e0' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>
