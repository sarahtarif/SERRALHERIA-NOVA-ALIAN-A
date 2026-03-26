<script setup lang="ts">
import { ref } from 'vue'
import { useNavigation } from '~/composables/useNavigation'

const { goHome, goSobre, goProjetos, goServicos, goOrcamento, goCliente } = useNavigation()
const menuOpen = ref(false)

function close(): void { menuOpen.value = false }

function action(fn: () => void): void {
  fn()
  close()
}
</script>

<template>
  <nav id="nav-top" class="fixed top-0 w-full z-50 bg-[#061423]/80 backdrop-blur-xl">
    <div class="flex justify-between items-center px-6 py-4">
      <button @click="action(goHome)" class="focus:outline-none">
        <img src="/images/logo.png" alt="Serralheria Nova Aliança" class="h-10 w-auto" />
      </button>
      <button class="text-primary p-1" aria-label="Abrir menu" @click="menuOpen = !menuOpen">
        <span class="material-symbols-outlined">{{ menuOpen ? 'close' : 'menu' }}</span>
      </button>
    </div>

    <!-- Drawer -->
    <Transition name="drawer">
      <div
        v-if="menuOpen"
        class="bg-surface-container border-t border-outline-variant/20 px-6 py-4 flex flex-col gap-1"
      >
        <button
          class="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-on-surface font-medium hover:bg-primary/10 transition-colors active:scale-95"
          @click="action(goHome)"
        >
          <span class="material-symbols-outlined text-primary text-[20px]">home</span>
          Início
        </button>

        <button
          class="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-on-surface transition-colors active:scale-95"
          @click="action(goSobre)"
        >
          <span class="material-symbols-outlined text-[20px]">info</span>
          Sobre
        </button>

        <button
          class="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-on-surface transition-colors active:scale-95"
          @click="action(goProjetos)"
        >
          <span class="material-symbols-outlined text-[20px]">photo_library</span>
          Nossos Projetos
        </button>

        <button
          class="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-on-surface transition-colors active:scale-95"
          @click="action(goServicos)"
        >
          <span class="material-symbols-outlined text-[20px]">settings_input_component</span>
          Serviços
        </button>

        <button
          class="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-on-surface-variant hover:bg-primary/10 hover:text-on-surface transition-colors active:scale-95"
          @click="action(goOrcamento)"
        >
          <span class="material-symbols-outlined text-[20px]">description</span>
          Solicitar Orçamento
        </button>

        <div class="my-1 border-t border-outline-variant/20" />

        <button
          class="flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl text-primary font-medium hover:bg-primary/10 transition-colors active:scale-95"
          @click="action(goCliente)"
        >
          <span class="material-symbols-outlined text-[20px]">person</span>
          Área do Cliente
        </button>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
