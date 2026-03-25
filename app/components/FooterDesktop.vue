<template>
  <footer id="footer-desktop" class="bg-surface-container-lowest w-full border-t border-white/5">
    <div class="flex flex-col md:flex-row justify-between items-center py-8 px-6 max-w-7xl mx-auto font-body text-sm">
      <div class="text-lg font-bold text-on-surface font-headline mb-4 md:mb-0">Nova Aliança</div>
      <div class="text-on-surface-variant order-last md:order-none">
        © 2024 Nova Aliança. Segurança e Automação de Alto Padrão.
      </div>
      <div class="flex gap-6 mb-4 md:mb-0">
        <a href="#" class="text-on-surface-variant hover:text-on-surface transition-colors">Privacidade</a>
        <a href="#" class="text-on-surface-variant hover:text-on-surface transition-colors">Termos</a>
        <a href="#" class="text-on-surface-variant hover:text-on-surface transition-colors">Contato</a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterDesktop',
})
</script>
