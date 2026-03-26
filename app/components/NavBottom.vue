<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'

const router = useRouter()
const config = useRuntimeConfig()
const active = ref<string>('home')

// Scroll suave para uma seção pelo ID
function scrollTo(id: string): void {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function goHome(): void {
  active.value = 'home'
  // Se não estiver na home, navega primeiro
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goProjetos(): void {
  active.value = 'projetos'
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => setTimeout(() => scrollTo('projetos'), 200))
  } else {
    scrollTo('projetos')
  }
}

function goServicos(): void {
  active.value = 'servicos'
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => setTimeout(() => scrollTo('services-grid'), 200))
  } else {
    scrollTo('services-grid')
  }
}

function goOrcamento(): void {
  active.value = 'orcamento'
  const numero = config.public.whatsappNumber as string
  const msg = encodeURIComponent('Olá, gostaria de solicitar um orçamento.')
  window.open('https://wa.me/' + numero + '?text=' + msg, '_blank')
}

function goCliente(): void {
  active.value = 'cliente'
  router.push('/login')
}

// Atualiza item ativo conforme scroll
function onScroll(): void {
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
    id="nav-bottom"
    class="fixed bottom-0 w-full z-50 flex justify-around items-center px-2 h-16"
    style="background:rgba(6,20,35,0.92); backdrop-filter:blur(20px); border-top:1px solid rgba(255,255,255,0.07);"
  >
    <!-- Home -->
    <button
      class="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-2 rounded-xl transition-all active:scale-90"
      :style="active === 'home' ? 'color:#6366f1;' : 'color:#64748b;'"
      @click="goHome"
    >
      <span class="material-symbols-outlined text-[22px]" :style="active === 'home' ? 'font-variation-settings:\'FILL\' 1' : ''">home</span>
      <span class="text-[10px] font-medium leading-none">Home</span>
    </button>

    <!-- Nossos Projetos -->
    <button
      class="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-2 rounded-xl transition-all active:scale-90"
      :style="active === 'projetos' ? 'color:#6366f1;' : 'color:#64748b;'"
      @click="goProjetos"
    >
      <span class="material-symbols-outlined text-[22px]" :style="active === 'projetos' ? 'font-variation-settings:\'FILL\' 1' : ''">photo_library</span>
      <span class="text-[10px] font-medium leading-none">Projetos</span>
    </button>

    <!-- Serviços -->
    <button
      class="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-2 rounded-xl transition-all active:scale-90"
      :style="active === 'servicos' ? 'color:#6366f1;' : 'color:#64748b;'"
      @click="goServicos"
    >
      <span class="material-symbols-outlined text-[22px]" :style="active === 'servicos' ? 'font-variation-settings:\'FILL\' 1' : ''">settings_input_component</span>
      <span class="text-[10px] font-medium leading-none">Serviços</span>
    </button>

    <!-- Orçamento -->
    <button
      class="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-2 rounded-xl transition-all active:scale-90"
      :style="active === 'orcamento' ? 'color:#25d366;' : 'color:#64748b;'"
      @click="goOrcamento"
    >
      <span class="material-symbols-outlined text-[22px]" :style="active === 'orcamento' ? 'font-variation-settings:\'FILL\' 1' : ''">description</span>
      <span class="text-[10px] font-medium leading-none">Orçamento</span>
    </button>

    <!-- Cliente -->
    <button
      class="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-2 rounded-xl transition-all active:scale-90"
      :style="active === 'cliente' ? 'color:#6366f1;' : 'color:#64748b;'"
      @click="goCliente"
    >
      <span class="material-symbols-outlined text-[22px]" :style="active === 'cliente' ? 'font-variation-settings:\'FILL\' 1' : ''">person</span>
      <span class="text-[10px] font-medium leading-none">Cliente</span>
    </button>
  </nav>
</template>
