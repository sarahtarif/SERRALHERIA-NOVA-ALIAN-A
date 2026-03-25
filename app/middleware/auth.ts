import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuth } from '~/composables/useAuth'
import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware(async (to) => {
  const { user } = useAuth()
  const supabase = useSupabase()

  const isAdminRoute = to.path.startsWith('/gestao-na')
  const isAdminLogin = to.path === '/gestao-na/login'
  const isClientLogin = to.path === '/login'

  // --- rotas /gestao-na ---
  if (isAdminLogin && user.value) {
    return navigateTo('/gestao-na')
  }
  if (isAdminRoute && !isAdminLogin && !user.value) {
    return navigateTo('/gestao-na/login')
  }

  // --- rotas de cliente ---
  if (isClientLogin && user.value) {
    // Só redireciona para /cliente se for realmente um cliente
    const { data } = await supabase.from('users').select('id').eq('id', user.value.id).maybeSingle()
    if (data) return navigateTo('/cliente')
    return // admin logado na página de login de cliente — deixa ver a página
  }

  const publicRoutes = ['/login', '/gestao-na/login']
  const isPublic = publicRoutes.includes(to.path) || isAdminRoute || to.path === '/' || to.path.startsWith('/servicos') || to.path === '/sobre'

  if (!isPublic && !user.value) {
    return navigateTo('/login')
  }

  // Rota protegida de cliente com sessão ativa — garante que é cliente
  if (!isPublic && user.value && to.path.startsWith('/cliente')) {
    const { data } = await supabase.from('users').select('id').eq('id', user.value.id).maybeSingle()
    if (!data) return navigateTo('/login')
  }
})
