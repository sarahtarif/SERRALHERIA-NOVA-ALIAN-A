<template>
  <section class="py-8 sm:py-12 md:py-16 bg-gradient-steel text-white -mt-1">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
          Por que escolher a Nova Aliança?
        </h2>
        <div class="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-x-6 sm:gap-y-2 text-steel-100 max-w-3xl mx-auto">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-base md:text-lg">+15 anos em São Paulo</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-base md:text-lg">Atendimento em até 24h</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-base md:text-lg">Equipe especializada</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-base md:text-lg">Garantia estendida</span>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div 
          v-for="(item, index) in differentials" 
          :key="index"
          class="text-center"
        >
          <div class="w-16 h-16 md:w-20 md:h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-accent">
            <div v-html="item.icon" class="w-8 h-8 md:w-10 md:h-10 text-white"></div>
          </div>
          <h3 class="text-xl md:text-2xl font-bold mb-2 md:mb-3">{{ item.title }}</h3>
          <p class="text-steel-100 leading-relaxed max-w-[26ch] mx-auto">
            <span class="font-bold">{{ item.highlight }}</span> {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const differentials = [
  {
    title: '+15 Anos',
    highlight: 'Experiência consolidada',
    description: 'no mercado de automação e segurança em São Paulo',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>'
  },
  {
    title: 'Atendimento Rápido',
    highlight: 'Resposta ágil',
    description: 'e visita técnica em até 24h para sua comodidade',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
  },
  {
    title: 'Garantia Estendida',
    highlight: 'Peças originais',
    description: 'e garantia de serviços para sua total tranquilidade',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'
  },
  {
    title: 'Solução Completa',
    highlight: 'Instalação e manutenção',
    description: 'completas, cuidamos de tudo para você',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>'
  }
]
</script>
