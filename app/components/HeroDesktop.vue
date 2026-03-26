<template>
  <main id="hero-desktop" class="relative min-h-screen flex flex-col justify-center pt-20">
    <!-- Background -->
    <div class="absolute inset-0 z-0">
      <img
        class="w-full h-full object-cover brightness-[0.3]"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQcVTR88ppb8q4Xs9oJ9fvcamS91IckwnRKkngWh1QioC4O4hyT2jkjxh7ROLpaKsZku6s3prsarmkn2Qbs9OEo4WcV4evQqwJeDHRKr_xnlHUNDFujKwva5u4Ts0kT9SYDyA2IUt7YvfF4hwu7yKzuD7xVCnCFs6r8y0YaY27xlJPaCocOX_ixjfbb6L80dW1LkUSIa5bg2Z-JJBrW4oRp_hlbBVk-TEF9vC6FEVi_ennWIf9LvjUgxXvvZ0vUNDmgAsrrdL-bigo"
        alt="Residência moderna com portão automatizado ao entardecer"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/20 to-transparent"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-12 gap-12 items-center py-16">
      <!-- Content -->
      <div class="col-span-7 space-y-8">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-xs font-semibold tracking-wide uppercase mb-6">
            <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
            {{ cfg.get('hero_desktop_anos', '+15 anos em São Paulo') }}
          </span>
          <h1 class="font-headline text-5xl lg:text-7xl font-bold tracking-tighter text-on-surface leading-[1.1] mb-6">
            {{ cfg.get('hero_desktop_titulo', 'Automação de Portões em São Paulo + Segurança Eletrônica') }}
          </h1>
          <p class="text-on-surface-variant text-lg lg:text-xl max-w-2xl leading-relaxed">
            {{ cfg.get('hero_desktop_subtitulo', 'Instalação e manutenção com atendimento rápido e solução completa (motor, fotocélula, trava, interfone e câmeras).') }}
          </p>
        </div>

        <div class="flex gap-4 pt-4">
          <button
            class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-md font-headline font-bold text-lg flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20"
          >
            Solicitar Orçamento
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
          <button
            class="border border-outline-variant/30 hover:bg-white/5 text-primary px-8 py-4 rounded-md font-headline font-bold text-lg transition-all"
            @click="scrollToServices"
          >
            Nossos Serviços
          </button>
        </div>
      </div>

      <!-- Trust Grid -->
      <div class="col-span-5 grid grid-cols-2 gap-4">
        <TrustCard
          v-for="card in trustCards"
          :key="card.icon"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :accent="card.accent"
        />
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
      <span class="text-[10px] font-label tracking-widest uppercase text-on-surface-variant">Explorar</span>
      <div class="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import TrustCard from './TrustCard.vue'
import { useSiteConfig } from '../composables/useSiteConfig'

export default defineComponent({
  name: 'HeroDesktop',
  components: { TrustCard },
  setup() {
    const cfg = useSiteConfig()
    onMounted(() => cfg.carregar())

    function scrollToServices(): void {
      const el = document.getElementById('services-grid')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    const trustCards = [
      { icon: 'shield', title: 'Anti-Esmagamento', description: 'Sensores inteligentes para proteção total de veículos e pedestres.', accent: 'primary' as const },
      { icon: 'bolt', title: 'Contra Surtos', description: 'Proteção eletrônica avançada contra picos de energia e raios.', accent: 'secondary' as const },
      { icon: 'verified_user', title: 'Garantia', description: 'Equipamentos certificados com garantia estendida de fábrica.', accent: 'primary' as const },
      { icon: 'support_agent', title: 'Suporte 24h', description: 'Atendimento emergencial prioritário para toda Grande SP.', accent: 'secondary' as const },
    ]
    return { trustCards, cfg, scrollToServices }
  },
})
</script>
