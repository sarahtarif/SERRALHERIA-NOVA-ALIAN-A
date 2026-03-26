<template>
  <footer id="page-footer" class="bg-surface-container-low py-12 px-6 pb-24 text-center">
    <img src="/images/logo.png" alt="Serralheria Nova Aliança" class="h-10 w-auto mx-auto" />
    <p class="text-on-surface-variant text-xs mt-2 leading-relaxed font-body">
      {{ cfg.get('empresa_copyright', '© 2024 Automação & Segurança Eletrônica.') }} <br /> Todos os direitos reservados.
    </p>
    <div class="flex justify-center gap-4 mt-6 text-on-surface-variant text-xs">
      <span>Privacidade</span>
      <span>Termos</span>
      <span>Suporte</span>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useSiteConfig } from '../composables/useSiteConfig'

export default defineComponent({
  name: 'PageFooter',
  setup() {
    const cfg = useSiteConfig()
    onMounted(() => cfg.carregar())
    return { cfg }
  },
})
</script>
