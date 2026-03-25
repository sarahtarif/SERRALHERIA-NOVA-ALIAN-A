<template>
  <section id="why-section" class="bg-surface-container-low py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Title -->
      <h2 class="font-headline font-bold text-3xl lg:text-4xl text-on-surface text-center mb-4">
        Por que escolher a Nova Aliança?
      </h2>

      <!-- Badges -->
      <div class="flex flex-wrap justify-center gap-6 mb-14">
        <span v-for="badge in badges" :key="badge" class="flex items-center gap-1.5 text-sm text-on-surface-variant">
          <span class="text-primary material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">check</span>
          {{ badge }}
        </span>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="item in items"
          :key="item.icon"
          :id="`why-card-${item.icon}`"
          class="flex flex-col items-center text-center gap-4"
        >
          <div class="w-16 h-16 rounded-full metallic-gradient flex items-center justify-center shadow-lg shadow-primary/20">
            <span class="material-symbols-outlined text-on-primary text-2xl">{{ item.icon }}</span>
          </div>
          <h3 class="font-headline font-bold text-on-surface text-lg">{{ item.title }}</h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WhySection',
  setup() {
    const badges = [
      '+15 anos em São Paulo',
      'Atendimento em até 24h',
      'Equipe especializada',
      'Garantia estendida',
    ]

    const items = [
      {
        icon: 'verified_user',
        title: '+15 Anos',
        description: 'Experiência consolidada no mercado de automação e segurança em São Paulo.',
      },
      {
        icon: 'bolt',
        title: 'Atendimento Rápido',
        description: 'Resposta ágil e visita técnica em até 24h para sua comodidade.',
      },
      {
        icon: 'task_alt',
        title: 'Garantia Estendida',
        description: 'Peças originais e garantia de serviços para sua total tranquilidade.',
      },
      {
        icon: 'auto_fix_high',
        title: 'Solução Completa',
        description: 'Instalação e manutenção completas, cuidamos de tudo para você.',
      },
    ]

    return { badges, items }
  },
})
</script>
