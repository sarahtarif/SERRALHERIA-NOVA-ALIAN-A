<template>
  <section class="py-20 bg-surface">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Perguntas Frequentes
        </h2>
        <p class="text-xl text-text-secondary">
          Tire suas dúvidas sobre nossos serviços
        </p>
      </div>
      
      <div class="max-w-3xl mx-auto space-y-4">
        <Card
          v-for="(faq, index) in faqs"
          :key="index"
          class="cursor-pointer hover:shadow-metal transition-shadow"
          @click="toggleFAQ(index)"
        >
          <CardContent class="p-6">
            <div class="flex items-start justify-between">
              <h3 class="font-bold text-text-primary pr-4">{{ faq.pergunta }}</h3>
              <svg
                class="w-5 h-5 text-primary-500 flex-shrink-0 transition-transform"
                :class="{ 'rotate-180': openIndex === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <div
              v-show="openIndex === index"
              class="mt-4 text-text-secondary"
            >
              {{ faq.resposta }}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref<number | null>(null)

const faqs = [
  {
    pergunta: 'Qual o prazo para instalação de um motor de portão?',
    resposta: 'O prazo médio é de 1 a 2 dias úteis após a visita técnica, dependendo da complexidade do projeto e disponibilidade de materiais.'
  },
  {
    pergunta: 'A visita técnica é gratuita?',
    resposta: 'Sim! A visita técnica para avaliação e orçamento é totalmente gratuita e sem compromisso.'
  },
  {
    pergunta: 'Qual a garantia dos serviços?',
    resposta: 'Oferecemos garantia de 90 dias para mão de obra e seguimos a garantia do fabricante para peças e equipamentos (geralmente 12 meses).'
  },
  {
    pergunta: 'Vocês trabalham com quais marcas de motores?',
    resposta: 'Trabalhamos com as principais marcas do mercado: PPA, Garen, RCG, Intelbras e outras marcas de qualidade reconhecida.'
  },
  {
    pergunta: 'É seguro para crianças e pets?',
    resposta: 'Sim! Todos os nossos sistemas incluem fotocélula anti-esmagamento, que detecta obstáculos e reverte o movimento automaticamente, garantindo total segurança.'
  },
  {
    pergunta: 'Fazem manutenção preventiva?',
    resposta: 'Sim! Oferecemos planos de manutenção preventiva para garantir o funcionamento perfeito do seu portão e aumentar a vida útil dos equipamentos.'
  },
  {
    pergunta: 'Quais formas de pagamento aceitam?',
    resposta: 'Aceitamos dinheiro, PIX, cartão de débito e crédito (parcelamento em até 12x). Consulte condições especiais para pagamento à vista.'
  },
  {
    pergunta: 'Atendem em quais regiões de São Paulo?',
    resposta: 'Atendemos toda a capital de São Paulo e região metropolitana, com foco nas zonas Sul, Oeste e Central.'
  }
]

const toggleFAQ = (index: number) => {
  const newIndex = openIndex.value === index ? null : index
  openIndex.value = newIndex
  
  // Track event
  if (import.meta.client && (window as any).gtag && newIndex === index && faqs[index]) {
    (window as any).gtag('event', 'faq_click', {
      question: faqs[index].pergunta
    })
  }
}
</script>
