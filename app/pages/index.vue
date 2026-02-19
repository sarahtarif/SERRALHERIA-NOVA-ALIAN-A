<template>
  <div class="min-h-screen">
    <Navbar />
    
    <!-- Hero Section -->
    <Hero />
    
    <!-- Diferenciais -->
    <Differentials />
    
    <!-- Serviços -->
    <ServicesGrid />
    
    <!-- Galeria -->
    <Gallery />
    
    <!-- Seção de Orçamento -->
    <section class="py-20 bg-surface">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="success" class="mb-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Atendimento Rápido
            </Badge>
            <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Solicite seu Orçamento Gratuito
            </h2>
            <p class="text-xl text-text-secondary mb-8 leading-relaxed">
              Preencha o formulário e receba um orçamento personalizado via WhatsApp em até 2 horas.
            </p>
            
            <div class="space-y-4">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-text-primary mb-1">Visita Técnica Gratuita</h3>
                  <p class="text-text-secondary">Avaliamos seu projeto sem custo</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-text-primary mb-1">Garantia Estendida</h3>
                  <p class="text-text-secondary">Todos os serviços com garantia</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-text-primary mb-1">Pagamento Facilitado</h3>
                  <p class="text-text-secondary">Parcelamento em até 12x</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Área de Atendimento -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Atendemos toda São Paulo
          </h2>
          <p class="text-xl text-text-secondary max-w-2xl mx-auto">
            Cobertura completa na capital e região metropolitana
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div v-for="region in regions" :key="region" class="bg-surface p-4 rounded-lg text-center hover:bg-primary-50 transition-colors">
            <span class="text-text-primary font-medium">{{ region }}</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FAQ -->
    <section class="py-20 bg-surface">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Perguntas Frequentes
          </h2>
          <p class="text-xl text-text-secondary">
            Tire suas dúvidas sobre nossos serviços
          </p>
        </div>
        
        <div class="space-y-4">
          <Card v-for="(faq, index) in faqs" :key="index">
            <CardContent class="p-6">
              <h3 class="font-bold text-lg text-text-primary mb-2">{{ faq.question }}</h3>
              <p class="text-text-secondary">{{ faq.answer }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Home',
  meta: [
    { 
      name: 'description', 
      content: 'Serralheria Nova Aliança - Especialistas em automação de portões, travas eletrônicas, interfones e câmeras de segurança em São Paulo. +15 anos de experiência.' 
    },
    { 
      name: 'keywords', 
      content: 'serralheria, automação portão, trava eletrônica, fotocélula, interfone, câmeras segurança, São Paulo' 
    }
  ]
})

const regions = [
  'Vila Mariana', 'Moema', 'Pinheiros', 'Itaim Bibi',
  'Jardins', 'Santo Amaro', 'Brooklin', 'Campo Belo',
  'Saúde', 'Ipiranga', 'Tatuapé', 'Penha',
  'Santana', 'Casa Verde', 'Lapa', 'Butantã'
]

const faqs = [
  {
    question: 'Qual o prazo para instalação de um motor de portão?',
    answer: 'O prazo médio é de 1 a 2 dias úteis após a visita técnica, dependendo da complexidade do projeto e disponibilidade de materiais.'
  },
  {
    question: 'Vocês trabalham com quais marcas de motores?',
    answer: 'Trabalhamos com as principais marcas do mercado: PPA, Garen, RCG, Intelbras e outras marcas de qualidade reconhecida.'
  },
  {
    question: 'A visita técnica é gratuita?',
    answer: 'Sim! A visita técnica para avaliação e orçamento é totalmente gratuita e sem compromisso.'
  },
  {
    question: 'Qual a garantia dos serviços?',
    answer: 'Oferecemos garantia de 90 dias para mão de obra e seguimos a garantia do fabricante para peças e equipamentos (geralmente 12 meses).'
  },
  {
    question: 'Fazem manutenção preventiva?',
    answer: 'Sim! Oferecemos planos de manutenção preventiva para garantir o funcionamento perfeito do seu portão e aumentar a vida útil dos equipamentos.'
  }
]
</script>
