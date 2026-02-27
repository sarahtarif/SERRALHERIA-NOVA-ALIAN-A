/**
 * Composable de autenticação e autorização
 * Gerencia estado de usuário, perfil e sessão com Supabase Auth
 * 
 * @see docs/AUTENTICACAO-AUTORIZACAO.md
 * @see https://supabase.com/docs/guides/auth
 */
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '~/types'

export const useAuth = () => {
  const supabase = useSupabase()
  const user = useState<User | null>('user', () => null)
  const profile = useState<Profile | null>('profile', () => null)
  const session = useState<Session | null>('session', () => null)

  // Inicializar sessão
  const initAuth = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('[AUTH] Erro ao obter sessão:', error)
        return
      }
      
      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        await loadProfile(currentSession.user.id)
      }

      // Listener para mudanças de autenticação
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null
        
        if (newSession?.user) {
          await loadProfile(newSession.user.id)
        } else {
          profile.value = null
        }
      })
    } catch (error) {
      console.error('[AUTH] Erro ao inicializar autenticação:', error)
      throw error
    }
  }

  // Carregar perfil do usuário
  const loadProfile = async (userId: string) => {
    if (!userId) {
      console.warn('[AUTH] userId inválido para loadProfile')
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[AUTH] Erro ao carregar perfil:', error)
        throw error
      }

      if (data) {
        profile.value = data as Profile
      }
    } catch (error) {
      console.error('[AUTH] Exceção ao carregar perfil:', error)
      throw error
    }
  }

  // Cadastro
  const signUp = async (email: string, password: string, userData: {
    name: string
    whatsapp: string
    role?: 'client' | 'admin'
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          whatsapp: userData.whatsapp,
          role: userData.role || 'client'
        }
      }
    })

    if (!error && data.user) {
      // Criar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: userData.name,
          whatsapp: userData.whatsapp,
          email: email,
          role: userData.role || 'client'
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
      }

      // Se for cliente, criar registro na tabela clients
      if (userData.role === 'client' || !userData.role) {
        await supabase
          .from('clients')
          .insert({
            profile_id: data.user.id,
            city: 'São Paulo'
          })
      }
    }

    return { data, error }
  }

  // Login
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (!error && data.user) {
      await loadProfile(data.user.id)
    }

    return { data, error }
  }

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (!error) {
      user.value = null
      profile.value = null
      session.value = null
    }

    return { error }
  }

  // Recuperar senha
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cliente/reset-password`
    })

    return { data, error }
  }

  // Atualizar senha
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    return { data, error }
  }

  // Atualizar perfil
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user.value) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
      .select()
      .single()

    if (!error && data) {
      profile.value = data as Profile
    }

    return { data, error }
  }

  // Verificar se é admin
  const isAdmin = computed(() => profile.value?.role === 'admin')

  // Verificar se está autenticado
  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    profile,
    session,
    isAdmin,
    isAuthenticated,
    initAuth,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    loadProfile
  }
}
