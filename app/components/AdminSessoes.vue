<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

interface Sessao {
  id: string
  admin_id: string
  admin_email: string
  ip: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  cidade: string | null
  regiao: string | null
  pais: string | null
  logged_at: string
}

const supabase = useSupabase()
const sessoes = ref<Sessao[]>([])
const loading = ref(true)
const erro = ref('')

async function carregar() {
  loading.value = true
  erro.value = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = session?.access_token
      ? { Authorization: 'Bearer ' + session.access_token }
      : {}
    const res = await $fetch<{ sessoes: Sessao[] }>('/api/admin/sessoes', { headers })
    sessoes.value = res.sessoes
  } catch (e: unknown) {
    erro.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao carregar sessões.'
  } finally {
    loading.value = false
  }
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso))
}

function deviceIcon(type: string | null): string {
  if (type === 'mobile') return 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
  if (type === 'tablet') return 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
  return 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
}

function localLabel(s: Sessao): string {
  const parts = [s.cidade, s.regiao, s.pais].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Localização desconhecida'
}

onMounted(carregar)
</script>

<template>
  <div id="admin-sessoes" class="flex flex-col h-full">
    <div class="px-4 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <h2 class="text-base font-semibold text-white">Sessões de Acesso</h2>
        <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">{{ sessoes.length }}</span>
      </div>
      <button
        @click="carregar"
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
        :class="loading ? 'animate-spin' : ''"
        style="color:#475569;"
        title="Atualizar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <svg class="w-6 h-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    </div>

    <!-- Erro -->
    <div v-else-if="erro" class="flex-1 flex items-center justify-center px-4">
      <p class="text-sm text-red-400">{{ erro }}</p>
    </div>

    <!-- Vazio -->
    <div v-else-if="!sessoes.length" class="flex-1 flex items-center justify-center">
      <p class="text-sm" style="color:#475569;">Nenhuma sessão registrada ainda.</p>
    </div>

    <!-- Lista -->
    <div v-else class="flex-1 overflow-y-auto divide-y divide-white/5">
      <div
        v-for="s in sessoes"
        :key="s.id"
        class="px-4 py-3.5 flex items-start gap-3"
      >
        <!-- Ícone dispositivo -->
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style="background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2);"
        >
          <svg class="w-4.5 h-4.5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" :d="deviceIcon(s.device_type)"/>
          </svg>
        </div>

        <div class="flex-1 min-w-0 space-y-1">
          <!-- Email + data -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <p class="text-sm font-medium text-white truncate">{{ s.admin_email }}</p>
            <span class="text-[11px] shrink-0" style="color:#475569;">{{ formatDate(s.logged_at) }}</span>
          </div>

          <!-- Dispositivo -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              v-if="s.device_type"
              class="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
              style="background:rgba(99,102,241,0.12);color:#a5b4fc;"
            >{{ s.device_type === 'mobile' ? 'Mobile' : s.device_type === 'tablet' ? 'Tablet' : 'Desktop' }}</span>
            <span v-if="s.browser" class="text-xs" style="color:#64748b;">{{ s.browser }}</span>
            <span v-if="s.browser && s.os" class="text-xs" style="color:#334155;">·</span>
            <span v-if="s.os" class="text-xs" style="color:#64748b;">{{ s.os }}</span>
          </div>

          <!-- Localização + IP -->
          <div class="flex items-center gap-2 flex-wrap">
            <div class="flex items-center gap-1">
              <svg class="w-3 h-3 shrink-0" style="color:#475569;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-xs" style="color:#64748b;">{{ localLabel(s) }}</span>
            </div>
            <span v-if="s.ip" class="text-[10px] font-mono px-1.5 py-0.5 rounded" style="background:rgba(255,255,255,0.04);color:#475569;">{{ s.ip }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
