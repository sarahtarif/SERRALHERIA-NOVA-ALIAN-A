<template>
  <nav id="nav-desktop" class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-2xl shadow-blue-900/20">
    <div class="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
      <NuxtLink to="/">
        <img src="/images/logo.png" alt="Nova Aliança" class="h-10 w-auto" />
      </NuxtLink>
      <div class="flex items-center gap-8 font-headline tracking-tight">
        <NuxtLink to="/" class="text-blue-200 border-b-2 border-secondary-container pb-1">Início</NuxtLink>
        <NuxtLink to="/#gallery-section" class="text-on-surface-variant hover:text-on-surface transition-colors">Serviços</NuxtLink>
        <NuxtLink to="/sobre" class="text-on-surface-variant hover:text-on-surface transition-colors">Sobre</NuxtLink>
        <NuxtLink to="/trabalhos" class="text-on-surface-variant hover:text-on-surface transition-colors">Portfólio</NuxtLink>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/login"
          class="border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Área do Cliente
        </NuxtLink>
        <button
          class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-md font-label font-medium text-sm transition-transform hover:scale-100 active:scale-90 scale-95 shadow-lg shadow-primary/10"
        >
          Solicitar Orçamento
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NuxtLink } from '#components'

export default defineComponent({
  name: 'NavDesktop',
  components: { NuxtLink },
})
</script>
