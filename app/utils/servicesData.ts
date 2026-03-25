export interface ServiceFeature {
  icon: string
  title: string
  description: string
}

export interface ServiceStep {
  title: string
  description: string
}

export interface ServiceFaq {
  question: string
  answer: string
}

export interface ServiceData {
  slug: string
  title: string
  category: string
  shortDescription: string
  highlight: string
  themeColor: string
  themeBg: string
  themeBorder: string
  iconSvg: string
  heroFeatures: string[]
  heroBgImage?: string
  heroBgPosition?: string
  features: ServiceFeature[]
  steps: ServiceStep[]
  indicatedFor: string[]
  faq: ServiceFaq[]
  whatsappMessage: string
  relatedSlugs: string[]
}

const allServices: ServiceData[] = [
  {
    slug: 'automacao-portoes',
    title: 'Automação de Portões',
    category: 'Automação',
    shortDescription: 'Instalação de motores para portões basculantes, deslizantes e pivotantes com controle remoto e app.',
    highlight: 'Instalação em até 24h',
    themeColor: 'text-primary',
    themeBg: 'bg-primary/10',
    themeBorder: 'border-primary',
    iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    heroFeatures: ['Instalação em até 24h', 'Controle pelo smartphone', 'Peças originais com garantia', 'Atendimento em toda SP'],
    heroBgImage: '/images/automacao_de_portoes-27.png',
    features: [
      { icon: 'bolt', title: 'Motor de Alta Performance', description: 'Motores PPA, Garen e Intelbras com potência para qualquer tipo de portão.' },
      { icon: 'smartphone', title: 'Controle pelo App', description: 'Abra e feche o portão de qualquer lugar pelo celular.' },
      { icon: 'shield', title: 'Fotocélula Inclusa', description: 'Sensor anti-esmagamento instalado junto com o motor.' },
      { icon: 'build', title: 'Instalação Profissional', description: 'Técnicos certificados, sem danos à estrutura do portão.' },
      { icon: 'wifi', title: 'Controle Remoto', description: 'Até 4 controles remotos inclusos na instalação.' },
      { icon: 'verified', title: 'Garantia Estendida', description: '90 dias de mão de obra + garantia do fabricante nas peças.' },
    ],
    steps: [
      { title: 'Visita técnica gratuita', description: 'Avaliamos o portão, medidas e tipo de instalação necessária.' },
      { title: 'Escolha do motor', description: 'Indicamos o modelo ideal para o peso e tamanho do seu portão.' },
      { title: 'Instalação em até 24h', description: 'Instalação rápida e limpa, sem obras ou quebra de estrutura.' },
      { title: 'Teste e orientação', description: 'Testamos tudo e ensinamos a usar o controle e o app.' },
    ],
    indicatedFor: ['Residências com portão basculante', 'Portões deslizantes', 'Condomínios', 'Comércios e lojas', 'Portões pivotantes', 'Quem quer praticidade'],
    faq: [
      { question: 'Qual motor é indicado para meu portão?', answer: 'Depende do peso e tipo do portão. Na visita técnica gratuita indicamos o modelo ideal.' },
      { question: 'O motor funciona em queda de energia?', answer: 'Sim, a maioria dos modelos possui bateria de emergência para abrir manualmente.' },
      { question: 'Quanto tempo leva a instalação?', answer: 'Em média 2 a 4 horas, sem necessidade de obras.' },
      { question: 'Tem garantia?', answer: 'Sim, 90 dias de garantia em mão de obra e garantia do fabricante nas peças.' },
    ],
    whatsappMessage: 'Olá! Quero orçamento de Automação de Portão.\n\n📍 Bairro: \n🚪 Tipo de portão (basculante/deslizante/pivotante): \n⏰ Melhor horário: ',
    relatedSlugs: ['fotocelula', 'travas-eletronicas', 'manutencao'],
  },
  {
    slug: 'cameras-seguranca',
    title: 'Câmeras de Segurança',
    category: 'Segurança',
    shortDescription: 'Câmeras HD com visão noturna, áudio e acesso remoto pelo celular para monitoramento 24h.',
    highlight: 'Monitoramento 24h',
    themeColor: 'text-red-400',
    themeBg: 'bg-red-500/10',
    themeBorder: 'border-red-400',
    iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
    heroFeatures: ['Monitoramento 24h pelo celular', 'Visão noturna infravermelha', 'Gravação em nuvem ou HD', 'Instalação profissional'],
    heroBgImage: '/images/banner_monitoramento.jpeg',
    features: [
      { icon: 'videocam', title: 'Câmeras Full HD', description: 'Imagens nítidas em 1080p ou 4K para identificação precisa.' },
      { icon: 'nights_stay', title: 'Visão Noturna', description: 'Infravermelho de longo alcance para monitoramento noturno.' },
      { icon: 'smartphone', title: 'Acesso Remoto', description: 'Veja as câmeras em tempo real pelo celular de qualquer lugar.' },
      { icon: 'cloud', title: 'Gravação em Nuvem', description: 'Armazenamento seguro na nuvem ou em HD local.' },
      { icon: 'mic', title: 'Áudio Bidirecional', description: 'Ouça e fale através das câmeras com microfone e alto-falante.' },
      { icon: 'notifications', title: 'Alertas Inteligentes', description: 'Notificações no celular ao detectar movimento.' },
    ],
    steps: [
      { title: 'Visita técnica gratuita', description: 'Avaliamos os pontos cegos e melhores ângulos de cobertura.' },
      { title: 'Projeto de instalação', description: 'Definimos quantidade, posicionamento e tipo de câmeras.' },
      { title: 'Instalação e cabeamento', description: 'Instalação organizada com passagem de cabos embutida.' },
      { title: 'Configuração e acesso', description: 'Configuramos o app no seu celular e testamos tudo.' },
    ],
    indicatedFor: ['Residências', 'Condomínios e edifícios', 'Comércios e lojas', 'Estacionamentos', 'Empresas e escritórios', 'Quem viaja frequentemente'],
    faq: [
      { question: 'Quantas câmeras preciso?', answer: 'Depende do tamanho do imóvel. Na visita técnica fazemos o projeto completo gratuitamente.' },
      { question: 'Funciona à noite?', answer: 'Sim, todas as câmeras possuem infravermelho para visão noturna de até 30 metros.' },
      { question: 'Posso ver pelo celular?', answer: 'Sim, configuramos o acesso remoto no seu smartphone durante a instalação.' },
      { question: 'Tem garantia?', answer: 'Sim, 90 dias de mão de obra e garantia do fabricante nos equipamentos.' },
    ],
    whatsappMessage: 'Olá! Quero orçamento de Câmeras de Segurança.\n\n📍 Bairro: \n📹 Quantas câmeras: \n🏠 Tipo de imóvel (casa/apto/comércio): ',
    relatedSlugs: ['interfones', 'travas-eletronicas', 'automacao-portoes'],
  },
  {
    slug: 'interfones',
    title: 'Interfones e Vídeo Porteiro',
    category: 'Comunicação',
    shortDescription: 'Interfones com câmera de alta definição para ver e falar com visitantes antes de abrir o portão.',
    highlight: 'Veja quem está na porta',
    themeColor: 'text-sky-400',
    themeBg: 'bg-sky-500/10',
    themeBorder: 'border-sky-400',
    iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="7" r="2"/><path d="M8 14h8M8 18h5"/></svg>`,
    heroFeatures: ['Veja quem está na porta', 'Áudio e vídeo HD', 'Acesso pelo app', 'Compatível com portão automático'],
    heroBgImage: '/images/07-VideoPorteiro.png',
    features: [
      { icon: 'videocam', title: 'Câmera HD', description: 'Imagem nítida para identificar visitantes com clareza.' },
      { icon: 'mic', title: 'Áudio Bidirecional', description: 'Converse com o visitante sem abrir o portão.' },
      { icon: 'smartphone', title: 'App no Celular', description: 'Atenda o interfone de qualquer lugar pelo smartphone.' },
      { icon: 'lock', title: 'Abertura Remota', description: 'Abra o portão ou a porta diretamente pelo interfone.' },
      { icon: 'nights_stay', title: 'Visão Noturna', description: 'Câmera com infravermelho para uso noturno.' },
      { icon: 'verified', title: 'Instalação Profissional', description: 'Técnicos certificados Intelbras e HDL.' },
    ],
    steps: [
      { title: 'Avaliação do local', description: 'Verificamos a estrutura e o melhor ponto de instalação.' },
      { title: 'Escolha do modelo', description: 'Indicamos o interfone ideal para o seu imóvel.' },
      { title: 'Instalação e cabeamento', description: 'Instalação limpa com cabeamento organizado.' },
      { title: 'Configuração do app', description: 'Configuramos o acesso remoto no seu celular.' },
    ],
    indicatedFor: ['Residências', 'Apartamentos', 'Condomínios', 'Comércios', 'Quem quer mais segurança', 'Quem viaja frequentemente'],
    faq: [
      { question: 'Funciona com portão automático?', answer: 'Sim, integramos o interfone com o motor do portão para abertura automática.' },
      { question: 'Posso atender pelo celular?', answer: 'Sim, com os modelos compatíveis configuramos o app para atendimento remoto.' },
      { question: 'Funciona sem internet?', answer: 'A função básica de interfone funciona sem internet. O app requer conexão.' },
      { question: 'Tem garantia?', answer: 'Sim, 90 dias de mão de obra e garantia do fabricante.' },
    ],
    whatsappMessage: 'Olá! Quero orçamento de Interfone/Vídeo Porteiro.\n\n📍 Bairro: \n🏠 Tipo de imóvel: \n📱 Precisa de app: ',
    relatedSlugs: ['cameras-seguranca', 'automacao-portoes', 'travas-eletronicas'],
  },
  {
    slug: 'fotocelula',
    title: 'Fotocélula Anti-Esmagamento',
    category: 'Segurança',
    shortDescription: 'Sensor que detecta obstáculos e interrompe o portão automaticamente, evitando acidentes graves.',
    highlight: 'Proteção contra acidentes',
    themeColor: 'text-yellow-400',
    themeBg: 'bg-yellow-500/10',
    themeBorder: 'border-yellow-400',
    iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
    heroFeatures: ['Proteção contra acidentes', 'Obrigatório por norma técnica', 'Compatível com qualquer motor', 'Instalação rápida'],
    heroBgImage: '/images/sensor-fotocelula-pwm-unisystem-garen_3_300.webp',
    heroBgPosition: 'bottom',
    features: [
      { icon: 'sensors', title: 'Detecção Precisa', description: 'Sensor infravermelho detecta qualquer obstáculo no caminho do portão.' },
      { icon: 'stop_circle', title: 'Parada Imediata', description: 'O portão para e reverte instantaneamente ao detectar obstáculo.' },
      { icon: 'settings', title: 'Compatibilidade Universal', description: 'Funciona com PPA, Garen, RCG, Intelbras e outras marcas.' },
      { icon: 'build', title: 'Instalação Rápida', description: 'Instalação em menos de 1 hora sem obras.' },
      { icon: 'verified_user', title: 'Norma ABNT', description: 'Atende às exigências da norma ABNT NBR 15.597.' },
      { icon: 'family_restroom', title: 'Proteção Familiar', description: 'Essencial para casas com crianças, idosos e animais.' },
    ],
    steps: [
      { title: 'Avaliação do portão', description: 'Verificamos o motor e o tipo de portão para escolher o sensor correto.' },
      { title: 'Instalação do sensor', description: 'Posicionamos os emissores e receptores nos pontos ideais.' },
      { title: 'Integração com o motor', description: 'Conectamos a fotocélula ao sistema de automação existente.' },
      { title: 'Teste e calibração', description: 'Testamos a detecção e calibramos a sensibilidade.' },
    ],
    indicatedFor: ['Residências com portão automático', 'Condomínios', 'Casas com crianças', 'Casas com animais', 'Comércios', 'Quem quer segurança extra'],
    faq: [
      { question: 'É obrigatório ter fotocélula?', answer: 'Sim, a norma ABNT NBR 15.597 exige dispositivo anti-esmagamento em portões automáticos.' },
      { question: 'Funciona com qualquer motor?', answer: 'Sim, trabalhamos com modelos compatíveis com as principais marcas do mercado.' },
      { question: 'Quanto tempo leva a instalação?', answer: 'Em média 30 a 60 minutos, sem necessidade de obras.' },
      { question: 'Tem garantia?', answer: 'Sim, 90 dias de mão de obra e garantia do fabricante.' },
    ],
    whatsappMessage: 'Olá! Quero orçamento de Fotocélula Anti-Esmagamento.\n\n📍 Bairro: \n🚪 Tipo de portão: \n⏰ Melhor horário: ',
    relatedSlugs: ['automacao-portoes', 'travas-eletronicas', 'manutencao'],
  },
  {
    slug: 'travas-eletronicas',
    title: 'Travas Eletrônicas',
    category: 'Segurança',
    shortDescription: 'Sistemas de travamento eletrônico que impedem a abertura forçada do portão, protegendo sua residência ou empresa contra arrombamentos.',
    highlight: 'Proteção contra arrombamento',
    themeColor: 'text-on-surface-variant',
    themeBg: 'bg-surface-container-highest',
    themeBorder: 'border-outline-variant',
    iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    heroFeatures: ['Proteção contra arrombamento', 'Acionamento automático', 'Compatível com qualquer motor', 'Instalação rápida'],
    heroBgImage: '/images/trava_eletrica.png',
    features: [
      { icon: 'lock', title: 'Trava de Segurança', description: 'Impede abertura forçada mesmo sem energia elétrica.' },
      { icon: 'bolt', title: 'Acionamento Automático', description: 'Trava e destrava junto com o motor do portão.' },
      { icon: 'settings', title: 'Compatibilidade Universal', description: 'Funciona com PPA, Garen, RCG, Intelbras e outras marcas.' },
      { icon: 'build', title: 'Instalação Profissional', description: 'Técnicos certificados, sem danos à estrutura.' },
      { icon: 'security', title: 'Resistência Reforçada', description: 'Material de aço temperado de alta resistência.' },
      { icon: 'notifications_active', title: 'Alarme Integrado', description: 'Opcional: dispara ao detectar tentativa de arrombamento.' },
    ],
    steps: [
      { title: 'Visita técnica gratuita', description: 'Avaliamos o portão e escolhemos o modelo de trava adequado.' },
      { title: 'Escolha do modelo', description: 'Indicamos a trava ideal para o peso e tipo do seu portão.' },
      { title: 'Instalação em até 2 horas', description: 'Instalação rápida e limpa, sem obras ou quebra de estrutura.' },
      { title: 'Teste completo', description: 'Testamos o travamento e orientamos sobre o uso correto.' },
    ],
    indicatedFor: ['Residências com portão automático', 'Condomínios e edifícios', 'Comércios e lojas', 'Quem já sofreu tentativa de furto', 'Portões em áreas de risco', 'Quem quer mais segurança'],
    faq: [
      { question: 'A trava funciona sem energia?', answer: 'Sim, a maioria dos modelos mantém o travamento mesmo sem energia elétrica.' },
      { question: 'É compatível com meu motor atual?', answer: 'Trabalhamos com modelos compatíveis com as principais marcas do mercado.' },
      { question: 'Quanto tempo leva a instalação?', answer: 'Em média 1 a 2 horas, sem necessidade de obras.' },
      { question: 'Tem garantia?', answer: 'Sim, 90 dias de garantia em mão de obra e garantia do fabricante nas peças.' },
    ],
    whatsappMessage: 'Olá! Quero orçamento de Trava Eletrônica.\n\n📍 Bairro: \n🚪 Tipo de portão: \n⏰ Melhor horário: ',
    relatedSlugs: ['automacao-portoes', 'fotocelula', 'cameras-seguranca'],
  },
  {
    slug: 'manutencao',
    title: 'Manutenção Preventiva',
    category: 'Manutenção',
    shortDescription: 'Revisão completa do motor, sensores e estrutura para manter seu portão funcionando perfeitamente e evitar panes.',
    highlight: 'Atendimento em até 24h',
    themeColor: 'text-green-400',
    themeBg: 'bg-green-500/10',
    themeBorder: 'border-green-400',
    iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
    heroFeatures: ['Atendimento em até 24h', 'Revisão completa', 'Peças originais', 'Relatório técnico'],
    heroBgImage: '/images/manutencao-de-portao-eletronico.jpg',
    features: [
      { icon: 'build', title: 'Revisão do Motor', description: 'Verificação completa do motor, capacitor e placa eletrônica.' },
      { icon: 'sensors', title: 'Calibração de Sensores', description: 'Ajuste e teste de fotocélulas e sensores de fim de curso.' },
      { icon: 'oil_barrel', title: 'Lubrificação', description: 'Lubrificação de trilhos, correntes e partes móveis.' },
      { icon: 'electrical_services', title: 'Verificação Elétrica', description: 'Teste de fiação, conectores e proteção contra surtos.' },
      { icon: 'settings_remote', title: 'Teste de Controles', description: 'Verificação e reprogramação de controles remotos.' },
      { icon: 'description', title: 'Relatório Técnico', description: 'Laudo completo com o estado do equipamento e recomendações.' },
    ],
    steps: [
      { title: 'Agendamento', description: 'Agende a visita pelo WhatsApp no horário mais conveniente.' },
      { title: 'Diagnóstico completo', description: 'Técnico avalia motor, sensores, estrutura e elétrica.' },
      { title: 'Manutenção e ajustes', description: 'Realizamos todos os ajustes, lubrificação e substituições necessárias.' },
      { title: 'Relatório e orientações', description: 'Entregamos laudo técnico e orientamos sobre cuidados preventivos.' },
    ],
    indicatedFor: ['Portões com mais de 1 ano sem revisão', 'Portões com ruídos ou lentidão', 'Condomínios', 'Comércios com uso intenso', 'Quem quer evitar panes', 'Pós-garantia do fabricante'],
    faq: [
      { question: 'Com que frequência devo fazer manutenção?', answer: 'Recomendamos manutenção preventiva a cada 6 meses para uso residencial e a cada 3 meses para uso intenso.' },
      { question: 'Vocês atendem emergências?', answer: 'Sim, temos atendimento emergencial com resposta em até 2 horas para toda Grande SP.' },
      { question: 'Trabalham com todas as marcas?', answer: 'Sim, atendemos PPA, Garen, RCG, Intelbras, Rossi e outras marcas.' },
      { question: 'Tem garantia no serviço?', answer: 'Sim, 90 dias de garantia em todos os serviços realizados.' },
    ],
    whatsappMessage: 'Olá! Quero orçamento de Manutenção Preventiva.\n\n📍 Bairro: \n🚪 Tipo de equipamento: \n⚠️ Problema: ',
    relatedSlugs: ['automacao-portoes', 'fotocelula', 'travas-eletronicas'],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return allServices.find(s => s.slug === slug)
}

export function getRelatedServices(slugs: string[]): ServiceData[] {
  return slugs.map(s => allServices.find(x => x.slug === s)).filter(Boolean) as ServiceData[]
}

export { allServices }
