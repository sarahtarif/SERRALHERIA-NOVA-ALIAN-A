<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useSiteConfig } from '~/composables/useSiteConfig'
import type { SiteConfigRow } from '~/composables/useSiteConfig'

const supabase = useSupabase()
const { salvar, carregarTodos } = useSiteConfig()

const loading = ref(true)
const saving = ref<string | null>(null)
const saved = ref<string | null>(null)
const isSuperAdmin = ref(false)
const rows = ref<SiteConfigRow[]>([])
const editValues = ref<Record<string, string>>({})
const abaAtiva = ref('identidade')

const GRUPO_LABELS: Record<string, string> = {
  identidade: 'Identidade',
  hero: 'Hero / Banner',
  servicos: 'Serviços',
  why: 'Por que nos escolher',
  cores: 'Cores',
  fontes: 'Fontes',
  contato: 'Contato',
  nav: 'Navegação',
}

const grupos = computed(() => {
  const set = new Set(rows.value.map(r => r.grupo))
  return Array.from(set)
})

const rowsDoGrupo = computed(() =>
  rows.value.filter(r => r.grupo === abaAtiva.value)
)

onMounted(async () => {
  // Verifica se é super_admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase.from('admins').select('role').eq('id', user.id).maybeSingle()
  if (data?.role !== 'super_admin') return
  isSuperAdmin.value = true

  // Carrega configs — sempre força recarregar ao abrir o editor
  const all = await carregarTodos()
  rows.value = all
  all.forEach(r => { editValues.value[r.chave] = r.valor })
  loading.value = false
})

async function salvarCampo(chave: string) {
  saving.value = chave
  try {
    await salvar(chave, editValues.value[chave] ?? '')
    // Atualiza o valor original para isDirty funcionar corretamente
    const row = rows.value.find(r => r.chave === chave)
    if (row) row.valor = editValues.value[chave] ?? ''
    saved.value = chave
    setTimeout(() => { if (saved.value === chave) saved.value = null }, 2500)
  } catch (e: unknown) {
    const msg = (e as { data?: { message?: string }; message?: string })?.data?.message
      ?? (e as { message?: string })?.message
      ?? 'Erro ao salvar'
    alert('Erro: ' + msg)
  } finally {
    saving.value = null
  }
}

function isDirty(chave: string): boolean {
  const original = rows.value.find(r => r.chave === chave)?.valor ?? ''
  return editValues.value[chave] !== original
}
</script>

<template>
  <div id="admin-site-editor" class="flex-1 overflow-y-auto px-4 py-6">

    <!-- Acesso negado -->
    <div v-if="!loading && !isSuperAdmin" class="max-w-lg mx-auto text-center py-16 space-y-4">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2);">
        <svg class="w-8 h-8" style="color:#ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-white">Acesso restrito</p>
      <p class="text-xs" style="color:#64748b;">Apenas Super Admins podem editar as configurações do site.</p>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="max-w-3xl mx-auto space-y-4 animate-pulse">
      <div class="h-10 rounded-xl" style="background:rgba(255,255,255,0.05);"/>
      <div class="h-64 rounded-2xl" style="background:rgba(255,255,255,0.03);"/>
    </div>

    <!-- Editor -->
    <div v-else-if="isSuperAdmin" class="max-w-3xl mx-auto space-y-6">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
          <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-white">Editor do Site</p>
          <p class="text-xs" style="color:#64748b;">Alterações são aplicadas em tempo real no site</p>
        </div>
      </div>

      <!-- Abas de grupos -->
      <div class="flex gap-1 flex-wrap">
        <button
          v-for="grupo in grupos"
          :key="grupo"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :style="abaAtiva === grupo
            ? 'background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.4);'
            : 'background:rgba(255,255,255,0.03); color:#64748b; border:1px solid rgba(255,255,255,0.06);'"
          @click="abaAtiva = grupo"
        >
          {{ GRUPO_LABELS[grupo] ?? grupo }}
        </button>
      </div>

      <!-- Campos do grupo ativo -->
      <div class="space-y-3">
        <div
          v-for="row in rowsDoGrupo"
          :key="row.chave"
          class="rounded-2xl p-4 space-y-2"
          style="background:#0d1526; border:1px solid rgba(255,255,255,0.06);"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs font-semibold text-white">{{ row.label }}</p>
              <p v-if="row.descricao" class="text-[11px] mt-0.5" style="color:#475569;">{{ row.descricao }}</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-full shrink-0" style="background:rgba(255,255,255,0.05); color:#475569;">{{ row.tipo }}</span>
          </div>

          <!-- Input por tipo -->
          <!-- Cor -->
          <div v-if="row.tipo === 'color'" class="flex items-center gap-3">
            <input
              type="color"
              :value="editValues[row.chave]"
              class="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5"
              style="background:rgba(255,255,255,0.05);"
              @input="editValues[row.chave] = ($event.target as HTMLInputElement).value"
            />
            <input
              v-model="editValues[row.chave]"
              type="text"
              class="flex-1 px-3 py-2 rounded-lg text-sm outline-none font-mono"
              style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
              @focus="($event.target as HTMLElement).style.borderColor='rgba(99,102,241,0.6)'"
              @blur="($event.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'"
            />
          </div>

          <!-- JSON -->
          <textarea
            v-else-if="row.tipo === 'json'"
            v-model="editValues[row.chave]"
            rows="4"
            class="w-full px-3 py-2 rounded-lg text-xs outline-none font-mono resize-y"
            style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
            @focus="($event.target as HTMLElement).style.borderColor='rgba(99,102,241,0.6)'"
            @blur="($event.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'"
          />

          <!-- Texto longo (> 80 chars) -->
          <textarea
            v-else-if="(editValues[row.chave] ?? '').length > 80"
            v-model="editValues[row.chave]"
            rows="3"
            class="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
            style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
            @focus="($event.target as HTMLElement).style.borderColor='rgba(99,102,241,0.6)'"
            @blur="($event.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'"
          />

          <!-- Texto simples -->
          <input
            v-else
            v-model="editValues[row.chave]"
            type="text"
            class="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);"
            @focus="($event.target as HTMLElement).style.borderColor='rgba(99,102,241,0.6)'"
            @blur="($event.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'"
          />

          <!-- Botão salvar -->
          <div class="flex justify-end pt-1">
            <button
              :disabled="saving === row.chave || !isDirty(row.chave)"
              class="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              :style="saved === row.chave
                ? 'background:rgba(52,211,153,0.15); color:#6ee7b7; border:1px solid rgba(52,211,153,0.3);'
                : 'background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);'"
              @click="salvarCampo(row.chave)"
            >
              <svg v-if="saved === row.chave" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              <svg v-else-if="saving === row.chave" class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ saved === row.chave ? 'Salvo!' : saving === row.chave ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Aviso -->
      <div class="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style="background:rgba(99,102,241,0.06); border:1px solid rgba(99,102,241,0.15);">
        <svg class="w-4 h-4 shrink-0 mt-0.5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-xs leading-relaxed" style="color:#818cf8;">
          Alterações de texto e cor são aplicadas imediatamente. Para ver no site, recarregue a página ou use "Ver Site" no menu.
        </p>
      </div>

    </div>
  </div>
</template>
