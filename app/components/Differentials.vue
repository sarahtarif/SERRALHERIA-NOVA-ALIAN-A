<template>
  <section class="py-20 bg-gradient-steel text-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          Por que escolher a Nova Aliança?
        </h2>
        <p class="text-xl text-steel-100 max-w-2xl mx-auto">
          Mais de 15 anos oferecendo soluções completas em automação e segurança
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(item, index) in differentials" 
          :key="index"
          class="text-center"
        >
          <div class="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-accent">
            <div v-html="item.icon" class="w-10 h-10 text-white"></div>
          </div>
          <h3 class="text-2xl font-bold mb-3">{{ item.title }}</h3>
          <p class="text-steel-100 leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const differentials = [
  {
    title: '+15 Anos',
    description: 'Experiência consolidada no mercado de automação e segurança em São Paulo',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>'
  },
  {
    title: 'Atendimento Rápido',
    description: 'Resposta ágil e visita técnica em até 24h para sua comodidade',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
  },
  {
    title: 'Garantia Estendida',
    description: 'Garantia de serviços e peças para sua total tranquilidade',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>'
  },
  {
    title: 'Solução Completa',
    description: 'Da instalação à manutenção, cuidamos de tudo para você',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>'
  }
]
</script>
