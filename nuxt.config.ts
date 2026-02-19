// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      pathPrefix: false,
    },
    {
      path: '~/app/components',
      pathPrefix: false,
    }
  ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999',
      companyName: process.env.NUXT_PUBLIC_COMPANY_NAME || 'Serralheria Nova Aliança',
      companyAddress: process.env.NUXT_PUBLIC_COMPANY_ADDRESS || 'São Paulo - SP',
      companyEmail: process.env.NUXT_PUBLIC_COMPANY_EMAIL || 'contato@novaalianca.com.br',
      companyPhone: process.env.NUXT_PUBLIC_COMPANY_PHONE || '(11) 99999-9999'
    }
  }
})