<template>
  <div id="page-home" class="bg-surface text-on-surface font-body antialiased">

    <!-- Mobile layout (< lg) -->
    <div class="lg:hidden">
      <NavTop />
      <main class="relative min-h-screen flex flex-col pt-20">
        <div class="absolute inset-0 z-0">
          <img
            class="w-full h-full object-cover object-top opacity-40 mix-blend-luminosity"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLd1R2avVx-pwk5TnuMcU_ZtGVY0_6_Zqk-n72r9rqkDF4eKk7vQmgJq9A58YloDo6dgj8mD-znF0ZSLUKd42Rn5CR8p4VQ6-kkfokuh2PRkYRvx-Q9vMzx4xgyk0jytvd6uBl0nz-frSVaHe1JUkpfOGNfGrJeXLfXm_PX6Vs0wZW0qyzMIDM_7QOIxM845XAJj_K7HQ7NuCYFRmk_w3lLxU-uu-GSQI2ZVu_BpEaE9qSSb3dYeP2VGkYe12Ba216SWwWSZ-vAwc"
            alt="Motor de portão automatizado com textura industrial"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface to-surface"></div>
        </div>
        <HeroSection />
      </main>
      <WhySection />
      <ServicesGrid />
      <Gallery />
      <WhatsAppFab />
      <PageFooter />
      <NavBottom />
    </div>

    <!-- Desktop layout (>= lg) -->
    <div class="hidden lg:block">
      <NavDesktop />
      <HeroDesktop />
      <WhySection />
      <ServicesGrid />
      <Gallery />
      <WhatsAppFab />
      <FooterDesktop />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavTop from '../components/NavTop.vue'
import NavBottom from '../components/NavBottom.vue'
import HeroSection from '../components/HeroSection.vue'
import WhatsAppFab from '../components/WhatsAppFab.vue'
import PageFooter from '../components/PageFooter.vue'
import NavDesktop from '../components/NavDesktop.vue'
import HeroDesktop from '../components/HeroDesktop.vue'
import FooterDesktop from '../components/FooterDesktop.vue'
import WhySection from '../components/WhySection.vue'
import ServicesGrid from '../components/ServicesGrid.vue'
import Gallery from '../components/Gallery.vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    NavTop,
    NavBottom,
    HeroSection,
    WhatsAppFab,
    PageFooter,
    NavDesktop,
    HeroDesktop,
    FooterDesktop,
    WhySection,
    ServicesGrid,
    Gallery,
  },
})
</script>
