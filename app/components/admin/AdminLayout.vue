<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/admin" class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-lg">NA</span>
                </div>
                <div class="hidden md:block">
                  <div class="text-gray-900 font-bold text-lg">Nova Aliança</div>
                  <div class="text-gray-500 text-xs">Painel Administrativo</div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-500 relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button @click="userMenuOpen = !userMenuOpen" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-semibold text-sm">{{ userInitials }}</span>
                </div>
                <div class="hidden md:block text-left">
                  <div class="text-sm font-medium text-gray-900">{{ userName }}</div>
                  <div class="text-xs text-gray-500">{{ userRole }}</div>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown -->
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                <NuxtLink to="/admin/perfil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Meu Perfil
                </NuxtLink>
                <NuxtLink to="/admin/configuracoes" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configurações
                </NuxtLink>
                <hr class="my-1">
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex pt-16">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <nav class="p-4 space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            :class="{ 'bg-primary-50 text-primary-600': isActive(item.path) }"
          >
            <div v-html="item.icon" class="w-5 h-5"></div>
            <span class="font-medium">{{ item.label }}</span>
            <Badge v-if="item.badge" variant="danger" class="ml-auto">{{ item.badge }}</Badge>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, profile, signOut } = useAuth()
const router = useRouter()
const route = useRoute()
const userMenuOpen = ref(false)

const userName = computed(() => profile.value?.name || 'Admin')
const userRole = computed(() => profile.value?.role === 'admin' ? 'Administrador' : 'Usuário')
const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const menuItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
  },
  {
    label: 'Leads',
    path: '/admin/leads',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
    badge: 5
  },
  {
    label: 'Orçamentos',
    path: '/admin/orcamentos',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>'
  },
  {
    label: 'Serviços',
    path: '/admin/servicos',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>'
  },
  {
    label: 'Agenda',
    path: '/admin/agenda',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
  },
  {
    label: 'Clientes',
    path: '/admin/clientes',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>'
  },
  {
    label: 'Financeiro',
    path: '/admin/financeiro',
    icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  }
]

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await signOut()
  router.push('/')
}

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      userMenuOpen.value = false
    }
  })
})
</script>
