<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Já é Nosso Cliente?
        </h2>
        <p class="text-xl text-text-secondary">
          Acesse serviços exclusivos para clientes
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card
          v-for="servico in servicos"
          :key="servico.titulo"
          class="group hover:shadow-metal-lg transition-all cursor-pointer border-2 hover:border-primary-500"
          @click="handleServicoClick(servico)"
        >
          <CardContent class="p-6 text-center">
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
              :class="servico.bgColor"
            >
              <div v-html="servico.icon" :class="servico.iconColor" class="w-8 h-8"></div>
            </div>
            
            <h3 class="text-xl font-bold text-text-primary mb-2">
              {{ servico.titulo }}
            </h3>
            
            <p class="text-text-secondary text-sm mb-4">
              {{ servico.descricao }}
            </p>
            
            <Button
              variant="outline"
              size="sm"
              class="w-full group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500"
            >
              {{ servico.cta }}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div class="text-center mt-8">
        <p class="text-text-secondary mb-4">
          Ou acesse sua área exclusiva para acompanhar seus serviços
        </p>
        <Button
          as="NuxtLink"
          to="/cliente/login"
          variant="outline"
          size="lg"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Acessar Minha Área
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { sendMessage } = useWhatsApp()

interface Servico {
  titulo: string
  descricao: string
  icon: string
  bgColor: string
  iconColor: string
  cta: string
  mensagem: string
}

const servicos: Servico[] = [
  {
    titulo: 'Solicitar 2ª Via',
    descricao: 'Nota fiscal, comprovante ou documentos do serviço',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    bgColor: 'bg-info-100',
    iconColor: 'text-info-600',
    cta: 'Solicitar',
    mensagem: 'Olá! Sou cliente e gostaria de solicitar a 2ª via de documentos do meu serviço.'
  },
  {
    titulo: 'Agendar Manutenção',
    descricao: 'Manutenção preventiva ou corretiva do seu equipamento',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    bgColor: 'bg-accent-100',
    iconColor: 'text-accent-600',
    cta: 'Agendar',
    mensagem: 'Olá! Sou cliente e gostaria de agendar uma manutenção do meu equipamento.'
  },
  {
    titulo: 'Nova Visita',
    descricao: 'Solicite uma nova visita técnica ou orçamento',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
    bgColor: 'bg-success-100',
    iconColor: 'text-success-600',
    cta: 'Solicitar',
    mensagem: 'Olá! Sou cliente e gostaria de solicitar uma nova visita técnica.'
  }
]

const handleServicoClick = (servico: Servico) => {
  // Track event
  if (import.meta.client && (window as any).gtag) {
    (window as any).gtag('event', 'click_pos_venda', {
      service_type: servico.titulo
    })
  }
  
  // Send WhatsApp message
  sendMessage(servico.mensagem)
}
</script>
