import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAdminAuth } from '~/composables/useAdminAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAdmin, adminUser, adminRole, initAdmin } = useAdminAuth()

  if (!to.path.startsWith('/gestao-na') || to.path === '/gestao-na/login') return

  // Se o role ainda não foi carregado, inicializa (busca sessão + role do banco)
  if (!adminRole.value) {
    await initAdmin()
  }

  if (!adminUser.value || !isAdmin.value) {
    return navigateTo('/gestao-na/login')
  }
})
