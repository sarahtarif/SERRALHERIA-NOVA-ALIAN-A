<script setup lang="ts">
import NavTop from '~/components/NavTop.vue'
import NavDesktop from '~/components/NavDesktop.vue'
import NavBottom from '~/components/NavBottom.vue'
import PageFooter from '~/components/PageFooter.vue'
import FooterDesktop from '~/components/FooterDesktop.vue'
import WhatsAppFab from '~/components/WhatsAppFab.vue'
import ServicesGrid from '~/components/ServicesGrid.vue'
import { useNavigation } from '~/composables/useNavigation'

const { goOrcamento } = useNavigation()
</script>

<template>
  <div id="servicos-page" class="bg-surface text-on-surface font-body antialiased min-h-screen">

    <!-- Nav -->
    <div class="lg:hidden"><NavTop /></div>
    <div class="hidden lg:block"><NavDesktop /></div>

    <main class="pt-16">

      <!-- Hero da página -->
      <section class="relative py-16 px-4 overflow-hidden bg-surface-container-low">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary-container/10 pointer-events-none" />
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Nossos Serviços
          </span>
          <h1 class="text-4xl md:text-5xl font-bold font-headline text-on-surface mb-4 leading-tight">
            Soluções em<br />
            <span class="text-primary">Automação e Segurança</span>
          </h1>
          <p class="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-8">
            Mais de 15 anos instalando e mantendo sistemas de automação, câmeras, interfones e travas eletrônicas em toda São Paulo.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              @click="goOrcamento"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.557-5.331 11.888-11.887 11.888-2.01 0-3.986-.511-5.741-1.483l-6.243 1.808zm6.086-5.309l.395.234c1.46.868 3.144 1.326 4.873 1.326 5.105 0 9.259-4.155 9.259-9.259 0-2.473-.962-4.798-2.71-6.546s-4.074-2.71-6.547-2.71c-5.105 0-9.26 4.155-9.26 9.259 0 1.634.428 3.234 1.239 4.647l.257.447-1.011 3.696 3.792-1.094zm9.215-6.096c-.244-.122-1.444-.712-1.668-.794-.223-.081-.387-.122-.55.122-.162.244-.63.794-.772.956-.142.163-.284.183-.528.061-.244-.122-1.029-.38-1.959-1.209-.724-.647-1.213-1.445-1.354-1.689-.142-.244-.015-.376.107-.497.111-.11.244-.285.366-.427.122-.142.162-.244.244-.406.081-.162.04-.305-.02-.426-.061-.122-.55-1.326-.752-1.815-.197-.474-.397-.41-.55-.417l-.467-.006c-.162 0-.427.061-.65.305-.223.244-.854.834-.854 2.035 0 1.201.874 2.36 1.015 2.544.142.183 1.72 2.626 4.167 3.682.582.251 1.036.401 1.391.514.585.186 1.117.16 1.537.098.468-.069 1.444-.59 1.648-1.159.203-.569.203-1.057.142-1.159-.061-.101-.223-.162-.468-.284z"/>
              </svg>
              Solicitar Orçamento
            </button>
            <a
              href="tel:+5511987115613"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              (11) 98711-5613
            </a>
          </div>
        </div>
      </section>

      <!-- Grid de serviços (componente existente) -->
      <ServicesGrid />

      <!-- CTA final -->
      <section class="py-16 px-4 bg-surface-container-low text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold font-headline text-on-surface mb-3">
            Não encontrou o que precisa?
          </h2>
          <p class="text-on-surface-variant mb-6">
            Fale com nossos especialistas e encontramos a solução ideal para você.
          </p>
          <button
            class="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold transition-colors shadow-lg"
            @click="goOrcamento"
          >
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.557-5.331 11.888-11.887 11.888-2.01 0-3.986-.511-5.741-1.483l-6.243 1.808zm6.086-5.309l.395.234c1.46.868 3.144 1.326 4.873 1.326 5.105 0 9.259-4.155 9.259-9.259 0-2.473-.962-4.798-2.71-6.546s-4.074-2.71-6.547-2.71c-5.105 0-9.26 4.155-9.26 9.259 0 1.634.428 3.234 1.239 4.647l.257.447-1.011 3.696 3.792-1.094zm9.215-6.096c-.244-.122-1.444-.712-1.668-.794-.223-.081-.387-.122-.55.122-.162.244-.63.794-.772.956-.142.163-.284.183-.528.061-.244-.122-1.029-.38-1.959-1.209-.724-.647-1.213-1.445-1.354-1.689-.142-.244-.015-.376.107-.497.111-.11.244-.285.366-.427.122-.142.162-.244.244-.406.081-.162.04-.305-.02-.426-.061-.122-.55-1.326-.752-1.815-.197-.474-.397-.41-.55-.417l-.467-.006c-.162 0-.427.061-.65.305-.223.244-.854.834-.854 2.035 0 1.201.874 2.36 1.015 2.544.142.183 1.72 2.626 4.167 3.682.582.251 1.036.401 1.391.514.585.186 1.117.16 1.537.098.468-.069 1.444-.59 1.648-1.159.203-.569.203-1.057.142-1.159-.061-.101-.223-.162-.468-.284z"/>
            </svg>
            Falar no WhatsApp
          </button>
        </div>
      </section>

    </main>

    <div class="lg:hidden"><PageFooter /></div>
    <div class="hidden lg:block"><FooterDesktop /></div>
    <div class="lg:hidden"><NavBottom /></div>
    <WhatsAppFab />

  </div>
</template>
