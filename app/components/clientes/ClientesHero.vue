<template>
  <section class="relative bg-gradient-primary text-white py-16 md:py-24 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
    </div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Breadcrumb -->
        <nav class="mb-6 text-sm">
          <ol class="flex items-center justify-center space-x-2 text-primary-100">
            <li>
              <NuxtLink to="/" class="hover:text-white transition-colors">
                Home
              </NuxtLink>
            </li>
            <li>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li class="text-white font-medium">Área do Cliente</li>
          </ol>
        </nav>
        
        <!-- Main Content -->
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Área do Cliente Nova Aliança
        </h1>
        
        <p class="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
          Solicite orçamento, acompanhe seus serviços e acesse conteúdo exclusivo.<br class="hidden md:block">
          Atendimento especializado para sua necessidade.
        </p>
        
        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            class="bg-accent-500 hover:bg-accent-600 text-white shadow-accent w-full sm:w-auto cursor-pointer"
            @click="scrollToForm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Solicitar Orçamento Grátis
          </Button>
          
          <NuxtLink
            to="/cliente/login"
            class="inline-flex items-center justify-center gap-2 h-14 px-8 text-lg rounded-lg font-semibold transition-all border-2 border-white text-white hover:bg-white hover:text-primary-500 w-full sm:w-auto cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Acessar Minha Área
          </NuxtLink>
        </div>
        
        <!-- Trust Badges -->
        <div class="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-primary-100">15+ Anos de Experiência</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-primary-100">Instalação em até 48h</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span class="text-primary-100">Garantia Estendida</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const scrollToForm = () => {
  const formSection = document.getElementById('solicitar-orcamento')
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
  // Track event
  if (import.meta.client && (window as any).gtag) {
    (window as any).gtag('event', 'click_cta', {
      cta_location: 'hero',
      cta_text: 'Solicitar Orçamento Grátis'
    })
  }
}
</script>
