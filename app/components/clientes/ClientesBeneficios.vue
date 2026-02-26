<template>
  <section class="py-20 bg-surface">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Por Que Escolher a Nova Aliança?
        </h2>
        <p class="text-xl text-text-secondary">
          Mais de 15 anos oferecendo as melhores soluções em automação
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div
          v-for="beneficio in beneficios"
          :key="beneficio.titulo"
          class="flex items-start space-x-4"
        >
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="beneficio.bgColor"
          >
            <div v-html="beneficio.icon" :class="beneficio.iconColor" class="w-6 h-6"></div>
          </div>
          <div>
            <h3 class="font-bold text-text-primary mb-2">{{ beneficio.titulo }}</h3>
            <p class="text-text-secondary text-sm">{{ beneficio.descricao }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const beneficios = [
  {
    titulo: 'Visita Técnica Gratuita',
    descricao: 'Avaliamos seu projeto sem custo e sem compromisso',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    bgColor: 'bg-success-100',
    iconColor: 'text-success-600'
  },
  {
    titulo: 'Instalação Rápida',
    descricao: 'Serviço concluído em até 48 horas em São Paulo',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-600'
  },
  {
    titulo: 'Garantia Estendida',
    descricao: '90 dias de garantia em mão de obra e 12 meses em peças',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    bgColor: 'bg-accent-100',
    iconColor: 'text-accent-600'
  },
  {
    titulo: 'Marcas de Qualidade',
    descricao: 'Trabalhamos com PPA, Garen, RCG e Intelbras',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
    bgColor: 'bg-info-100',
    iconColor: 'text-info-600'
  },
  {
    titulo: 'Pagamento Facilitado',
    descricao: 'Parcelamento em até 12x no cartão de crédito',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
    bgColor: 'bg-steel-100',
    iconColor: 'text-steel-600'
  },
  {
    titulo: 'Atendimento Especializado',
    descricao: 'Equipe técnica treinada e certificada',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
    bgColor: 'bg-danger-100',
    iconColor: 'text-danger-600'
  }
]
</script>
