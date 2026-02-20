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
            <div class="mb-8">
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

            <!-- Informações Técnicas / SEO -->
            <div v-if="service.seoText" class="bg-surface p-6 rounded-lg border border-border-light">
              <h2 class="text-2xl font-bold text-text-primary mb-4">Informações Técnicas</h2>
              <p class="text-text-secondary leading-relaxed">{{ service.seoText }}</p>
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
