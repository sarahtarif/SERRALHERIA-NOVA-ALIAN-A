<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

interface MediaStats {
  limitBytes: number
  limitMB: number
  solicitacoes: { bytes: number; mb: number }
  portfolio: { bytes: number; mb: number }
  certs: { bytes: number; mb: number }
  totalMidiaBytes: number
  totalMidiaMB: number
  percentMidia: number
  bancoTotalBytes: number
  bancoTotalMB: number
  percentBanco: number | null
}

interface TableStat {
  tablename: string
  total_bytes: number
  table_bytes: number
  index_bytes: number
  row_count: number
}

const TABLE_LABELS: Record<string, string> = {
  solicitacoes: 'Solicitações',
  portfolio: 'Portfólio',
  convites: 'Convites',
  users: 'Clientes (users)',
  admins: 'Administradores',
  agendamentos: 'Agendamentos',
  notification_config: 'Config. Notificações',
  clientes_avulsos: 'Clientes Avulsos',
  servicos_catalogo: 'Catálogo de Serviços',
  site_config: 'Config. do Site',
}

const supabase = useSupabase()
const loading = ref(true)
const stats = ref<MediaStats | null>(null)
const error = ref(false)
const tables = ref<TableStat[]>([])
const dbTotalBytes = ref(0)
const showTables = ref(false)

async function carregar() {
  loading.value = true
  error.value = false
  try {
    // Mídias via RPC existente
    const { data, error: rpcError } = await supabase.rpc('get_media_usage_stats')
    if (rpcError || !data) throw new Error('rpc failed')

    const row = Array.isArray(data) ? data[0] : data
    const LIMIT = 500 * 1024 * 1024

    const bSol = Number(row.bytes_solicitacoes ?? 0)
    const bPort = Number(row.bytes_portfolio ?? 0)
    const bCert = Number(row.bytes_certs ?? 0)
    const bBanco = Number(row.bytes_banco_total ?? 0)
    const totalMidia = bSol + bPort + bCert

    stats.value = {
      limitBytes: LIMIT,
      limitMB: LIMIT / (1024 * 1024),
      solicitacoes: { bytes: bSol, mb: bSol / (1024 * 1024) },
      portfolio: { bytes: bPort, mb: bPort / (1024 * 1024) },
      certs: { bytes: bCert, mb: bCert / (1024 * 1024) },
      totalMidiaBytes: totalMidia,
      totalMidiaMB: totalMidia / (1024 * 1024),
      percentMidia: Math.min((totalMidia / LIMIT) * 100, 100),
      bancoTotalBytes: bBanco,
      bancoTotalMB: bBanco / (1024 * 1024),
      percentBanco: Math.min((bBanco / LIMIT) * 100, 100),
    }

    // Tamanho por tabela
    const { data: tablesData } = await supabase.rpc('get_tables_size')
    if (tablesData) {
      tables.value = tablesData as TableStat[]
      dbTotalBytes.value = bBanco
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function fmt(mb: number): string {
  if (mb < 1) return (mb * 1024).toFixed(1) + ' KB'
  if (mb < 1024) return mb.toFixed(2) + ' MB'
  return (mb / 1024).toFixed(2) + ' GB'
}

function fmtBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return fmt(mb)
}

function tablePercent(bytes: number): number {
  if (!dbTotalBytes.value) return 0
  return Math.min((bytes / dbTotalBytes.value) * 100, 100)
}

function tableLabel(name: string): string {
  return TABLE_LABELS[name] ?? name
}

const corBarra = computed(() => {
  const p = stats.value?.percentBanco ?? 0
  if (p >= 80) return '#ef4444'
  if (p >= 60) return '#f59e0b'
  return '#6366f1'
})

const corBarraMidia = computed(() => {
  const p = stats.value?.percentMidia ?? 0
  if (p >= 80) return '#ef4444'
  if (p >= 60) return '#f59e0b'
  return '#818cf8'
})

const TABLE_COLORS = ['#6366f1', '#34d399', '#f59e0b', '#f87171', '#818cf8', '#38bdf8', '#a78bfa', '#fb923c', '#4ade80', '#e879f9']

onMounted(carregar)
</script>

<template>
  <div
    id="storage-widget"
    class="rounded-2xl p-5 space-y-4"
    style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);"
        >
          <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-white">Armazenamento do Banco</p>
          <p class="text-xs mt-0.5" style="color:#64748b;">Plano Free · Limite 500 MB</p>
        </div>
      </div>
      <button
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
        style="color:#475569;"
        :class="loading ? 'animate-spin' : ''"
        title="Atualizar"
        @click="carregar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3 animate-pulse">
      <div class="h-3 rounded-full" style="background:rgba(255,255,255,0.06);"/>
      <div class="h-8 rounded-xl" style="background:rgba(255,255,255,0.04);"/>
      <div class="h-8 rounded-xl" style="background:rgba(255,255,255,0.04);"/>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="flex items-center gap-2 py-2">
      <svg class="w-4 h-4 shrink-0" style="color:#ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <span class="text-xs" style="color:#94a3b8;">Não foi possível carregar os dados.</span>
    </div>

    <!-- Dados -->
    <template v-else-if="stats">

      <!-- Barra banco total -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium" style="color:#94a3b8;">Banco total (dados + índices)</span>
          <span class="text-xs font-semibold" style="color:#e2e8f0;">
            {{ fmt(stats.bancoTotalMB) }} / {{ fmt(stats.limitMB) }}
          </span>
        </div>
        <div class="relative h-2.5 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.06);">
          <div
            class="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
            :style="{ width: stats.percentBanco + '%', background: corBarra }"
          />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[11px]" :style="{ color: corBarra }">
            {{ stats.percentBanco?.toFixed(1) }}% usado
          </span>
          <span class="text-[11px]" style="color:#475569;">
            {{ fmt(stats.limitMB - stats.bancoTotalMB) }} livre
          </span>
        </div>
      </div>

      <!-- Divisor -->
      <div style="border-top:1px solid rgba(255,255,255,0.05);"/>

      <!-- Barra mídias -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium" style="color:#94a3b8;">Mídias (imagens, vídeos, áudios)</span>
          <span class="text-xs font-semibold" style="color:#e2e8f0;">
            {{ fmt(stats.totalMidiaMB) }}
          </span>
        </div>
        <div class="relative h-2 rounded-full overflow-hidden" style="background:rgba(255,255,255,0.06);">
          <div
            class="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
            :style="{ width: Math.max(stats.percentMidia, 0.3) + '%', background: corBarraMidia }"
          />
        </div>
        <span class="text-[11px]" :style="{ color: corBarraMidia }">
          {{ stats.percentMidia.toFixed(2) }}% do limite total
        </span>
      </div>

      <!-- Breakdown por fonte -->
      <div class="space-y-2 pt-1">
        <p class="text-[10px] font-semibold uppercase tracking-wider" style="color:#475569;">Detalhamento de mídias</p>

        <!-- Solicitações -->
        <div class="flex items-center justify-between px-3 py-2 rounded-xl" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full shrink-0" style="background:#818cf8;"/>
            <span class="text-xs" style="color:#94a3b8;">Solicitações de clientes</span>
          </div>
          <span class="text-xs font-medium" style="color:#e2e8f0;">{{ fmt(stats.solicitacoes.mb) }}</span>
        </div>

        <!-- Portfolio -->
        <div class="flex items-center justify-between px-3 py-2 rounded-xl" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full shrink-0" style="background:#34d399;"/>
            <span class="text-xs" style="color:#94a3b8;">Portfólio</span>
          </div>
          <span class="text-xs font-medium" style="color:#e2e8f0;">{{ fmt(stats.portfolio.mb) }}</span>
        </div>

        <!-- Certificados -->
        <div class="flex items-center justify-between px-3 py-2 rounded-xl" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full shrink-0" style="background:#f59e0b;"/>
            <span class="text-xs" style="color:#94a3b8;">Certificados A1</span>
          </div>
          <span class="text-xs font-medium" style="color:#e2e8f0;">{{ fmt(stats.certs.mb) }}</span>
        </div>
      </div>

      <!-- Divisor -->
      <div style="border-top:1px solid rgba(255,255,255,0.05);"/>

      <!-- Detalhamento por tabela -->
      <div class="space-y-2">
        <button
          class="w-full flex items-center justify-between py-0.5"
          @click="showTables = !showTables"
        >
          <p class="text-[10px] font-semibold uppercase tracking-wider" style="color:#475569;">Tabelas do banco</p>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px]" style="color:#475569;">{{ fmtBytes(dbTotalBytes) }} total</span>
            <svg
              class="w-3.5 h-3.5 transition-transform duration-200"
              :style="showTables ? 'transform:rotate(180deg);color:#6366f1;' : 'color:#475569;'"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </button>

        <div v-if="showTables" class="space-y-1.5">
          <div
            v-for="(t, i) in tables"
            :key="t.tablename"
            class="rounded-xl overflow-hidden"
            style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);"
          >
            <div class="px-3 py-2 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-2 h-2 rounded-full shrink-0" :style="{ background: TABLE_COLORS[i % TABLE_COLORS.length] }"/>
                <span class="text-xs truncate" style="color:#94a3b8;">{{ tableLabel(t.tablename) }}</span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-[10px]" style="color:#475569;">{{ t.row_count > 0 ? t.row_count + ' reg.' : '—' }}</span>
                <span class="text-xs font-medium" style="color:#e2e8f0;">{{ fmtBytes(t.total_bytes) }}</span>
              </div>
            </div>
            <div class="h-0.5 w-full" style="background:rgba(255,255,255,0.04);">
              <div
                class="h-full transition-all duration-500"
                :style="{ width: Math.max(tablePercent(t.total_bytes), 0.5) + '%', background: TABLE_COLORS[i % TABLE_COLORS.length] }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Alerta crítico: >= 400 MB — upgrade Pro -->
      <div
        v-if="stats.bancoTotalMB >= 400"
        class="rounded-xl overflow-hidden"
        style="border:1px solid rgba(239,68,68,0.4);"
      >
        <div class="px-4 py-3 flex items-center gap-2" style="background:rgba(239,68,68,0.12);">
          <svg class="w-4 h-4 shrink-0" style="color:#ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-xs font-semibold" style="color:#fca5a5;">Limite de armazenamento próximo!</p>
        </div>
        <div class="px-4 py-3 space-y-3" style="background:rgba(239,68,68,0.06);">
          <p class="text-xs leading-relaxed" style="color:#fca5a5;">
            O banco já atingiu <span class="font-bold">{{ fmt(stats.bancoTotalMB) }}</span> de 500 MB.
            Para continuar recebendo mídias de clientes sem interrupção, é necessário fazer upgrade para o
            <span class="font-bold text-white">Plano Pro do Supabase</span>
            (8 GB de banco + 100 GB de storage por <span class="font-bold text-white">$25/mês</span>).
          </p>
          <a
            href="https://supabase.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold transition-all"
            style="background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff;"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            Ver Plano Pro no Supabase
          </a>
        </div>
      </div>

      <!-- Alerta moderado: >= 70% e < 400 MB -->
      <div
        v-else-if="(stats.percentBanco ?? 0) >= 70"
        class="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
        style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.25);"
      >
        <svg class="w-4 h-4 shrink-0 mt-0.5" style="color:#f59e0b;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <p class="text-xs leading-relaxed" style="color:#fbbf24;">
          Banco acima de 70% da capacidade. Considere limpar mídias antigas ou fazer upgrade do plano.
        </p>
      </div>

    </template>
  </div>
</template>
