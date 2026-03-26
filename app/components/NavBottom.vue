<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNavigation } from '~/composables/useNavigation'

const { goHome, goProjetos, goServicos, goOrcamento, goCliente } = useNavigation()
const active = ref<string>('home')

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
