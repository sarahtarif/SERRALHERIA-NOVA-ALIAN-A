<template>
  <section class="py-12 md:py-20 bg-surface pb-20 md:pb-20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12 md:mb-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
          Nossos Serviços
        </h2>
        <p class="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-3">
          Soluções completas em automação, segurança e serralheria para sua propriedade
        </p>
        <p class="text-sm md:text-base text-text-secondary max-w-xl mx-auto">
          Escolha o serviço e clique em <span class="font-semibold text-success-600">Pedir orçamento</span> para falar direto no WhatsApp
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <CardContainer
          v-for="service in services" 
          :key="service.slug"
          class="w-full"
        >
          <CardBody class="w-full" style="height: auto;">
            <CardItem :translateZ="50" class="w-full">
              <div 
                class="bg-white rounded-xl shadow-metal hover:shadow-metal-lg transition-all p-6 md:p-8 border border-border-light group relative"
                :class="{'cursor-pointer': !isMobile}"
                @click="!isMobile && navigateTo(`/servicos/${service.slug}`)"
              >
                <!-- Badge/Selo -->
                <div v-if="service.badge" class="absolute top-4 right-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="service.badgeColor">
                    {{ service.badge }}
                  </span>
                </div>

                <CardItem :translateZ="75" class="w-full">
                  <div class="w-16 h-16 rounded-lg flex items-center justify-center mb-4 md:mb-6 transition-all"
                    :class="service.bgColor">
                    <div v-html="service.icon" class="w-8 h-8" :class="service.iconColor"></div>
                  </div>
                </CardItem>
                
                <CardItem :translateZ="60" class="w-full">
                  <h3 class="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-primary-600 transition-colors">
                    {{ service.title }}
                  </h3>
                </CardItem>
                
                <CardItem :translateZ="40" class="w-full">
                  <p class="text-text-secondary mb-6 leading-relaxed text-sm md:text-base">
                    <span class="font-bold">{{ service.highlight }}</span> {{ service.description }}
                  </p>
                </CardItem>
                
                <CardItem :translateZ="50" class="w-full">
                  <div class="flex flex-col gap-3">
                    <!-- Mobile: Card inteiro clicável para WhatsApp -->
                    <button 
                      v-if="isMobile"
                      @click="handleWhatsApp(service.title, service.whatsappMessage)"
                      class="w-full bg-success-500 hover:bg-success-600 active:bg-success-700 text-white font-bold py-3.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg active:shadow-xl"
                    >
                      <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Pedir Orçamento no WhatsApp</span>
                    </button>

                    <!-- Desktop: Botão normal -->
                    <button 
                      v-else
                      @click.stop="handleWhatsApp(service.title, service.whatsappMessage)"
                      class="w-full bg-success-500 hover:bg-success-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>Pedir Orçamento no WhatsApp</span>
                    </button>
                    
                    <NuxtLink 
                      :to="`/servicos/${service.slug}`"
                      @click.stop
                      class="text-primary-500 hover:text-primary-600 text-xs md:text-sm font-medium transition-colors text-center"
                    >
                      Detalhes do serviço →
                    </NuxtLink>
                  </div>
                </CardItem>
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { sendMessage } = useWhatsApp()

// Detectar mobile
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  
  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
  }
  
  window.addEventListener('resize', handleResize)
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})

const services = [
  {
    slug: 'automacao-portoes',
    title: 'Automação de Portões',
    highlight: 'Instalação em até 24h',
    description: 'com motores das melhores marcas para portões basculantes e deslizantes.',
    whatsappMessage: 'Olá! Quero orçamento de Automação de Portão.\n\n📍 Bairro: \n🚪 Tipo de portão (basculante/deslizante/pivotante): \n⏰ Melhor horário: ',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-500',
    badge: 'Mais solicitado',
    badgeColor: 'bg-accent-100 text-accent-700'
  },
  {
    slug: 'cameras-seguranca',
    title: 'Câmeras de Segurança',
    highlight: 'Monitoramento 24h',
    description: 'pelo celular com câmeras de alta definição, áudio e visão noturna.',
    whatsappMessage: 'Olá! Quero orçamento de Câmeras de Segurança.\n\n📍 Bairro: \n📹 Quantas câmeras: \n🏠 Tipo de imóvel (casa/apto/comércio): ',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
    bgColor: 'bg-danger-100',
    iconColor: 'text-danger-600',
    badge: 'Ideal para condomínios',
    badgeColor: 'bg-info-100 text-info-700'
  },
  {
    slug: 'interfones',
    title: 'Interfones e Vídeo Porteiro',
    highlight: 'Veja quem está na porta',
    description: 'antes de abrir com interfones Intelbras de alta qualidade.',
    whatsappMessage: 'Olá! Quero orçamento de Interfone/Vídeo Porteiro.\n\n📍 Bairro: \n🏠 Tipo de imóvel: \n📱 Precisa de app: ',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
    bgColor: 'bg-info-100',
    iconColor: 'text-info-600'
  },
  {
    slug: 'fotocelula',
    title: 'Fotocélula Anti-Esmagamento',
    highlight: 'Proteção contra acidentes',
    description: 'com sensor que interrompe o portão ao detectar pessoas ou objetos.',
    whatsappMessage: 'Olá! Quero orçamento de Fotocélula Anti-Esmagamento.\n\n📍 Bairro: \n🚪 Tipo de portão: \n⏰ Melhor horário: ',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    bgColor: 'bg-accent-100',
    iconColor: 'text-accent-600',
    badge: 'Proteção extra',
    badgeColor: 'bg-success-100 text-success-700'
  },
  {
    slug: 'travas-eletronicas',
    title: 'Travas Eletrônicas',
    highlight: 'Proteção contra furtos',
    description: 'com travas de segurança que impedem abertura forçada do portão.',
    whatsappMessage: 'Olá! Quero orçamento de Trava Eletrônica.\n\n📍 Bairro: \n🚪 Tipo de portão: \n⏰ Melhor horário: ',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
    bgColor: 'bg-steel-100',
    iconColor: 'text-steel-500',
    badge: 'Proteção extra',
    badgeColor: 'bg-success-100 text-success-700'
  },
  {
    slug: 'manutencao',
    title: 'Manutenção Preventiva',
    highlight: 'Atendimento em até 24h',
    description: 'para manter seu portão funcionando perfeitamente sempre.',
    whatsappMessage: 'Olá! Quero orçamento de Manutenção Preventiva.\n\n📍 Bairro: \n🚪 Tipo de equipamento: \n⚠️ Problema: ',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    bgColor: 'bg-success-100',
    iconColor: 'text-success-600'
  }
]

const handleWhatsApp = (serviceName: string, customMessage?: string) => {
  const message = customMessage || `Olá! Quero orçamento de ${serviceName}.\n\n📍 Bairro: \n⏰ Melhor horário: `
  sendMessage(message)
}
</script>
