<template>
  <div id="whatsapp-fab" class="fixed bottom-24 right-6 z-50">
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 active:scale-90 transition-transform"
      aria-label="Falar pelo WhatsApp"
    >
      <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.48 5.228 3.48 8.404c0 6.557-5.331 11.888-11.887 11.888-2.01 0-3.986-.511-5.741-1.483l-6.243 1.808zm6.086-5.309l.395.234c1.46.868 3.144 1.326 4.873 1.326 5.105 0 9.259-4.155 9.259-9.259 0-2.473-.962-4.798-2.71-6.546s-4.074-2.71-6.547-2.71c-5.105 0-9.26 4.155-9.26 9.259 0 1.634.428 3.234 1.239 4.647l.257.447-1.011 3.696 3.792-1.094zm9.215-6.096c-.244-.122-1.444-.712-1.668-.794-.223-.081-.387-.122-.55.122-.162.244-.63.794-.772.956-.142.163-.284.183-.528.061-.244-.122-1.029-.38-1.959-1.209-.724-.647-1.213-1.445-1.354-1.689-.142-.244-.015-.376.107-.497.111-.11.244-.285.366-.427.122-.142.162-.244.244-.406.081-.162.04-.305-.02-.426-.061-.122-.55-1.326-.752-1.815-.197-.474-.397-.41-.55-.417l-.467-.006c-.162 0-.427.061-.65.305-.223.244-.854.834-.854 2.035 0 1.201.874 2.36 1.015 2.544.142.183 1.72 2.626 4.167 3.682.582.251 1.036.401 1.391.514.585.186 1.117.16 1.537.098.468-.069 1.444-.59 1.648-1.159.203-.569.203-1.057.142-1.159-.061-.101-.223-.162-.468-.284z"/>
      </svg>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRuntimeConfig } from '#app'

export default defineComponent({
  name: 'WhatsAppFab',
  setup() {
    const config = useRuntimeConfig()
    const whatsappUrl = computed(() =>
      `https://wa.me/${config.public.whatsappNumber}`
    )
    return { whatsappUrl }
  },
})
</script>
