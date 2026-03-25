import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useAuth } from '~/composables/useAuth'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Chaves do localStorage para rastrear quando o cliente viu cada aba
const STORAGE_KEYS = {
  solicitacoes: 'na_visto_solicitacoes',
  agendamentos: 'na_visto_agendamentos',
  notas: 'na_visto_notas',
}

export function useClienteNotificacoes() {
  const supabase = useSupabase()
  const { user } = useAuth()

  const badgeSolicitacoes = ref(false)
  const badgeAgendamentos = ref(false)
  const badgeNotas = ref(false)

  let channel: RealtimeChannel | null = null

  function getVisto(key: keyof typeof STORAGE_KEYS): string {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem(STORAGE_KEYS[key]) ?? ''
  }

  function marcarVisto(key: keyof typeof STORAGE_KEYS) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS[key], new Date().toISOString())
    if (key === 'solicitacoes') badgeSolicitacoes.value = false
    if (key === 'agendamentos') badgeAgendamentos.value = false
    if (key === 'notas') badgeNotas.value = false
  }

  async function verificar() {
    if (!user.value?.id) return

    const vistoSol = getVisto('solicitacoes')
    const vistoAg = getVisto('agendamentos')

    // Solicitações aprovadas após a última vez que o cliente viu a aba
    const queryS = supabase
      .from('solicitacoes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.value.id)
      .eq('status', 'aprovada')

    if (vistoSol) queryS.gt('updated_at', vistoSol)

    const { count: countSol } = await queryS
    badgeSolicitacoes.value = (countSol ?? 0) > 0

    // Agendamentos com status agendado/em_andamento criados/atualizados após última visita
    const queryA = supabase
      .from('agendamentos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.value.id)
      .in('status', ['agendado', 'em_andamento'])

    if (vistoAg) queryA.gt('updated_at', vistoAg)

    const { count: countAg } = await queryA
    badgeAgendamentos.value = (countAg ?? 0) > 0
    // Notas fiscais: sem dados reais ainda, badge desativado
    badgeNotas.value = false
  }

  function inscreverRealtime() {
    if (!user.value?.id) return
    channel = supabase
      .channel(`notificacoes-cliente-${user.value.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'solicitacoes', filter: `user_id=eq.${user.value.id}` },
        (payload) => {
          if ((payload.new as { status: string }).status === 'aprovada') {
            badgeSolicitacoes.value = true
          }
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agendamentos', filter: `user_id=eq.${user.value.id}` },
        () => { verificar() }
      )
      .subscribe()
  }

  onMounted(async () => {
    await verificar()
    inscreverRealtime()
  })

  onUnmounted(() => {
    if (channel) supabase.removeChannel(channel)
  })

  return { badgeSolicitacoes, badgeAgendamentos, badgeNotas, marcarVisto }
}
