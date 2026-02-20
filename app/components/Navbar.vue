<template>
  <nav class="bg-primary-900/95 backdrop-blur-md shadow-lg border-b border-white/10 sticky top-0 z-50 transition-all">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="Nova Aliança Logo" 
            class="w-28 h-20 rounded-lg object-contain"
            style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
          />
          <div class="hidden md:block">
            <div class="text-white font-bold text-xl">Nova Aliança</div>
            <div class="text-primary-100 text-xs">Serralheria & Automação</div>
          </div>
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center space-x-8">
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="text-white hover:text-accent-300 transition-colors font-medium"
          >
            {{ item.label }}
          </NuxtLink>
          
          <Button 
            v-if="user"
            as="NuxtLink"
            :to="user.role === 'admin' ? '/admin' : '/cliente'"
            variant="ghost"
            class="text-white hover:text-accent-300"
          >
            {{ user.role === 'admin' ? 'Admin' : 'Minha Conta' }}
          </Button>
          
          <Button 
            @click="handleCTA"
            class="bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/50 border-2 border-accent-300"
          >
            Solicitar Orçamento
          </Button>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden text-white p-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="lg:hidden pb-4">
        <div class="flex flex-col min-h-[50vh]">
          <div class="flex flex-col">
            <NuxtLink 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="text-white hover:text-accent-300 transition-colors font-medium py-3.5 hover:bg-white/5 rounded-lg px-2"
            >
              {{ item.label }}
            </NuxtLink>
            
            <Button 
              v-if="user"
              as="NuxtLink"
              :to="user.role === 'admin' ? '/admin' : '/cliente'"
              @click="mobileMenuOpen = false"
              variant="ghost"
              class="text-white hover:text-accent-300 justify-start py-3.5 mt-2"
            >
              {{ user.role === 'admin' ? 'Admin' : 'Minha Conta' }}
            </Button>
          </div>
          
          <div class="mt-auto pt-4">
            <Button 
              @click="handleCTA"
              class="bg-accent-500 hover:bg-accent-600 text-white justify-center w-full h-12 border-2 border-accent-300 shadow-lg shadow-accent-500/50"
            >
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { sendMessage, createServiceMessage } = useWhatsApp()
const mobileMenuOpen = ref(false)

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Trabalhos', path: '/trabalhos' },
  { label: 'Sobre', path: '/sobre' },
  { label: 'Contato', path: '/contato' }
]

const handleCTA = () => {
  const message = createServiceMessage({
    service: 'Gostaria de mais informações'
  })
  sendMessage(message)
  mobileMenuOpen.value = false
}
</script>
