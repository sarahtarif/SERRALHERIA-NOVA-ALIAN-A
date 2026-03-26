import { ref, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

export interface SiteConfigRow {
  chave: string
  valor: string
  tipo: string
  grupo: string
  label: string
  descricao?: string
}

// Singleton reativo — compartilhado entre todos os componentes
const _configs = ref<Record<string, string>>({})
const _loaded = ref(false)
const _loading = ref(false)

// Invalida o cache a cada navegação de página (evita valores stale entre sessões)
if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', () => { _loaded.value = false })
}

export function useSiteConfig() {
  const supabase = useSupabase()

  async function carregar() {
    if (_loaded.value || _loading.value) return
    _loading.value = true
    try {
      const { data } = await supabase.from('site_config').select('chave, valor')
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((row: { chave: string; valor: string }) => { map[row.chave] = row.valor })
        _configs.value = map
        _loaded.value = true
        aplicarCSSVars(map)
      }
    } finally {
      _loading.value = false
    }
  }

  function get(chave: string, fallback = ''): string {
    return _configs.value[chave] ?? fallback
  }

  function getJson<T>(chave: string, fallback: T): T {
    try { return JSON.parse(_configs.value[chave] ?? '') as T }
    catch { return fallback }
  }

  async function salvar(chave: string, valor: string): Promise<void> {
    // Usa rota server-side com service role para garantir que a RLS não bloqueie
    const session = await supabase.auth.getSession()
    const token = session.data.session?.access_token
    if (!token) throw new Error('Sessão expirada. Faça login novamente.')

    const res = await $fetch('/api/admin/site-config', {
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + token },
      body: { chave, valor },
    })

    if ((res as { ok?: boolean }).ok) {
      // Atualiza o cache local e força recarregamento no próximo acesso
      _configs.value[chave] = valor
      _loaded.value = false // força recarregar na próxima vez que o site abrir
      aplicarCSSVars(_configs.value)
    }
  }

  async function carregarTodos(): Promise<SiteConfigRow[]> {
    // Sempre busca do banco — usado pelo editor para garantir dados frescos
    const { data } = await supabase
      .from('site_config')
      .select('chave, valor, tipo, grupo, label, descricao')
      .order('grupo')
    if (data) {
      // Atualiza o cache local também
      data.forEach((row: { chave: string; valor: string }) => {
        _configs.value[row.chave] = row.valor
      })
      _loaded.value = true
      aplicarCSSVars(_configs.value)
    }
    return (data ?? []) as SiteConfigRow[]
  }

  function aplicarCSSVars(map: Record<string, string>) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (map['cor_primaria'])   root.style.setProperty('--color-primary', hexToRgb(map['cor_primaria']))
    if (map['cor_secundaria']) root.style.setProperty('--color-secondary', hexToRgb(map['cor_secundaria']))
    if (map['cor_surface'])    root.style.setProperty('--color-surface', hexToRgb(map['cor_surface']))
    if (map['cor_on_surface']) root.style.setProperty('--color-on-surface', hexToRgb(map['cor_on_surface']))
    if (map['cor_whatsapp'])   root.style.setProperty('--color-whatsapp', hexToRgb(map['cor_whatsapp']))
  }

  function hexToRgb(hex: string): string {
    const clean = hex.replace('#', '')
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return hex
    return r + ' ' + g + ' ' + b
  }

  const configs = computed(() => _configs.value)

  return { carregar, get, getJson, salvar, carregarTodos, configs, loaded: _loaded }
}
