<template>
  <footer id="footer-desktop" class="bg-surface-container-lowest w-full border-t border-white/5">
    <div class="flex flex-col md:flex-row justify-between items-center py-8 px-6 max-w-7xl mx-auto font-body text-sm">
      <div class="mb-4 md:mb-0">
        <img src="/images/logo.png" alt="Nova Aliança" class="h-10 w-auto" />
      </div>
      <div class="text-on-surface-variant order-last md:order-none">
        © 2024 {{ cfg.get('empresa_nome', 'Nova Aliança') }}. {{ cfg.get('empresa_slogan', 'Segurança e Automação de Alto Padrão') }}.
      </div>
      <div class="flex gap-6 mb-4 md:mb-0">
        <NuxtLink to="/privacidade" class="text-on-surface-variant hover:text-on-surface transition-colors">Privacidade</NuxtLink>
        <NuxtLink to="/termos" class="text-on-surface-variant hover:text-on-surface transition-colors">Termos</NuxtLink>
        <a href="#" class="text-on-surface-variant hover:text-on-surface transition-colors">Contato</a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { NuxtLink } from '#components'
import { useSiteConfig } from '../composables/useSiteConfig'

export default defineComponent({
  name: 'FooterDesktop',
  components: { NuxtLink },
  setup() {
    const cfg = useSiteConfig()
    onMounted(() => cfg.carregar())
    return { cfg }
  },
})
</script>
