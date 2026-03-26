<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNavigation } from '~/composables/useNavigation'

const { goHome, goSobre, goProjetos, goServicos, goOrcamento, goCliente } = useNavigation()

const active = ref<string>('home')
const scrolled = ref(false)

function onScroll(): void {
  scrolled.value = window.scrollY > 20
  const y = window.scrollY
  if (y < 100) { active.value = 'home'; return }
  const projetosEl = document.getElementById('projetos')
  const servicosEl = document.getElementById('services-grid')
  if (projetosEl && y >= projetosEl.offsetTop - 120) { active.value = 'projetos'; return }
  if (servicosEl && y >= servicosEl.offsetTop - 120) { active.value = 'servicos'; return }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <nav
    id="nav-desktop"
    class="fixed top-0 w-full z-50 transition-all duration-300"
    :style="scrolled
      ? 'background:rgba(6,20,35,0.95); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.07);'
      : 'background:transparent; backdrop-filter:blur(0px);'"
  >
    <div class="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">

      <!-- Logo -->
      <button @click="goHome" class="focus:outline-none flex-shrink-0">
        <img
          src="/images/logo.png"
          alt="Nova Aliança"
          style="height:80px; width:auto; position:absolute; top:50%; transform:translateY(calc(-50% + 12px));"
        />
      </button>

      <!-- Links centrais -->
      <div class="flex items-center gap-1 font-headline tracking-tight ml-28">
        <button
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
          :class="active === 'home' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'"
          @click="goHome"
        >
          Início
        </button>

        <button
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5 text-on-surface-variant hover:text-on-surface"
          @click="goSobre"
        >
          Sobre
        </button>

        <button
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
          :class="active === 'projetos' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'"
          @click="goProjetos"
        >
          Projetos
        </button>

        <button
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
          :class="active === 'servicos' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'"
          @click="goServicos"
        >
          Serviços
        </button>
      </div>

      <!-- Ações direita -->
      <div class="flex items-center gap-3">
        <button
          class="border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
          @click="goCliente"
        >
          Área do Cliente
        </button>
        <button
          class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-md font-medium text-sm transition-all duration-200 hover:brightness-110 active:scale-95 shadow-lg shadow-primary/10 cursor-pointer"
          @click="goOrcamento"
        >
          Solicitar Orçamento
        </button>
      </div>

    </div>
  </nav>
</template>
