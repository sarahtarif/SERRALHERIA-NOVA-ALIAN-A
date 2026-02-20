<template>
  <footer class="bg-secondary-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <!-- Sobre -->
        <div>
          <NuxtLink to="/" class="flex items-center space-x-3 mb-4">
            <img 
              src="/logo.png" 
              alt="Nova Aliança Logo" 
              class="w-12 h-12 rounded-lg object-contain"
              style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
            />
            <div>
              <div class="font-bold text-lg">Nova Aliança</div>
              <div class="text-secondary-300 text-xs">Serralheria & Automação</div>
            </div>
          </NuxtLink>
          <p class="text-secondary-300 text-sm">
            +15 anos de experiência em automação de portões, serralheria e segurança eletrônica em São Paulo.
          </p>
        </div>

        <!-- Links Rápidos -->
        <div>
          <h4 class="font-bold mb-4 text-accent-400">Links Rápidos</h4>
          <ul class="space-y-2">
            <li v-for="item in quickLinks" :key="item.path">
              <NuxtLink 
                :to="item.path"
                class="text-secondary-300 hover:text-accent-400 transition-colors text-sm"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Serviços -->
        <div>
          <h4 class="font-bold mb-4 text-accent-400">Serviços</h4>
          <ul class="space-y-2">
            <li v-for="service in services" :key="service">
              <span class="text-secondary-300 text-sm">{{ service }}</span>
            </li>
          </ul>
        </div>

        <!-- Contato -->
        <div>
          <h4 class="font-bold mb-4 text-accent-400">Contato</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+5511987115613" class="text-secondary-300 hover:text-accent-400 transition-colors">
                +55 11 98711-5613
              </a>
            </li>
            <li class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-secondary-300">contato@novaalianca.com.br</span>
            </li>
            <li class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-secondary-300">São Paulo - SP</span>
            </li>
          </ul>
          
          <div class="mt-4">
            <p class="text-secondary-400 text-xs mb-2">Horário de Atendimento:</p>
            <p class="text-secondary-300 text-sm">Seg-Sex: 8h às 18h</p>
            <p class="text-secondary-300 text-sm">Sábado: 8h às 12h</p>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-secondary-700 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p class="text-secondary-400 text-sm text-center md:text-left">
            &copy; {{ new Date().getFullYear() }} Serralheria Nova Aliança. Todos os direitos reservados.
          </p>
          <div class="flex space-x-6">
            <NuxtLink to="/cliente/login" class="text-secondary-400 hover:text-accent-400 text-sm transition-colors">
              Área do Cliente
            </NuxtLink>
            <NuxtLink to="/admin/login" class="text-secondary-400 hover:text-accent-400 text-sm transition-colors">
              Admin
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Trabalhos Realizados', path: '/trabalhos' },
  { label: 'Sobre Nós', path: '/sobre' },
  { label: 'Contato', path: '/contato' }
]

const services = [
  'Automação de Portões',
  'Travas Eletrônicas',
  'Interfones',
  'Câmeras de Segurança',
  'Manutenção Preventiva'
]
</script>
