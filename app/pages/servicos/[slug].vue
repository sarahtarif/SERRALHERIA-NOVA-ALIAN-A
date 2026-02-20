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
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              {{ service.title }}
            </h1>
            
            <!-- CTA Principal no Topo -->
            <div class="mb-8 p-6 bg-success-50 border-2 border-success-200 rounded-xl">
              <button 
                @click="handleWhatsApp"
                class="w-full bg-success-500 hover:bg-success-600 active:bg-success-700 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl mb-3"
              >
                <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span class="text-lg">Pedir Orçamento de {{ service.title }} no WhatsApp</span>
              </button>
              <p class="text-sm text-success-700 text-center font-medium">
                ✓ Resposta rápida • Orçamento sem compromisso
              </p>
            </div>

            <p class="text-base md:text-lg text-text-secondary mb-8 leading-relaxed">
              <span class="font-bold text-text-primary">{{ getShortDescription(service.slug) }}</span>
            </p>

            <!-- Características -->
            <div class="mb-8">
              <h2 class="text-xl md:text-2xl font-bold text-text-primary mb-4">Características</h2>
              <ul class="space-y-3">
                <li v-for="(feature, index) in service.features" :key="index" class="flex items-start space-x-3">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-success-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm md:text-base text-text-primary">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <!-- Benefícios -->
            <div class="mb-8">
              <h2 class="text-xl md:text-2xl font-bold text-text-primary mb-4">Benefícios</h2>
              <ul class="space-y-3">
                <li v-for="(benefit, index) in service.benefits" :key="index" class="flex items-start space-x-3">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span class="text-sm md:text-base text-text-primary">
                    <span class="font-bold">{{ getBenefitHighlight(benefit) }}</span>{{ getBenefitRest(benefit) }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Informações Técnicas / SEO -->
            <div v-if="service.seoText" class="bg-surface p-6 rounded-lg border border-border-light">
              <h2 class="text-2xl font-bold text-text-primary mb-4">Informações Técnicas</h2>
              <p class="text-text-secondary leading-relaxed">{{ service.seoText }}</p>
            </div>
          </div>

          <!-- CTA Card -->
          <div>
            <Card class="sticky top-24">
              <CardContent class="p-6 md:p-8">
                <h3 class="text-xl md:text-2xl font-bold text-text-primary mb-3">
                  Solicite um Orçamento de {{ service.title }}
                </h3>
                <p class="text-sm md:text-base text-text-secondary mb-4">
                  Preencha os dados e receba a proposta também pelo WhatsApp
                </p>
                
                <!-- Botão WhatsApp Rápido -->
                <button 
                  @click="handleWhatsApp"
                  class="w-full bg-success-500 hover:bg-success-600 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mb-4 md:hidden"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span class="text-sm">Falar direto pelo WhatsApp</span>
                </button>
                
                <div class="relative mb-4 md:hidden">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-border"></div>
                  </div>
                  <div class="relative flex justify-center text-xs">
                    <span class="bg-white px-2 text-text-secondary">ou preencha o formulário</span>
                  </div>
                </div>
                
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
const { sendMessage } = useWhatsApp()

// Dados dos serviços
const services = {
  'automacao-portoes': {
    slug: 'automacao-portoes',
    category: 'Automação',
    title: 'Automação de Portões',
    description: 'Instalação e manutenção de motores para portões basculantes, deslizantes e pivotantes. Trabalhamos com as melhores marcas do mercado.',
    seoText: undefined,
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
    seoText: undefined,
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
  },
  'fotocelula': {
    slug: 'fotocelula',
    category: 'Segurança',
    title: 'Fotocélula Anti-Esmagamento',
    description: 'Fotocélula Anti-Esmagamento (sensor de barreira). A fotocélula é um dispositivo essencial de segurança para portões automáticos, projetado para evitar colisões durante o fechamento ao identificar qualquer obstrução no vão. Ela funciona com transmissor e receptor alinhados formando um "feixe invisível"; quando esse feixe é interrompido, a central do automatizador recebe o sinal e interrompe o movimento (geralmente parando e/ou revertendo para abertura).',
    seoText: 'A fotocélula anti-esmagamento para portão automático cria uma barreira de segurança no acesso e impede o fechamento quando há alguém ou algo no caminho. Ela é composta por um transmissor e um receptor que precisam ficar alinhados; ao interromper o feixe, a central entende a presença de obstáculo e age para evitar a colisão. A norma ABNT NBR 15969 é citada como a principal regulamentação de segurança para portões automáticos no Brasil e inclui requisitos ligados à instalação correta de sensores e sistemas de parada automática para prevenir acidentes.',
    features: [
      'Barreira por feixe (emissor + receptor) com alinhamento técnico e testes de funcionamento',
      'Resposta imediata ao detectar obstrução no trajeto do portão',
      'Integração com a central do automatizador para segurança no fechamento automático'
    ],
    benefits: [
      'Mais segurança para crianças, pedestres e veículos na entrada/saída',
      'Evita danos no portão e reduz riscos de impacto durante o fechamento',
      'Conformidade com normas de segurança ABNT NBR 15969'
    ]
  },
  'interfones': {
    slug: 'interfones',
    category: 'Comunicação',
    title: 'Interfones e Vídeo Porteiro',
    description: 'Sistemas de interfonia e vídeo porteiro que permitem ver, ouvir e identificar o visitante antes de liberar a entrada, aumentando a segurança de residências, condomínios e comércios. Os equipamentos Intelbras contam com câmera integrada, display de alta qualidade e recursos como abertura de fechadura elétrica ou portão direto do monitor ou aplicativo, trazendo praticidade no dia a dia.',
    seoText: 'Os interfones e vídeo porteiros Intelbras oferecem controle de acesso moderno, permitindo visualizar visitantes em um monitor interno com imagem nítida, inclusive em ambientes com pouca luz graças à visão noturna por infravermelho. Além da comunicação por áudio, é possível acionar fechaduras elétricas e portões diretamente pelo equipamento, com modelos que ainda permitem acesso via TAG, senha ou reconhecimento facial, trazendo mais comodidade e segurança ao dia a dia. Alguns sistemas permitem integração com aplicativos, possibilitando atender chamadas e liberar o acesso mesmo à distância, ideal para quem deseja monitorar a entrada da casa ou do condomínio de qualquer lugar.',
    features: [
      'Visualização nítida do visitante em display de 7" com visão mesmo em baixa iluminação',
      'Comunicação de áudio clara para identificar e conversar com quem está no portão',
      'Abertura de até duas fechaduras ou portão de garagem diretamente no módulo interno',
      'Opções com acesso via TAG, senha ou app, conforme o modelo escolhido'
    ],
    benefits: [
      'Mais segurança na identificação de visitantes antes de liberar a entrada',
      'Praticidade para moradores, que podem atender e abrir o portão sem ir até a rua ou até pelo celular em modelos compatíveis',
      'Valorização do imóvel com um sistema moderno de controle de acesso'
    ]
  },
  'cameras-seguranca': {
    slug: 'cameras-seguranca',
    category: 'Segurança',
    title: 'Câmeras de Segurança',
    description: 'Sistemas de CFTV e câmeras IP com imagens em alta definição, visão noturna e áudio integrado, permitindo acompanhar em tempo real tudo o que acontece no imóvel. As câmeras podem ser acessadas pelo celular via aplicativo, oferecendo monitoramento 24 horas com envio de alertas em caso de movimento suspeito e gravação para consulta posterior.',
    seoText: 'As câmeras de segurança com áudio e acesso via aplicativo permitem monitoramento 24 horas do imóvel, com transmissão ao vivo para celular, tablet ou computador. Com visão noturna infravermelha, áudio bidirecional e detecção de movimento, o sistema registra imagens mesmo no escuro, envia alertas e possibilita ouvir o ambiente monitorado em tempo real, ampliando a vigilância. Com a tecnologia atual, é possível integrar câmeras a sistemas de alarme e monitoramento profissional, garantindo resposta rápida em caso de eventos suspeitos e maior proteção para casas, comércios e condomínios.',
    features: [
      'Vídeo em tempo real com áudio bidirecional (microfone e alto-falante integrados, em modelos compatíveis)',
      'Visão noturna infravermelha para monitorar mesmo em ambientes com pouca ou nenhuma iluminação',
      'Acesso remoto via app em smartphones (iOS e Android), com visualização e configurações pelo celular',
      'Opções com gravação em nuvem ou cartão de memória, detecção de movimento e envio de alertas'
    ],
    benefits: [
      'Monitoramento 24h de residências, comércios e condomínios, mesmo quando o cliente está fora',
      'Disuasão de invasões e aumento da sensação de segurança, com registros em vídeo em caso de incidentes',
      'Possibilidade de acompanhar família, colaboradores ou pets em tempo real, direto do celular'
    ]
  },
  'manutencao': {
    slug: 'manutencao',
    category: 'Manutenção',
    title: 'Manutenção Preventiva',
    description: 'A manutenção preventiva é fundamental para manter portões automáticos, motores e dispositivos de segurança funcionando com segurança, evitando falhas inesperadas e prolongando a vida útil do equipamento. O serviço inclui inspeção periódica, ajustes, limpeza, lubrificação e testes de sensores, controles remotos e mecanismos anti-esmagamento, identificando problemas antes que se tornem defeitos graves.',
    seoText: 'A manutenção preventiva de portões automáticos e sistemas de segurança engloba cuidados regulares antes que qualquer defeito apareça, como limpeza, lubrificação, inspeção de peças e testes de funcionamento. Realizar essas visitas periódicas diminui o risco de falhas inesperadas, reduz o desgaste prematuro de componentes e evita gastos elevados com manutenção corretiva ou substituição de peças. Além da economia, manter o sistema em dia garante mais segurança para moradores e usuários, pois sensores, fotocélulas e dispositivos de parada automática seguem operando de acordo com as recomendações técnicas.',
    features: [
      'Verificação regular de componentes mecânicos, trilhos, engrenagens, molas e rolamentos',
      'Limpeza e lubrificação adequada com produtos indicados para evitar desgaste e oxidação',
      'Testes de funcionamento dos controles, motores e dispositivos de segurança, como fotocélulas e travas',
      'Relatório técnico com orientações e, se necessário, indicação de manutenção corretiva'
    ],
    benefits: [
      'Redução de paradas e quebras, evitando gastos altos com consertos emergenciais',
      'Maior segurança para usuários, com sensores e sistemas anti-esmagamento sempre revisados e calibrados',
      'Aumento da vida útil de motores, portões e acessórios, preservando o investimento no sistema de automação'
    ]
  }
}

const service = services[slug as keyof typeof services] || null

// Mensagem customizada para o floating WhatsApp button
const floatingMessage = computed(() => {
  if (!service) return ''
  return `Olá! Encontrei o serviço de ${service.title} no site e quero um orçamento.\n\n📍 Bairro: \n⏰ Melhor horário: `
})

// Provide mensagem para o floating button
provide('whatsappMessage', floatingMessage.value)

// Função para enviar mensagem WhatsApp personalizada
const handleWhatsApp = () => {
  if (!service) return
  
  const messages: Record<string, string> = {
    'automacao-portoes': 'Olá! Quero orçamento de Automação de Portão.\n\n📍 Bairro: \n🚪 Tipo de portão (basculante/deslizante/pivotante): \n⏰ Melhor horário: ',
    'cameras-seguranca': 'Olá! Quero orçamento de Câmeras de Segurança.\n\n📍 Bairro: \n📹 Quantas câmeras: \n🏠 Tipo de imóvel (casa/apto/comércio): ',
    'interfones': 'Olá! Quero orçamento de Interfone/Vídeo Porteiro.\n\n📍 Bairro: \n🏠 Tipo de imóvel: \n📱 Precisa de app: ',
    'fotocelula': 'Olá! Quero orçamento de Fotocélula Anti-Esmagamento.\n\n📍 Bairro: \n🚪 Tipo de portão: \n⏰ Melhor horário: ',
    'travas-eletronicas': 'Olá! Quero orçamento de Trava Eletrônica.\n\n📍 Bairro: \n🚪 Tipo de portão: \n⏰ Melhor horário: ',
    'manutencao': 'Olá! Quero orçamento de Manutenção Preventiva.\n\n📍 Bairro: \n🚪 Tipo de equipamento: \n⚠️ Problema: '
  }
  
  const message = messages[slug] || `Olá! Quero orçamento de ${service.title}.\n\n📍 Bairro: \n⏰ Melhor horário: `
  sendMessage(message)
}

// Descrições curtas focadas em resultado
const getShortDescription = (serviceSlug: string): string => {
  const descriptions: Record<string, string> = {
    'automacao-portoes': 'Instalação profissional de motores para portões com as melhores marcas. Mais comodidade e segurança no seu dia a dia.',
    'cameras-seguranca': 'Monitoramento 24h pelo celular com câmeras de alta definição. Proteja sua família e patrimônio de qualquer lugar.',
    'interfones': 'Veja e fale com visitantes antes de abrir. Sistema Intelbras com vídeo, áudio e abertura remota.',
    'fotocelula': 'Sensor de segurança que impede acidentes. Detecta pessoas e objetos, interrompendo o portão automaticamente.',
    'travas-eletronicas': 'Proteção extra contra invasões. Trava eletrônica de alta resistência com acionamento remoto.',
    'manutencao': 'Evite paradas e consertos caros. Manutenção preventiva aumenta a vida útil e garante segurança.'
  }
  return descriptions[serviceSlug] || service?.description || ''
}

// Extrair highlight do benefício (primeira parte até vírgula ou ponto)
const getBenefitHighlight = (benefit: string): string => {
  const match = benefit.match(/^([^,\.]+)[,\.]/)
  return match ? match[1] : benefit.split(' ').slice(0, 3).join(' ')
}

// Extrair resto do benefício
const getBenefitRest = (benefit: string): string => {
  const match = benefit.match(/^([^,\.]+)([,\.].*)/)
  return match ? match[2] : ''
}

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
