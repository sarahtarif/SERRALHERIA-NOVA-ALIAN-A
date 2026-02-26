<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <Badge variant="success" class="mb-4">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Avaliação 4.8/5.0
        </Badge>
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          O Que Nossos Clientes Dizem
        </h2>
        <p class="text-xl text-text-secondary">
          Mais de 500 clientes satisfeitos em São Paulo
        </p>
      </div>
      
      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card v-for="avaliacao in avaliacoes" :key="avaliacao.nome" class="hover:shadow-metal-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-center mb-4">
              <div class="flex space-x-1">
                <svg v-for="i in 5" :key="i" class="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            
            <p class="text-text-secondary mb-4 italic">
              "{{ avaliacao.texto }}"
            </p>
            
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-bold">{{ avaliacao.iniciais }}</span>
              </div>
              <div>
                <p class="font-bold text-text-primary text-sm">{{ avaliacao.nome }}</p>
                <p class="text-text-tertiary text-xs">{{ avaliacao.bairro }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div class="text-center mt-8">
        <Button variant="outline" @click="handleVerMais">
          Ver Mais Avaliações no Google
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const avaliacoes = [
  {
    nome: 'Maria Silva',
    iniciais: 'MS',
    bairro: 'Moema',
    texto: 'Excelente serviço! Instalaram o motor do portão em menos de 24h. Equipe muito profissional e atenciosa.'
  },
  {
    nome: 'João Santos',
    iniciais: 'JS',
    bairro: 'Vila Mariana',
    texto: 'Recomendo! Fizeram a manutenção do portão do condomínio com muita qualidade. Preço justo e garantia.'
  },
  {
    nome: 'Ana Costa',
    iniciais: 'AC',
    bairro: 'Pinheiros',
    texto: 'Muito satisfeita com a instalação da trava eletrônica. Agora me sinto muito mais segura em casa.'
  }
]

const handleVerMais = () => {
  // Track event
  if (import.meta.client && (window as any).gtag) {
    (window as any).gtag('event', 'click_reviews', {
      source: 'area_clientes'
    })
  }
  
  // Open Google Reviews (replace with actual link)
  window.open('https://www.google.com/search?q=serralheria+nova+alianca', '_blank')
}
</script>
