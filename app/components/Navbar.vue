<template>
  <nav class="bg-gradient-primary shadow-metal-lg sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3">
          <img 
            src="/logo.jpg" 
            alt="Nova Aliança Logo" 
            class="w-12 h-12 rounded-lg object-cover"
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
            class="bg-accent-500 hover:bg-accent-600 text-white shadow-accent"
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
        <div class="flex flex-col space-y-3">
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            @click="mobileMenuOpen = false"
            class="text-white hover:text-accent-300 transition-colors font-medium py-2"
          >
            {{ item.label }}
          </NuxtLink>
          
          <Button 
            v-if="user"
            as="NuxtLink"
            :to="user.role === 'admin' ? '/admin' : '/cliente'"
            @click="mobileMenuOpen = false"
            variant="ghost"
            class="text-white hover:text-accent-300 justify-start"
          >
            {{ user.role === 'admin' ? 'Admin' : 'Minha Conta' }}
          </Button>
          
          <Button 
            @click="handleCTA"
            class="bg-accent-500 hover:bg-accent-600 text-white justify-start"
          >
            Solicitar Orçamento
          </Button>
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
