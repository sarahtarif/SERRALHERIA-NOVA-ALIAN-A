<template>
  <div id="service-detail-page" class="bg-white min-h-screen">
    <div class="lg:hidden"><NavTop /></div>
    <div class="hidden lg:block"><NavDesktop /></div>

    <div v-if="service" class="pt-16">
      <ServiceHero :service="service" @whatsapp="handleWhatsApp" />

      <section class="py-20 px-4 bg-white">
        <div class="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          <div class="lg:col-span-2 space-y-16">

            <div>
              <h2 class="text-2xl font-bold text-slate-800 mb-6 border-l-4 pl-4" :class="service.themeBorder">
                O que está incluído
              </h2>
              <div class="grid sm:grid-cols-2 gap-4">
                <div
                  v-for="feature in service.features"
                  :key="feature.title"
                  class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3"
                >
                  <span class="material-symbols-outlined text-2xl flex-shrink-0" :class="service.themeColor">{{ feature.icon }}</span>
                  <div>
                    <h3 class="font-bold text-slate-800 text-sm">{{ feature.title }}</h3>
                    <p class="text-slate-500 text-xs mt-1 leading-relaxed">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-slate-800 mb-6 border-l-4 pl-4" :class="service.themeBorder">
                Como funciona
              </h2>
              <div class="space-y-6">
                <div v-for="(step, index) in service.steps" :key="step.title" class="flex gap-4 items-start">
                  <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800">{{ step.title }}</h3>
                    <p class="text-slate-500 text-sm mt-1 leading-relaxed">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-slate-800 mb-6 border-l-4 pl-4" :class="service.themeBorder">
                Para quem é indicado
              </h2>
              <div class="grid sm:grid-cols-2 gap-3">
                <div v-for="item in service.indicatedFor" :key="item" class="flex items-center gap-2 text-slate-700 text-sm">
                  <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ item }}
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold text-slate-800 mb-6 border-l-4 pl-4" :class="service.themeBorder">
                Perguntas Frequentes
              </h2>
              <div class="space-y-2">
                <div v-for="(item, index) in service.faq" :key="item.question" class="border-b border-slate-100">
                  <button class="w-full flex justify-between items-center py-4 text-left gap-4" @click="toggleFaq(index)">
                    <span class="font-semibold text-slate-800 text-sm md:text-base">{{ item.question }}</span>
                    <svg
                      class="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200"
                      :class="openFaq === index ? 'rotate-180' : ''"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <div v-show="openFaq === index" class="pb-4 text-slate-500 text-sm leading-relaxed">
                    {{ item.answer }}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <ServiceSidebar :related-services="relatedServices" @whatsapp="handleWhatsApp" />
        </div>
      </section>

      <ServiceCtaFinal @whatsapp="handleWhatsApp" />
    </div>

    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 class="text-2xl font-bold text-slate-800">Serviço não encontrado</h1>
      <p class="text-slate-500">O serviço que você procura não existe.</p>
      <NuxtLink to="/" class="text-primary font-medium hover:underline">← Voltar ao início</NuxtLink>
    </div>

    <div class="lg:hidden"><PageFooter /></div>
    <div class="hidden lg:block"><FooterDesktop /></div>
    <WhatsAppFab />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NuxtLink } from '#components'
import { getServiceBySlug, getRelatedServices } from '../../utils/servicesData'
import { useWhatsApp } from '../../composables/useWhatsApp'
import NavTop from '../../components/NavTop.vue'
import NavDesktop from '../../components/NavDesktop.vue'
import PageFooter from '../../components/PageFooter.vue'
import FooterDesktop from '../../components/FooterDesktop.vue'
import WhatsAppFab from '../../components/WhatsAppFab.vue'
import ServiceHero from '../../components/ServiceHero.vue'
import ServiceSidebar from '../../components/ServiceSidebar.vue'
import ServiceCtaFinal from '../../components/ServiceCtaFinal.vue'

export default defineComponent({
  name: 'ServiceDetailPage',
  components: {
    NuxtLink,
    NavTop,
    NavDesktop,
    PageFooter,
    FooterDesktop,
    WhatsAppFab,
    ServiceHero,
    ServiceSidebar,
    ServiceCtaFinal,
  },
  setup() {
    const route = useRoute()
    const { sendMessage } = useWhatsApp()
    const openFaq = ref<number | null>(null)

    const service = computed(() => getServiceBySlug(route.params.slug as string))
    const relatedServices = computed(() =>
      service.value ? getRelatedServices(service.value.relatedSlugs) : []
    )

    function toggleFaq(index: number): void {
      openFaq.value = openFaq.value === index ? null : index
    }

    function handleWhatsApp(): void {
      if (!service.value) return
      sendMessage(service.value.whatsappMessage)
    }

    return { service, relatedServices, openFaq, toggleFaq, handleWhatsApp }
  },
})
</script>
