<template>
  <div>
    <Navbar />
    
    <!-- Hero -->
    <section class="bg-gradient-primary text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <Badge variant="default" class="mb-4 bg-accent-500 text-white">
            Serviços Especializados
          </Badge>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Soluções Completas em Automação e Segurança
          </h1>
          <p class="text-xl text-primary-100">
            Mais de 15 anos oferecendo os melhores serviços em automação de portões, segurança eletrônica e serralheria em São Paulo
          </p>
        </div>
      </div>
    </section>

    <!-- Grid de Serviços Detalhado -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-8">
          <CardContainer v-for="service in services" :key="service.slug" class="w-full">
            <CardBody class="w-full" style="height: auto;">
              <CardItem :translateZ="50" class="w-full">
                <Card class="group">
                  <CardContent class="p-8">
                    <div class="flex items-start gap-6">
                      <CardItem :translateZ="75" class="flex-shrink-0">
                        <div 
                          class="w-16 h-16 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                          :class="service.bgColor"
                        >
                          <div v-html="service.icon" class="w-8 h-8" :class="service.iconColor"></div>
                        </div>
                      </CardItem>
                      
                      <div class="flex-1">
                        <CardItem :translateZ="60" class="w-full">
                          <h3 class="text-2xl font-bold text-text-primary mb-3">
                            {{ service.title }}
                          </h3>
                        </CardItem>
                        
                        <CardItem :translateZ="40" class="w-full">
                          <p class="text-text-secondary mb-4">
                            {{ service.description }}
                          </p>
                        </CardItem>
                        
                        <CardItem :translateZ="30" class="w-full">
                          <div class="space-y-2 mb-6">
                            <div v-for="feature in service.features" :key="feature" class="flex items-center gap-2">
                              <svg class="w-5 h-5 text-success-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span class="text-sm text-text-secondary">{{ feature }}</span>
                            </div>
                          </div>
                        </CardItem>
                        
                        <CardItem :translateZ="50" class="w-full">
                          <div class="flex gap-3">
                            <Button
                              @click="handleWhatsApp(service.title)"
                              class="bg-accent-500 hover:bg-accent-600 text-white"
                              size="sm"
                            >
                              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Solicitar
                            </Button>
                            <Button
                              as="NuxtLink"
                              :to="`/servicos/${service.slug}`"
                              variant="outline"
                              size="sm"
                            >
                              Saiba mais
                            </Button>
                          </div>
                        </CardItem>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-steel text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-4">Precisa de um Serviço Personalizado?</h2>
        <p class="text-xl mb-8 text-steel-100 max-w-2xl mx-auto">
          Entre em contato e conte-nos sobre seu projeto. Temos a solução ideal para você.
        </p>
        <Button
          @click="handleWhatsApp('Serviço Personalizado')"
          class="bg-accent-500 hover:bg-accent-600 text-white shadow-accent"
          size="lg"
        >
          Falar com Especialista
        </Button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
const { sendMessage, createServiceMessage } = useWhatsApp()

useHead({
  title: 'Serviços',
  meta: [
    { 
      name: 'description', 
      content: 'Serviços especializados em automação de portões, travas eletrônicas, fotocélulas, interfones, câmeras de segurança e manutenção em São Paulo.' 
    }
  ]
})

const services = [
  {
    slug: 'automacao-portoes',
    title: 'Automação de Portões',
    description: 'Instalação e manutenção de motores para portões basculantes, deslizantes e pivotantes.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    bgColor: 'bg-primary-100',
    iconColor: 'text-primary-500',
    features: [
      'Motores PPA, Garen, RCG e Intelbras',
      'Controle remoto e botoeira',
      'Instalação em até 2 dias',
      'Garantia de 12 meses'
    ]
  },
  {
    slug: 'travas-eletronicas',
    title: 'Travas Eletrônicas',
    description: 'Sistemas de travamento eletrônico para máxima segurança do seu portão.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
    bgColor: 'bg-steel-100',
    iconColor: 'text-steel-500',
    features: [
      'Proteção contra arrombamento',
      'Acionamento automático',
      'Compatível com qualquer motor',
      'Instalação rápida'
    ]
  },
  {
    slug: 'fotocelula',
    title: 'Fotocélula Anti-Esmagamento',
    description: 'Sistema de segurança que detecta obstáculos e previne acidentes.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    bgColor: 'bg-accent-100',
    iconColor: 'text-accent-600',
    features: [
      'Segurança para crianças e pets',
      'Sensor infravermelho',
      'Reversão automática',
      'Obrigatório por lei'
    ]
  },
  {
    slug: 'interfones',
    title: 'Interfones e Vídeo Porteiro',
    description: 'Comunicação e identificação de visitantes com tecnologia Intelbras.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
    bgColor: 'bg-info-100',
    iconColor: 'text-info-600',
    features: [
      'Vídeo porteiro com tela',
      'Abertura remota do portão',
      'Visão noturna',
      'Integração com fechadura'
    ]
  },
  {
    slug: 'cameras-seguranca',
    title: 'Câmeras de Segurança',
    description: 'Monitoramento 24h com acesso via aplicativo no celular.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
    bgColor: 'bg-danger-100',
    iconColor: 'text-danger-600',
    features: [
      'Câmeras Full HD',
      'Gravação em nuvem',
      'Áudio bidirecional',
      'Visão noturna infravermelha'
    ]
  },
  {
    slug: 'manutencao',
    title: 'Manutenção Preventiva e Corretiva',
    description: 'Serviços de manutenção para garantir o funcionamento perfeito.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    bgColor: 'bg-success-100',
    iconColor: 'text-success-600',
    features: [
      'Revisão completa',
      'Lubrificação e ajustes',
      'Troca de peças desgastadas',
      'Planos mensais disponíveis'
    ]
  }
]

const handleWhatsApp = (serviceName: string) => {
  const message = createServiceMessage({
    service: serviceName
  })
  sendMessage(message)
}
</script>
