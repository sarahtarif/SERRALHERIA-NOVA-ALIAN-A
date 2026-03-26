<template>
  <section id="hero-section" class="relative z-10 px-6 py-12 flex flex-col gap-8 flex-grow">
    <!-- Status badge -->
    <div class="flex items-center gap-2 self-start bg-surface-container-highest px-3 py-1 rounded-full border border-outline-variant/15">
      <span class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ffba35]"></span>
      <span class="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
        {{ cfg.get('hero_badge', 'Atendimento Prioritário SP') }}
      </span>
    </div>

    <!-- Headlines -->
    <div class="space-y-4">
      <h1 class="text-4xl font-headline font-bold leading-tight tracking-tight text-on-surface">
        {{ cfg.get('hero_titulo', 'Automação de Portões em São Paulo + Segurança Eletrônica') }}
      </h1>
      <p class="text-lg text-on-surface-variant font-medium leading-relaxed max-w-sm">
        {{ cfg.get('hero_subtitulo', 'Instalação e manutenção com atendimento rápido e solução completa.') }}
      </p>
    </div>

    <!-- CTAs -->
    <div class="flex flex-col gap-4 mt-4">
      <button
        class="metallic-gradient text-on-primary font-bold py-5 px-8 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-transform flex justify-center items-center gap-2"
      >
        <span class="font-label text-base tracking-wide uppercase">{{ cfg.get('hero_cta_primario', 'Solicitar Orçamento') }}</span>
      </button>
      <button
        class="bg-surface-container-lowest border border-primary/40 text-primary py-5 px-8 rounded-full font-bold flex justify-center items-center gap-2 active:scale-95 transition-transform"
      >
        <span class="material-symbols-outlined text-xl">contact_support</span>
        <span class="font-label text-base tracking-wide">{{ cfg.get('hero_cta_secundario', 'Falar com Consultor') }}</span>
      </button>
    </div>

    <!-- Feature cards -->
    <div class="grid grid-cols-1 gap-3 mt-8">
      <FeatureCard
        v-for="feature in features"
        :key="feature.icon"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import FeatureCard from './FeatureCard.vue'
import { useSiteConfig } from '../composables/useSiteConfig'

export default defineComponent({
  name: 'HeroSection',
  components: { FeatureCard },
  setup() {
    const cfg = useSiteConfig()
    onMounted(() => cfg.carregar())
    const features = [
      { icon: 'speed', title: 'Atendimento 24h', description: 'Manutenção emergencial em toda SP.' },
      { icon: 'shield_with_heart', title: 'Garantia Total', description: 'Segurança e peças originais de fábrica.' },
      { icon: 'settings_remote', title: 'Automação Inteligente', description: 'Controle total pelo seu smartphone.' },
    ]
    return { features, cfg }
  },
})
</script>
