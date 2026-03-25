<template>
  <div id="login-page" class="min-h-screen bg-surface flex flex-col">

    <!-- Header simples -->
    <header class="px-6 py-4 border-b border-outline-variant">
      <NuxtLink to="/">
        <img src="/images/logo.png" alt="Nova Aliança" class="h-10 w-auto" />
      </NuxtLink>
    </header>

    <!-- Conteúdo centralizado -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">

        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold font-headline text-on-surface mb-2">Área do Cliente</h1>
          <p class="text-on-surface-variant text-sm">Acesse sua conta ou crie uma nova</p>
        </div>

        <div class="bg-surface-container border border-outline-variant rounded-xl p-8">
          <LoginForm />
        </div>

        <p class="text-center mt-6 text-sm text-on-surface-variant">
          <NuxtLink to="/" class="text-primary hover:underline">← Voltar ao site</NuxtLink>
        </p>

      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { NuxtLink } from '#components'
import LoginForm from '../components/LoginForm.vue'
import { useAuth } from '../composables/useAuth'

const { init } = useAuth()
onMounted(() => init())
</script>
