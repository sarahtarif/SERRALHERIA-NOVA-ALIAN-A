<template>
  <section id="services-grid" class="bg-surface py-12 md:py-20 pb-20 px-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h2 class="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-3">
          Nossos Serviços
        </h2>
        <p class="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto mb-2">
          Soluções completas em automação, segurança e serralheria para sua propriedade
        </p>
        <p class="text-on-surface-variant text-sm">
          Escolha o serviço e clique em <span class="font-bold text-on-surface">Pedir orçamento</span> para falar direto no WhatsApp
        </p>
      </div>

      <!-- Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <CardContainer
          v-for="service in services"
          :key="service.slug"
          :id="service.slug"
          @click="handleCardClick(service)"
          class="cursor-pointer"
        >
          <CardBody>
            <!-- Badge -->
            <div v-if="service.badge" class="absolute top-4 right-4 z-10">
              <CardItem :translate-z="40">
                <span
                  class="text-xs font-bold px-2 py-1 rounded-full"
                  :class="service.badge.class"
                >
                  {{ service.badge.label }}
                </span>
              </CardItem>
            </div>

            <div class="p-6 flex flex-col gap-4">
              <!-- Icon -->
              <CardItem :translate-z="50">
                <div
                  class="w-16 h-16 rounded-lg flex items-center justify-center"
                  :class="service.iconBg"
                >
                  <div class="w-8 h-8" :class="service.iconColor" v-html="service.svg" />
                </div>
              </CardItem>

              <!-- Title -->
              <CardItem :translate-z="75">
                <h3 class="font-headline font-bold text-xl md:text-2xl text-on-surface group-hover/card:text-primary transition-colors">
                  {{ service.title }}
                </h3>
              </CardItem>

              <!-- Description -->
              <CardItem :translate-z="60">
                <p class="text-sm text-on-surface-variant leading-relaxed">
                  <span class="font-bold text-on-surface">{{ service.highlight }}</span>
                  {{ service.description }}
                </p>
              </CardItem>

              <!-- Button -->
              <CardItem :translate-z="50">
                <button
                  class="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  @click.stop="handleWhatsApp(service.title, service.whatsappMessage)"
                >
                  <svg class="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.557-5.331 11.888-11.887 11.888-2.01 0-3.986-.511-5.741-1.483l-6.243 1.808zm6.086-5.309l.395.234c1.46.868 3.144 1.326 4.873 1.326 5.105 0 9.259-4.155 9.259-9.259 0-2.473-.962-4.798-2.71-6.546s-4.074-2.71-6.547-2.71c-5.105 0-9.26 4.155-9.26 9.259 0 1.634.428 3.234 1.239 4.647l.257.447-1.011 3.696 3.792-1.094zm9.215-6.096c-.244-.122-1.444-.712-1.668-.794-.223-.081-.387-.122-.55.122-.162.244-.63.794-.772.956-.142.163-.284.183-.528.061-.244-.122-1.029-.38-1.959-1.209-.724-.647-1.213-1.445-1.354-1.689-.142-.244-.015-.376.107-.497.111-.11.244-.285.366-.427.122-.142.162-.244.244-.406.081-.162.04-.305-.02-.426-.061-.122-.55-1.326-.752-1.815-.197-.474-.397-.41-.55-.417l-.467-.006c-.162 0-.427.061-.65.305-.223.244-.854.834-.854 2.035 0 1.201.874 2.36 1.015 2.544.142.183 1.72 2.626 4.167 3.682.582.251 1.036.401 1.391.514.585.186 1.117.16 1.537.098.468-.069 1.444-.59 1.648-1.159.203-.569.203-1.057.142-1.159-.061-.101-.223-.162-.468-.284z"/>
                  </svg>
                  Pedir Orçamento no WhatsApp
                </button>
              </CardItem>

              <!-- Details link (desktop only) -->
              <CardItem :translate-z="50">
                <div class="text-center">
                  <NuxtLink
                    :to="`/servicos/${service.slug}`"
                    class="text-primary text-sm font-medium hover:underline"
                    @click.stop
                  >
                    Detalhes do serviço →
                  </NuxtLink>
                </div>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWhatsApp } from '../composables/useWhatsApp'
import CardContainer from './CardContainer.vue'
import CardBody from './CardBody.vue'
import CardItem from './CardItem.vue'
import { NuxtLink } from '#components'

interface ServiceBadge {
  label: string
  class: string
}

interface Service {
  slug: string
  title: string
  highlight: string
  description: string
  iconBg: string
  iconColor: string
  svg: string
  badge?: ServiceBadge
  whatsappMessage: string
}

export default defineComponent({
  name: 'ServicesGrid',
  components: { CardContainer, CardBody, CardItem, NuxtLink },
  setup() {
    const router = useRouter()
    const { sendMessage } = useWhatsApp()
    const isMobile = ref(false)

    onMounted(() => {
      isMobile.value = window.innerWidth < 768
      window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth < 768
      })
    })

    function handleWhatsApp(serviceName: string, customMessage?: string): void {
      const fallback = `Olá! Tenho interesse no serviço de ${serviceName}. Poderia me passar mais informações?`
      sendMessage(customMessage || fallback)
    }

    function handleCardClick(service: Service): void {
      if (!isMobile.value) {
        router.push(`/servicos/${service.slug}`)
      } else {
        handleWhatsApp(service.title, service.whatsappMessage)
      }
    }

    const services: Service[] = [
      {
        slug: 'automacao-portoes',
        title: 'Automação de Portões',
        highlight: 'Instalação em até 24h.',
        description: ' Motor, fotocélula, controle remoto e app. Atendemos residências e condomínios em toda SP.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        badge: { label: 'Mais solicitado', class: 'bg-primary/20 text-primary font-bold' },
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6M3 15h6"/></svg>`,
        whatsappMessage: `Olá! Gostaria de um orçamento para *Automação de Portões* 🚪\n\n📍 Bairro: \n🚪 Tipo de portão (deslizante/basculante/pivotante): \n⏰ Melhor horário para visita: `,
      },
      {
        slug: 'cameras-seguranca',
        title: 'Câmeras de Segurança',
        highlight: 'Monitoramento 24h.',
        description: ' Câmeras HD, infravermelho e acesso remoto pelo celular. Instalação profissional com garantia.',
        iconBg: 'bg-surface-container-highest',
        iconColor: 'text-on-surface-variant',
        badge: { label: 'Ideal para condomínios', class: 'bg-secondary-container/30 text-secondary font-bold' },
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
        whatsappMessage: `Olá! Gostaria de um orçamento para *Câmeras de Segurança* 📹\n\n📍 Bairro: \n📹 Quantidade de câmeras desejada: \n🏠 Tipo de imóvel (residência/comércio/condomínio): `,
      },
      {
        slug: 'interfones',
        title: 'Interfones e Vídeo Porteiro',
        highlight: 'Veja quem está na porta.',
        description: ' Interfones com câmera, áudio e vídeo em alta definição. Compatível com aplicativo no celular.',
        iconBg: 'bg-surface-container-highest',
        iconColor: 'text-on-surface-variant',
        badge: undefined,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="7" r="2"/><path d="M8 14h8M8 18h5"/></svg>`,
        whatsappMessage: `Olá! Gostaria de um orçamento para *Interfone/Vídeo Porteiro* 📱\n\n📍 Bairro: \n🏠 Tipo de imóvel: \n📱 Precisa de acesso pelo app? (sim/não): `,
      },
      {
        slug: 'fotocelula',
        title: 'Fotocélula Anti-Esmagamento',
        highlight: 'Proteção contra acidentes.',
        description: ' Sensor que detecta obstáculos e para o portão automaticamente. Obrigatório por norma técnica.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        badge: { label: 'Proteção extra', class: 'bg-primary/20 text-primary font-bold' },
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
        whatsappMessage: `Olá! Gostaria de um orçamento para *Fotocélula Anti-Esmagamento* ⚠️\n\n📍 Bairro: \n🚪 Tipo de portão: \n⏰ Melhor horário para visita: `,
      },
      {
        slug: 'travas-eletronicas',
        title: 'Travas Eletrônicas',
        highlight: 'Proteção contra furtos.',
        description: ' Fechaduras digitais, biométricas e com senha. Controle de acesso para portas e portões.',
        iconBg: 'bg-surface-container-highest',
        iconColor: 'text-on-surface-variant',
        badge: { label: 'Proteção extra', class: 'bg-primary/20 text-primary font-bold' },
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
        whatsappMessage: `Olá! Gostaria de um orçamento para *Travas Eletrônicas* 🔒\n\n📍 Bairro: \n🚪 Tipo de portão/porta: \n⏰ Melhor horário para visita: `,
      },
      {
        slug: 'manutencao',
        title: 'Manutenção Preventiva',
        highlight: 'Atendimento em até 24h.',
        description: ' Revisão completa do motor, sensores e estrutura. Evite panes e prolongue a vida útil do equipamento.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        badge: undefined,
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>`,
        whatsappMessage: `Olá! Gostaria de agendar *Manutenção Preventiva* 🔧\n\n📍 Bairro: \n⚙️ Tipo de equipamento (motor/câmera/interfone): \n⚠️ Problema identificado: `,
      },
    ]

    return { services, isMobile, handleWhatsApp, handleCardClick }
  },
})
</script>
