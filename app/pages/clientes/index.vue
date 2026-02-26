<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    
    <!-- Hero Section -->
    <ClientesHero />
    
    <!-- Perfis de Cliente -->
    <ClientesPerfis />
    
    <!-- Benefícios -->
    <ClientesBeneficios />
    
    <!-- Avaliações -->
    <ClientesAvaliacoes />
    
    <!-- Formulário de Lead -->
    <section id="solicitar-orcamento" class="py-20 bg-surface">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <Badge variant="success" class="mb-4">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Resposta em até 2 horas
            </Badge>
            <h2 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Solicite seu Orçamento Gratuito
            </h2>
            <p class="text-xl text-text-secondary">
              Preencha o formulário abaixo e nossa equipe entrará em contato rapidamente
            </p>
          </div>
          
          <ClientesFormLead />
        </div>
      </div>
    </section>
    
    <!-- Pós-Venda -->
    <ClientesPosVenda />
    
    <!-- FAQ -->
    <ClientesFAQ />
    
    <!-- Áreas Atendidas -->
    <ClientesAreasAtendidas />
    
    <!-- CTAs Mobile -->
    <ClientesCTAsMobile />
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Área do Cliente - Serralheria Nova Aliança',
  meta: [
    { 
      name: 'description', 
      content: 'Solicite orçamento, acompanhe seus serviços e acesse sua área exclusiva. Atendimento especializado para famílias, pets, idosos e empresas em São Paulo.' 
    },
    { 
      name: 'keywords', 
      content: 'área do cliente, orçamento serralheria, acompanhamento serviço, automação portão, São Paulo' 
    }
  ]
})

// Track pageview
if (import.meta.client) {
  if ((window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: 'Área do Cliente',
      page_location: '/clientes'
    })
  }
}
</script>
