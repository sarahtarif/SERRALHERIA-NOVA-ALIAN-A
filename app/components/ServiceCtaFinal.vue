<template>
  <section id="service-cta-final" class="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white py-20 px-4">
    <div class="max-w-3xl mx-auto text-center space-y-8">
      <h2 class="text-3xl md:text-4xl font-bold">Pronto para proteger seu portão?</h2>
      <p class="text-slate-300 text-lg">Atendemos toda a Grande São Paulo com visita técnica gratuita e orçamento sem compromisso.</p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="$emit('whatsapp')"
          class="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-colors min-h-[48px]"
        >
          <svg class="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.557-5.331 11.888-11.887 11.888-2.01 0-3.986-.511-5.741-1.483l-6.243 1.808zm6.086-5.309l.395.234c1.46.868 3.144 1.326 4.873 1.326 5.105 0 9.259-4.155 9.259-9.259 0-2.473-.962-4.798-2.71-6.546s-4.074-2.71-6.547-2.71c-5.105 0-9.26 4.155-9.26 9.259 0 1.634.428 3.234 1.239 4.647l.257.447-1.011 3.696 3.792-1.094zm9.215-6.096c-.244-.122-1.444-.712-1.668-.794-.223-.081-.387-.122-.55.122-.162.244-.63.794-.772.956-.142.163-.284.183-.528.061-.244-.122-1.029-.38-1.959-1.209-.724-.647-1.213-1.445-1.354-1.689-.142-.244-.015-.376.107-.497.111-.11.244-.285.366-.427.122-.142.162-.244.244-.406.081-.162.04-.305-.02-.426-.061-.122-.55-1.326-.752-1.815-.197-.474-.397-.41-.55-.417l-.467-.006c-.162 0-.427.061-.65.305-.223.244-.854.834-.854 2.035 0 1.201.874 2.36 1.015 2.544.142.183 1.72 2.626 4.167 3.682.582.251 1.036.401 1.391.514.585.186 1.117.16 1.537.098.468-.069 1.444-.59 1.648-1.159.203-.569.203-1.057.142-1.159-.061-.101-.223-.162-.468-.284z"/>
          </svg>
          Solicitar Orçamento Grátis
        </button>
        <NuxtLink
          to="/servicos"
          class="flex items-center justify-center gap-2 border-2 border-white/60 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-colors min-h-[48px]"
        >
          Ver todos os serviços
        </NuxtLink>
      </div>

      <div class="flex flex-wrap justify-center gap-6 text-sm text-slate-400 pt-2">
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Visita gratuita
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Resposta em 2h
        </span>
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          +15 anos de experiência
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NuxtLink } from '#components'

export default defineComponent({
  name: 'ServiceCtaFinal',
  components: { NuxtLink },
  emits: ['whatsapp'],
})
</script>
