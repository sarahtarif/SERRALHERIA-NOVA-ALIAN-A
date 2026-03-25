<template>
  <nav id="nav-top" class="fixed top-0 w-full z-50 bg-[#061423]/80 backdrop-blur-xl">
    <div class="flex justify-between items-center px-6 py-4">
      <NuxtLink to="/">
        <img src="/images/logo.png" alt="Serralheria Nova Aliança" class="h-10 w-auto" />
      </NuxtLink>
      <button class="text-primary p-1" aria-label="Abrir menu" @click="menuOpen = !menuOpen">
        <span class="material-symbols-outlined">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <!-- Menu dropdown mobile -->
    <div v-if="menuOpen" class="bg-surface-container border-t border-outline-variant px-6 py-4 flex flex-col gap-4">
      <NuxtLink to="/" class="text-on-surface font-medium py-1" @click="menuOpen = false">Início</NuxtLink>
      <NuxtLink to="/sobre" class="text-on-surface-variant py-1" @click="menuOpen = false">Sobre</NuxtLink>
      <NuxtLink to="/trabalhos" class="text-on-surface-variant py-1" @click="menuOpen = false">Portfólio</NuxtLink>
      <NuxtLink to="/login" class="text-primary font-medium py-1" @click="menuOpen = false">Área do Cliente</NuxtLink>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NuxtLink } from '#components'

export default defineComponent({
  name: 'NavTop',
  components: { NuxtLink },
  setup() {
    const menuOpen = ref(false)
    return { menuOpen }
  },
})
</script>
