<template>
  <div>
    <Navbar />
    
    <!-- Hero -->
    <section class="bg-gradient-primary text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <Badge variant="default" class="mb-4 bg-accent-500 text-white">
            Fale Conosco
          </Badge>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p class="text-xl text-primary-100">
            Estamos prontos para atender você. Escolha a melhor forma de contato.
          </p>
        </div>
      </div>
    </section>

    <!-- Contato -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Informações de Contato -->
          <div>
            <h2 class="text-3xl font-bold text-text-primary mb-8">
              Informações de Contato
            </h2>
            
            <div class="space-y-6 mb-12">
              <Card>
                <CardContent class="p-6 flex items-start gap-4">
                  <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-accent-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-text-primary mb-2">WhatsApp</h3>
                    <p class="text-text-secondary mb-3">(11) 99999-9999</p>
                    <Button
                      @click="handleWhatsApp"
                      class="bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      Enviar Mensagem
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent class="p-6 flex items-start gap-4">
                  <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-text-primary mb-2">Telefone</h3>
                    <p class="text-text-secondary">(11) 99999-9999</p>
                    <p class="text-sm text-text-tertiary mt-1">Seg-Sex: 8h às 18h | Sáb: 8h às 12h</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent class="p-6 flex items-start gap-4">
                  <div class="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-text-primary mb-2">E-mail</h3>
                    <p class="text-text-secondary">contato@novaalianca.com.br</p>
                    <p class="text-sm text-text-tertiary mt-1">Resposta em até 24h</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent class="p-6 flex items-start gap-4">
                  <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-text-primary mb-2">Localização</h3>
                    <p class="text-text-secondary">São Paulo - SP</p>
                    <p class="text-sm text-text-tertiary mt-1">Atendemos toda a capital e região metropolitana</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Horário de Atendimento -->
            <Card class="bg-surface">
              <CardContent class="p-6">
                <h3 class="font-bold text-text-primary mb-4">Horário de Atendimento</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-text-secondary">Segunda a Sexta</span>
                    <span class="font-semibold text-text-primary">8h às 18h</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-text-secondary">Sábado</span>
                    <span class="font-semibold text-text-primary">8h às 12h</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-text-secondary">Domingo</span>
                    <span class="font-semibold text-text-primary">Fechado</span>
                  </div>
                  <div class="pt-3 mt-3 border-t border-border-light">
                    <Badge variant="warning" class="w-full justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Atendimento Emergencial 24h
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Formulário -->
          <div>
            <h2 class="text-3xl font-bold text-text-primary mb-8">
              Envie sua Mensagem
            </h2>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>

    <!-- Área de Atendimento -->
    <section class="py-20 bg-surface">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-text-primary mb-4">
            Área de Atendimento
          </h2>
          <p class="text-xl text-text-secondary max-w-2xl mx-auto">
            Atendemos toda a cidade de São Paulo e região metropolitana
          </p>
        </div>

        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <Card v-for="region in regions" :key="region" class="hover:shadow-metal-lg transition-all">
            <CardContent class="p-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-text-primary font-medium">{{ region }}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="text-center mt-12">
          <Alert variant="info" class="max-w-2xl mx-auto">
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            <div>
              <p class="font-bold mb-1">Não encontrou sua região?</p>
              <p class="text-sm">Entre em contato conosco! Podemos atender outras localidades mediante consulta.</p>
            </div>
          </Alert>
        </div>
      </div>
    </section>

    <!-- FAQ Rápido -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-text-primary mb-4">
            Perguntas Frequentes
          </h2>
        </div>

        <div class="space-y-4">
          <Card v-for="(faq, index) in faqs" :key="index">
            <CardContent class="p-6">
              <h3 class="font-bold text-lg text-text-primary mb-2 flex items-start gap-2">
                <svg class="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ faq.question }}
              </h3>
              <p class="text-text-secondary pl-7">{{ faq.answer }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
const { sendMessage, createServiceMessage } = useWhatsApp()

useHead({
  title: 'Contato',
  meta: [
    { 
      name: 'description', 
      content: 'Entre em contato com a Serralheria Nova Aliança. Atendemos toda São Paulo. WhatsApp, telefone e e-mail disponíveis.' 
    }
  ]
})

const regions = [
  'Vila Mariana', 'Moema', 'Pinheiros', 'Itaim Bibi',
  'Jardins', 'Santo Amaro', 'Brooklin', 'Campo Belo',
  'Saúde', 'Ipiranga', 'Tatuapé', 'Penha',
  'Santana', 'Casa Verde', 'Lapa', 'Butantã',
  'Vila Madalena', 'Perdizes', 'Barra Funda', 'Liberdade'
]

const faqs = [
  {
    question: 'Qual o prazo para visita técnica?',
    answer: 'Realizamos visitas técnicas em até 24 horas após o primeiro contato, de forma totalmente gratuita.'
  },
  {
    question: 'Vocês atendem emergências?',
    answer: 'Sim! Temos atendimento emergencial 24h para casos urgentes de portões travados ou problemas de segurança.'
  },
  {
    question: 'Como funciona a garantia?',
    answer: 'Oferecemos 90 dias de garantia para mão de obra e seguimos a garantia do fabricante para peças (geralmente 12 meses).'
  },
  {
    question: 'Posso parcelar o pagamento?',
    answer: 'Sim! Aceitamos cartão de crédito com parcelamento em até 12x, além de PIX e transferência bancária.'
  }
]

const handleWhatsApp = () => {
  const message = createServiceMessage({
    service: 'Gostaria de mais informações'
  })
  sendMessage(message)
}
</script>
