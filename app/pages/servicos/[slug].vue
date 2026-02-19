<template>
  <div class="min-h-screen">
    <Navbar />
    
    <div v-if="service" class="py-20">
      <div class="container mx-auto px-4">
        <!-- Breadcrumb -->
        <nav class="mb-8 text-sm">
          <ol class="flex items-center space-x-2 text-text-secondary">
            <li><NuxtLink to="/" class="hover:text-primary-500">Home</NuxtLink></li>
            <li>/</li>
            <li><NuxtLink to="/servicos" class="hover:text-primary-500">Serviços</NuxtLink></li>
            <li>/</li>
            <li class="text-text-primary font-medium">{{ service.title }}</li>
          </ol>
        </nav>

        <div class="grid lg:grid-cols-2 gap-12 mb-16">
          <!-- Conteúdo -->
          <div>
            <Badge variant="default" class="mb-4">{{ service.category }}</Badge>
            <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {{ service.title }}
            </h1>
            <p class="text-xl text-text-secondary mb-8 leading-relaxed">
              {{ service.description }}
            </p>

            <!-- Características -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-text-primary mb-4">Características</h2>
              <ul class="space-y-3">
                <li v-for="(feature, index) in service.features" :key="index" class="flex items-start space-x-3">
                  <svg class="w-6 h-6 text-success-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-text-primary">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Benefícios -->
            <div>
              <h2 class="text-2xl font-bold text-text-primary mb-4">Benefícios</h2>
              <ul class="space-y-3">
                <li v-for="(benefit, index) in service.benefits" :key="index" class="flex items-start space-x-3">
                  <svg class="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-text-primary">{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- CTA Card -->
          <div>
            <Card class="sticky top-24">
              <CardContent class="p-8">
                <h3 class="text-2xl font-bold text-text-primary mb-4">
                  Solicite um Orçamento
                </h3>
                <p class="text-text-secondary mb-6">
                  Preencha o formulário e receba uma proposta personalizada via WhatsApp
                </p>
                <LeadForm :service="service.title" />
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Serviços Relacionados -->
        <section class="py-12 border-t border-border">
          <h2 class="text-3xl font-bold text-text-primary mb-8">Outros Serviços</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <NuxtLink
              v-for="related in relatedServices"
              :key="related.slug"
              :to="`/servicos/${related.slug}`"
              class="group"
            >
              <Card class="h-full hover:shadow-metal-lg transition-shadow">
                <CardContent class="p-6">
                  <div class="text-4xl mb-4">{{ related.icon }}</div>
                  <h3 class="text-xl font-bold text-text-primary mb-2 group-hover:text-primary-500 transition-colors">
                    {{ related.title }}
                  </h3>
                  <p class="text-text-secondary text-sm">{{ related.shortDescription }}</p>
                </CardContent>
              </Card>
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>

    <div v-else class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl font-bold text-text-primary mb-4">Serviço não encontrado</h1>
        <p class="text-text-secondary mb-8">O serviço que você procura não existe.</p>
        <Button as="a" href="/servicos">Ver todos os serviços</Button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Dados dos serviços
const services = {
  'automacao-portoes': {
    slug: 'automacao-portoes',
    category: 'Automação',
    title: 'Automação de Portões',
    description: 'Instalação e manutenção de motores para portões basculantes, deslizantes e pivotantes. Trabalhamos com as melhores marcas do mercado.',
    features: [
      'Motores PPA, Garen, RCG e Intelbras',
      'Instalação profissional certificada',
      'Configuração de controles remotos',
      'Sistema de segurança integrado',
      'Garantia de 12 meses'
    ],
    benefits: [
      'Mais comodidade no dia a dia',
      'Segurança para sua família',
      'Valorização do imóvel',
      'Economia de tempo',
      'Tecnologia de ponta'
    ]
  },
  'travas-eletronicas': {
    slug: 'travas-eletronicas',
    category: 'Segurança',
    title: 'Travas Eletrônicas',
    description: 'Instalação de travas eletrônicas de alta segurança para portões e portas. Proteção adicional contra invasões.',
    features: [
      'Travas de alta resistência',
      'Acionamento por controle remoto',
      'Integração com automação',
      'Instalação rápida',
      'Baixo consumo de energia'
    ],
    benefits: [
      'Segurança reforçada',
      'Proteção contra arrombamento',
      'Controle de acesso',
      'Durabilidade garantida',
      'Fácil operação'
    ]
  }
}

const service = services[slug as keyof typeof services] || null

const relatedServices = Object.values(services)
  .filter(s => s.slug !== slug)
  .slice(0, 3)
  .map(s => ({
    ...s,
    shortDescription: s.description.substring(0, 100) + '...'
  }))

useHead({
  title: service ? service.title : 'Serviço não encontrado',
  meta: [
    { 
      name: 'description', 
      content: service ? service.description : 'Serviço não encontrado'
    }
  ]
})
</script>
