<template>
  <div>
    <Navbar />
    
    <!-- Hero -->
    <section class="bg-gradient-primary text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <Badge variant="default" class="mb-4 bg-accent-500 text-white">
            Nossa História
          </Badge>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Serralheria Nova Aliança
          </h1>
          <p class="text-xl text-primary-100">
            Mais de 15 anos transformando segurança em tranquilidade para famílias e empresas em São Paulo
          </p>
        </div>
      </div>
    </section>

    <!-- História -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-text-primary mb-6">
              Nossa Trajetória
            </h2>
            <div class="space-y-4 text-text-secondary leading-relaxed">
              <p>
                Fundada em 2010, a Serralheria Nova Aliança nasceu do sonho de oferecer soluções completas em automação e segurança para residências e empresas em São Paulo.
              </p>
              <p>
                Com mais de 15 anos de experiência, nos consolidamos como referência no mercado de automação de portões, instalação de travas eletrônicas, interfones, câmeras de segurança e serralheria em geral.
              </p>
              <p>
                Nossa missão sempre foi clara: proporcionar segurança, conforto e tranquilidade para nossos clientes através de serviços de excelência, atendimento personalizado e uso das melhores tecnologias disponíveis no mercado.
              </p>
              <p>
                Hoje, contamos com uma equipe altamente qualificada e certificada pelas principais marcas do setor, garantindo instalações seguras e manutenções preventivas que prolongam a vida útil dos equipamentos.
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <Card>
              <CardContent class="p-6 text-center">
                <div class="text-4xl font-bold text-primary-500 mb-2">+15</div>
                <div class="text-text-secondary">Anos de Experiência</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-6 text-center">
                <div class="text-4xl font-bold text-primary-500 mb-2">+5000</div>
                <div class="text-text-secondary">Projetos Realizados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-6 text-center">
                <div class="text-4xl font-bold text-primary-500 mb-2">98%</div>
                <div class="text-text-secondary">Clientes Satisfeitos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="p-6 text-center">
                <div class="text-4xl font-bold text-primary-500 mb-2">24h</div>
                <div class="text-text-secondary">Atendimento Emergencial</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="py-20 bg-surface">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-text-primary mb-4">
            Nossos Valores
          </h2>
          <p class="text-xl text-text-secondary max-w-2xl mx-auto">
            Princípios que guiam nosso trabalho e relacionamento com clientes
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <Card v-for="value in values" :key="value.title">
            <CardContent class="p-8 text-center">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div v-html="value.icon" class="w-8 h-8 text-primary-500"></div>
              </div>
              <h3 class="text-xl font-bold text-text-primary mb-3">{{ value.title }}</h3>
              <p class="text-text-secondary">{{ value.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Diferenciais -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-text-primary mb-4">
            Por Que Nos Escolher?
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div v-for="diff in differentials" :key="diff.title" class="flex gap-4">
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-text-primary mb-1">{{ diff.title }}</h3>
              <p class="text-text-secondary text-sm">{{ diff.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certificações -->
    <section class="py-20 bg-gradient-steel text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-4">Certificados e Parcerias</h2>
        <p class="text-xl text-steel-100 mb-12 max-w-2xl mx-auto">
          Trabalhamos com as melhores marcas do mercado
        </p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div v-for="brand in brands" :key="brand" class="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex items-center justify-center">
            <span class="text-lg font-bold">{{ brand }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-text-primary mb-4">
          Faça Parte da Nossa História
        </h2>
        <p class="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Entre em contato e descubra como podemos ajudar você
        </p>
        <Button
          @click="handleWhatsApp"
          class="bg-accent-500 hover:bg-accent-600 text-white shadow-accent"
          size="lg"
        >
          Falar com Nossa Equipe
        </Button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
const { sendMessage, createServiceMessage } = useWhatsApp()

useHead({
  title: 'Sobre Nós',
  meta: [
    { 
      name: 'description', 
      content: 'Conheça a Serralheria Nova Aliança. Mais de 15 anos de experiência em automação de portões e segurança eletrônica em São Paulo.' 
    }
  ]
})

const values = [
  {
    title: 'Qualidade',
    description: 'Utilizamos apenas materiais e equipamentos de primeira linha, garantindo durabilidade e segurança.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>'
  },
  {
    title: 'Compromisso',
    description: 'Cumprimos prazos e mantemos nossa palavra. Sua satisfação é nossa prioridade.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  },
  {
    title: 'Transparência',
    description: 'Orçamentos claros e detalhados, sem surpresas ou custos ocultos.',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>'
  }
]

const differentials = [
  { title: 'Atendimento Rápido', description: 'Resposta em até 2 horas e visita técnica em 24h' },
  { title: 'Equipe Qualificada', description: 'Profissionais certificados e experientes' },
  { title: 'Garantia Estendida', description: '90 dias de garantia em mão de obra' },
  { title: 'Melhores Marcas', description: 'PPA, Intelbras, Garen, RCG e outras' },
  { title: 'Pagamento Facilitado', description: 'Parcelamento em até 12x no cartão' },
  { title: 'Pós-Venda', description: 'Suporte contínuo após a instalação' }
]

const brands = ['PPA', 'Intelbras', 'Garen', 'RCG', 'HDL', 'Hikvision', 'JFL', 'Linear']

const handleWhatsApp = () => {
  const message = createServiceMessage({
    service: 'Gostaria de conhecer melhor os serviços'
  })
  sendMessage(message)
}
</script>
