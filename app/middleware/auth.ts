/**
 * Middleware de autenticação básica
 * Verifica se o usuário está autenticado e redireciona para login apropriado
 * 
 * @see docs/AUTENTICACAO-AUTORIZACAO.md
 * @see https://nuxt.com/docs/guide/directory-structure/middleware
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { user, initAuth } = useAuth()
  
  // Inicializar autenticação se necessário
  if (!user.value) {
    try {
      await initAuth()
    } catch (error) {
      console.error('[AUTH] Erro ao inicializar autenticação:', error)
    }
  }
  
  // Se não estiver autenticado, redirecionar para login apropriado
  if (!user.value) {
    // Determinar página de login baseado na rota
    if (to.path.startsWith('/sys/mgmt') || to.path.startsWith('/auth/secure')) {
      return navigateTo('/auth/secure/admin-access')
    }
    
    if (to.path.startsWith('/cliente')) {
      return navigateTo('/cliente/login')
    }
  }
})
