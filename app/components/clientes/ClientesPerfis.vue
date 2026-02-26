<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Soluções para Cada Necessidade
        </h2>
        <p class="text-xl text-text-secondary max-w-2xl mx-auto">
          Escolha o perfil que mais se encaixa com você e descubra como podemos ajudar
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          v-for="perfil in perfis"
          :key="perfil.id"
          class="group hover:shadow-metal-lg transition-all cursor-pointer border-2 hover:border-primary-500"
          @click="handlePerfilClick(perfil)"
        >
          <CardContent class="p-6 text-center">
            <div 
              class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
              :class="perfil.bgColor"
            >
              <div v-html="perfil.icon" :class="perfil.iconColor" class="w-10 h-10"></div>
            </div>
            
            <h3 class="text-xl font-bold text-text-primary mb-2">
              {{ perfil.titulo }}
            </h3>
            
            <p class="text-text-secondary text-sm mb-4">
              {{ perfil.descricao }}
            </p>
            
            <div class="space-y-2 mb-6">
              <div 
                v-for="item in perfil.items"
                :key="item"
                class="flex items-center justify-center space-x-2 text-sm text-text-secondary"
              >
                <svg class="w-4 h-4 text-success-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ item }}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              class="w-full group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500"
            >
              Saiba Mais
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { sendMessage } = useWhatsApp()

interface Perfil {
  id: string
  titulo: string
  descricao: string
  icon: string
  bgColor: string
  iconColor: string
  items: string[]
  mensagemWhatsApp: string
}

const perfis: Perfil[] = [
  {
    id: 'familias',
    titulo: 'Famílias',
    descricao: 'Proteção e segurança para sua casa e seus filhos',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-600',
    items: [
      'Segurança para crianças',
      'Portões automáticos',
      'Travas eletrônicas'
    ],
    mensagemWhatsApp: 'Olá! Tenho interesse em soluções de automação e segurança para minha família. Gostaria de receber um orçamento.'
  },
  {
    id: 'pets',
    titulo: 'Pets',
    descricao: 'Proteção especial para seus animais de estimação',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    bgColor: 'bg-accent-100',
    iconColor: 'text-accent-600',
    items: [
      'Grades de proteção',
      'Portões seguros',
      'Fotocélulas'
    ],
    mensagemWhatsApp: 'Olá! Tenho pets em casa e preciso de soluções de segurança adequadas. Gostaria de receber um orçamento.'
  },
  {
    id: 'idosos',
    titulo: 'Idosos',
    descricao: 'Facilidade e segurança para a terceira idade',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    bgColor: 'bg-success-100',
    iconColor: 'text-success-600',
    items: [
      'Automação facilitada',
      'Controles simples',
      'Manutenção preventiva'
    ],
    mensagemWhatsApp: 'Olá! Preciso de soluções de automação pensadas para idosos. Gostaria de receber um orçamento.'
  },
  {
    id: 'empresas',
    titulo: 'Condomínios e Empresas',
    descricao: 'Soluções profissionais para seu negócio',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    bgColor: 'bg-steel-100',
    iconColor: 'text-steel-600',
    items: [
      'Controle de acesso',
      'Câmeras de segurança',
      'Manutenção programada'
    ],
    mensagemWhatsApp: 'Olá! Represento um condomínio/empresa e preciso de soluções profissionais de automação e segurança. Gostaria de receber um orçamento.'
  }
]

const handlePerfilClick = (perfil: Perfil) => {
  // Track event
  if (import.meta.client && (window as any).gtag) {
    (window as any).gtag('event', 'select_profile', {
      profile_type: perfil.id
    })
  }
  
  // Scroll to form or open WhatsApp
  const formSection = document.getElementById('solicitar-orcamento')
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
