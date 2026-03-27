<template>
  <section
    id="service-hero"
    class="relative text-white py-12 md:py-16 px-4 overflow-hidden min-h-[480px] md:min-h-[420px]"
    :class="service.heroBgImage ? '' : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900'"
  >
    <!-- Imagem de fundo opcional -->
    <template v-if="service.heroBgImage">
      <img
        :src="service.heroBgImage"
        :alt="service.title"
        class="absolute inset-0 w-full h-full object-cover object-center md:object-right"
        :style="service.heroBgPosition ? `object-position: ${service.heroBgPosition}` : ''"
        loading="eager"
      />
      <!-- Overlay mais forte no mobile para legibilidade -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90 md:bg-slate-900/55" />
    </template>

    <div class="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

      <!-- Left: content -->
      <div class="space-y-6">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/10 text-white/80">
          <span class="w-4 h-4" v-html="service.iconSvg" />
          {{ service.category }}
        </span>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          {{ service.title }}
        </h1>

        <p class="text-lg md:text-xl text-slate-300 leading-relaxed max-w-prose">
          {{ service.shortDescription }}
        </p>

        <div class="flex items-center gap-2 text-green-400 font-medium">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ service.highlight }}
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            @click="$emit('whatsapp')"
            class="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors min-h-[48px]"
          >
            <svg class="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.557-5.331 11.888-11.887 11.888-2.01 0-3.986-.511-5.741-1.483l-6.243 1.808zm6.086-5.309l.395.234c1.46.868 3.144 1.326 4.873 1.326 5.105 0 9.259-4.155 9.259-9.259 0-2.473-.962-4.798-2.71-6.546s-4.074-2.71-6.547-2.71c-5.105 0-9.26 4.155-9.26 9.259 0 1.634.428 3.234 1.239 4.647l.257.447-1.011 3.696 3.792-1.094zm9.215-6.096c-.244-.122-1.444-.712-1.668-.794-.223-.081-.387-.122-.55.122-.162.244-.63.794-.772.956-.142.163-.284.183-.528.061-.244-.122-1.029-.38-1.959-1.209-.724-.647-1.213-1.445-1.354-1.689-.142-.244-.015-.376.107-.497.111-.11.244-.285.366-.427.122-.142.162-.244.244-.406.081-.162.04-.305-.02-.426-.061-.122-.55-1.326-.752-1.815-.197-.474-.397-.41-.55-.417l-.467-.006c-.162 0-.427.061-.65.305-.223.244-.854.834-.854 2.035 0 1.201.874 2.36 1.015 2.544.142.183 1.72 2.626 4.167 3.682.582.251 1.036.401 1.391.514.585.186 1.117.16 1.537.098.468-.069 1.444-.59 1.648-1.159.203-.569.203-1.057.142-1.159-.061-.101-.223-.162-.468-.284z"/>
            </svg>
            Solicitar Orçamento Grátis
          </button>
          <NuxtLink
            to="/servicos"
            class="flex items-center justify-center gap-2 border-2 border-white/60 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-colors min-h-[48px]"
          >
            ← Voltar aos Serviços
          </NuxtLink>
        </div>
      </div>

      <!-- Right: feature card -->
      <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 space-y-6">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center" :class="service.themeBg">
            <div class="w-8 h-8" :class="service.themeColor" v-html="service.iconSvg" />
          </div>
          <h2 class="text-xl font-bold text-white text-center">{{ service.title }}</h2>
        </div>

        <ul class="space-y-3">
          <li
            v-for="feature in service.heroFeatures"
            :key="feature"
            class="flex items-center gap-3 text-slate-200"
          >
            <svg class="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ feature }}
          </li>
        </ul>

        <div class="flex items-center justify-center gap-2 pt-2 border-t border-white/10 text-sm text-slate-300">
          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Garantia de 90 dias
        </div>
      </div>

    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NuxtLink } from '#components'
import type { ServiceData } from '../utils/servicesData'

export default defineComponent({
  name: 'ServiceHero',
  components: { NuxtLink },
  props: {
    service: { type: Object as () => ServiceData, required: true },
  },
  emits: ['whatsapp'],
})
</script>
