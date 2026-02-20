<template>
  <section class="relative text-white overflow-hidden min-h-[600px] md:min-h-[700px] hero-section">
    <!-- Background Image with CSS + Blur -->
    <div class="absolute inset-0 hero-background blur-[2px] scale-105"></div>
    
    <!-- Stronger Dark Overlay for better contrast -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-900/98 via-primary-800/95 to-primary-900/90"></div>

    <div class="container mx-auto px-4 py-8 md:py-12 relative z-10">
      <div class="max-w-3xl">
        <!-- Badge -->
        <div class="inline-flex items-center space-x-2 bg-accent-500 text-white px-4 py-2 rounded-full mb-6 shadow-lg">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-semibold text-sm">+15 anos protegendo São Paulo</span>
        </div>

        <!-- Título -->
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Automação de Portões em São Paulo (SP)
          <span class="text-accent-400"> + Segurança Eletrônica</span>
        </h1>

        <!-- Descrição -->
        <p class="text-xl md:text-2xl text-white mb-8 leading-relaxed max-w-2xl">
          Instalação e manutenção com atendimento rápido e solução completa (motor, fotocélula, trava, interfone e câmeras)
        </p>

        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-4 mb-10 max-w-2xl">
          <div class="flex items-center space-x-3 bg-white/15 backdrop-blur-md rounded-lg p-3 border border-white/20">
            <svg class="w-6 h-6 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span class="text-white font-medium">Anti-Esmagamento</span>
          </div>
          <div class="flex items-center space-x-3 bg-white/15 backdrop-blur-md rounded-lg p-3 border border-white/20">
            <svg class="w-6 h-6 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-white font-medium">Proteção Contra Surtos</span>
          </div>
          <div class="flex items-center space-x-3 bg-white/15 backdrop-blur-md rounded-lg p-3 border border-white/20">
            <svg class="w-6 h-6 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-white font-medium">Garantia e Suporte</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 items-start max-w-2xl">
          <div class="flex flex-col gap-2">
            <Button 
              @click="handleWhatsApp"
              class="bg-success-500 hover:bg-success-600 text-white shadow-2xl hover:shadow-success-500/50 border-2 border-success-400 transition-all transform hover:scale-105"
              size="lg"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span class="font-bold">Solicitar Orçamento Grátis</span>
            </Button>
            <p class="text-sm text-white/90 pl-2 font-medium">✓ Resposta rápida • Orçamento sem compromisso</p>
          </div>
          
          <NuxtLink to="/servicos">
            <Button 
              variant="outline"
              size="lg"
              class="bg-white/15 backdrop-blur-md hover:bg-white/25 text-white border-2 border-white/60 hover:border-white transition-all"
            >
              Ver Serviços →
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Wave Divider -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const { sendMessage } = useWhatsApp()

const handleWhatsApp = () => {
  const message = `Olá! Gostaria de solicitar um orçamento para automação de portão.

📍 Bairro: 
🚪 Tipo de portão (basculante/deslizante/pivotante): 
⏰ Melhor horário para contato: 

Aguardo retorno. Obrigado!`
  
  sendMessage(message)
}
</script>

<style scoped>
.hero-background {
  background-image: url('/portao.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
