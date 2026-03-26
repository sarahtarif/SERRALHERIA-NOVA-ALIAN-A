<template>
  <div id="sobre-page" class="bg-surface text-on-surface font-body antialiased min-h-screen">

    <!-- Nav -->
    <div class="lg:hidden"><NavTop /></div>
    <div class="hidden lg:block"><NavDesktop /></div>

    <main class="pt-20">

      <!-- Âncora para scroll -->
      <div id="sobre" style="position:absolute;margin-top:-80px;pointer-events:none;" aria-hidden="true"/>

      <!-- Hero -->
      <section class="relative py-24 px-4 overflow-hidden bg-surface-container-low">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary-container/10 pointer-events-none" />
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Nossa História
          </span>
          <h1 class="text-4xl md:text-6xl font-bold font-headline text-on-surface mb-6 leading-tight">
            Serralheria<br />
            <span class="text-primary">Nova Aliança</span>
          </h1>
          <p class="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Mais de 15 anos transformando segurança em tranquilidade para famílias e empresas em São Paulo
          </p>
        </div>
      </section>

      <!-- Trajetória -->
      <section class="py-20 px-4 bg-surface">
        <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-6">
            <h2 class="text-3xl md:text-4xl font-bold font-headline text-on-surface">Nossa Trajetória</h2>
            <div class="space-y-4 text-on-surface-variant leading-relaxed">
              <p>
                Fundada em 2010, a Serralheria Nova Aliança nasceu do sonho de oferecer soluções completas em automação e segurança para residências e empresas em São Paulo.
              </p>
              <p>
                Com mais de 15 anos de experiência, nos consolidamos como referência no mercado de automação de portões, instalação de travas eletrônicas, interfones, câmeras de segurança e serralheria em geral.
              </p>
              <p>
                Nossa missão sempre foi clara: proporcionar segurança, conforto e tranquilidade para nossos clientes através de serviços de excelência, atendimento personalizado e uso das melhores tecnologias disponíveis no mercado.
              </p>
              <p>
                Hoje, contamos com uma equipe altamente qualificada e certificada pelas principais marcas do setor, garantindo instalações seguras e manutenções preventivas que prolongam a vida útil dos equipamentos.
              </p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-surface-container border border-outline-variant rounded-xl p-6 text-center"
            >
              <div class="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">{{ stat.value }}</div>
              <div class="text-sm text-on-surface-variant">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Valores -->
      <section class="py-20 px-4 bg-surface-container-low">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold font-headline text-on-surface mb-4">Nossos Valores</h2>
            <p class="text-on-surface-variant max-w-xl mx-auto">Princípios que guiam nosso trabalho e relacionamento com clientes</p>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            <div
              v-for="value in values"
              :key="value.title"
              class="bg-surface-container border border-outline-variant rounded-xl p-8 text-center hover:border-primary/40 transition-colors duration-200"
            >
              <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <component :is="value.icon" class="w-7 h-7 text-primary" />
              </div>
              <h3 class="text-lg font-bold font-headline text-on-surface mb-3">{{ value.title }}</h3>
              <p class="text-sm text-on-surface-variant leading-relaxed">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Por que nos escolher -->
      <section class="py-20 px-4 bg-surface">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold font-headline text-on-surface mb-4">Por Que Nos Escolher?</h2>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="reason in reasons"
              :key="reason.title"
              class="flex gap-4 items-start bg-surface-container border border-outline-variant rounded-xl p-5 hover:border-primary/40 transition-colors duration-200"
            >
              <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <component :is="reason.icon" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 class="font-bold text-on-surface text-sm mb-1">{{ reason.title }}</h3>
                <p class="text-xs text-on-surface-variant leading-relaxed">{{ reason.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 px-4 bg-surface-container-low text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-bold font-headline text-on-surface mb-4">Pronto para começar?</h2>
          <p class="text-on-surface-variant mb-8">Entre em contato e solicite um orçamento sem compromisso.</p>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors duration-200 shadow-lg shadow-primary/20"
          >
            Solicitar Orçamento
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </NuxtLink>
        </div>
      </section>

    </main>

    <div class="lg:hidden"><PageFooter /></div>
    <div class="hidden lg:block"><FooterDesktop /></div>
    <div class="lg:hidden"><NavBottom /></div>
    <WhatsAppFab />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { NuxtLink } from '#components'
import NavTop from '../components/NavTop.vue'
import NavDesktop from '../components/NavDesktop.vue'
import NavBottom from '../components/NavBottom.vue'
import PageFooter from '../components/PageFooter.vue'
import FooterDesktop from '../components/FooterDesktop.vue'
import WhatsAppFab from '../components/WhatsAppFab.vue'

// SVG icon components inline
const IconStar = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('path', { d: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' })
  ])
})

const IconHandshake = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('path', { d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
})

const IconEye = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('path', { d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' }),
    h('path', { d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' })
  ])
})

const IconClock = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polyline', { points: '12 6 12 12 16 14' })
  ])
})

const IconShield = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('path', { d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
  ])
})

const IconBadge = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('path', { d: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' })
  ])
})

const IconCard = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('rect', { x: '1', y: '4', width: '22', height: '16', rx: '2', ry: '2' }),
    h('line', { x1: '1', y1: '10', x2: '23', y2: '10' })
  ])
})

const IconSupport = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '2' }, [
    h('path', { d: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' })
  ])
})

const stats = [
  { value: '+15', label: 'Anos de Experiência' },
  { value: '+5000', label: 'Projetos Realizados' },
  { value: '98%', label: 'Clientes Satisfeitos' },
  { value: '24h', label: 'Atendimento Emergencial' },
]

const values = [
  {
    title: 'Qualidade',
    description: 'Utilizamos apenas materiais e equipamentos de primeira linha, garantindo durabilidade e segurança.',
    icon: IconStar,
  },
  {
    title: 'Compromisso',
    description: 'Cumprimos prazos e mantemos nossa palavra. Sua satisfação é nossa prioridade.',
    icon: IconHandshake,
  },
  {
    title: 'Transparência',
    description: 'Orçamentos claros e detalhados, sem surpresas ou custos ocultos.',
    icon: IconEye,
  },
]

const reasons = [
  { title: 'Atendimento Rápido', description: 'Resposta em até 2 horas e visita técnica em 24h', icon: IconClock },
  { title: 'Equipe Qualificada', description: 'Profissionais certificados e experientes', icon: IconBadge },
  { title: 'Garantia Estendida', description: '90 dias de garantia em mão de obra', icon: IconShield },
  { title: 'Melhores Marcas', description: 'PPA, Intelbras, Garen, RCG e outras', icon: IconBadge },
  { title: 'Pagamento Facilitado', description: 'Parcelamento em até 12x no cartão', icon: IconCard },
  { title: 'Pós-Venda', description: 'Suporte contínuo após a instalação', icon: IconSupport },
]
</script>
