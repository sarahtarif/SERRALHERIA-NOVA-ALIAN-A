// Middleware de verificação de role admin
// Aplica defesa em profundidade com múltiplas verificações

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, profile, isAdmin, loadProfile } = useAuth()
  
  // CAMADA 1: Verificar autenticação
  if (!user.value) {
    console.warn('[SECURITY] Tentativa de acesso não autenticado:', {
      route: to.path,
      timestamp: new Date().toISOString()
    })
    
    return navigateTo('/auth/secure/admin-access')
  }
  
  // CAMADA 2: Carregar perfil se não estiver carregado
  if (!profile.value) {
    try {
      await loadProfile(user.value.id)
    } catch (error) {
      console.error('[AUTH] Erro ao carregar perfil:', error)
      return navigateTo('/auth/secure/admin-access')
    }
  }
  
  // CAMADA 3: Verificar role admin
  if (!isAdmin.value) {
    console.error('[SECURITY] Tentativa de escalação de privilégio:', {
      userId: user.value.id,
      userEmail: user.value.email,
      currentRole: profile.value?.role || 'unknown',
      attemptedRoute: to.path,
      timestamp: new Date().toISOString()
    })
    
    // Log de auditoria (server-side) - não bloquear se falhar
    try {
      await $fetch('/api/security/log-unauthorized', {
        method: 'POST',
        body: {
          userId: user.value.id,
          userEmail: user.value.email,
          role: profile.value?.role,
          attemptedRoute: to.path,
          fromRoute: from.path,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      // Silenciar erro - não bloquear navegação
      console.error('[SECURITY] Erro ao registrar tentativa não autorizada:', error)
    }
    
    // Redirecionar para área apropriada
    if (profile.value?.role === 'client') {
      return navigateTo('/cliente')
    }
    
    return navigateTo('/')
  }
  
  // CAMADA 4: Audit log de acesso autorizado - não bloquear se falhar
  try {
    await $fetch('/api/security/log-access', {
      method: 'POST',
      body: {
        userId: user.value.id,
        userEmail: user.value.email,
        route: to.path,
        fromRoute: from.path,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    // Silenciar erro - não bloquear navegação
    console.error('[SECURITY] Erro ao registrar acesso:', error)
  }
  
  // CAMADA 5: Verificação de sessão ativa
  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    console.warn('[SECURITY] Sessão expirada detectada:', {
      userId: user.value.id,
      route: to.path
    })
    
    return navigateTo('/auth/secure/admin-access')
  }
})
