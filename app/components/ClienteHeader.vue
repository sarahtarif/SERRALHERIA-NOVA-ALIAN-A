<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import ClientePerfil from '~/components/ClientePerfil.vue'

const { user, logout } = useAuth()
const showProfile = ref(false)

const initials = computed(() => {
  const email = user.value?.email ?? ''
  return email.charAt(0).toUpperCase()
})
</script>

<template>
  <header id="cliente-header" class="w-full bg-surface-container border-b border-outline-variant px-6 py-1 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <img src="/images/logo.png" alt="Nova Aliança" class="h-20 w-auto" />
      <span class="text-on-surface font-semibold text-lg">Área do Cliente</span>
    </div>

    <div class="flex items-center gap-3">
      <!-- Avatar / botão perfil -->
      <button
        id="btn-perfil"
        class="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center hover:brightness-110 transition-all ring-2 ring-primary/30"
        @click="showProfile = true"
      >
        {{ initials }}
      </button>

      <!-- Botão sair -->
      <button
        id="btn-sair"
        class="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors text-sm"
        @click="logout"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Sair
      </button>
    </div>

    <ClientePerfil v-if="showProfile" @close="showProfile = false" />
  </header>
</template>
