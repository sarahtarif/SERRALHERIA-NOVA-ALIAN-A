<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const supabase = useSupabase()

const loading = ref(true)
const saving = ref(false)
const testing = ref(false)
const saved = ref(false)
const testResult = ref('')
const error = ref('')

const form = ref({
  ativo: true,
  dias_antes: [1, 2] as number[],
  horarios_envio: ['08:00'] as string[],
  emails_admin: [''] as string[],
  notificar_cliente: false,
  gmail_user: '',
  gmail_pass: '',
})

const novoHorario = ref('09:00')
const novoDia = ref(1)

async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? ''
}

async function carregar() {
  loading.value = true
  try {
    const token = await getToken()
    const res = await $fetch<{ data: typeof form.value }>('/api/notificacoes/config', {
      headers: { Authorization: 'Bearer ' + token },
    })
    if (res.data) {
      form.value = {
        ativo: res.data.ativo ?? true,
        dias_antes: res.data.dias_antes ?? [1, 2],
        horarios_envio: res.data.horarios_envio ?? ['08:00'],
        emails_admin: res.data.emails_admin?.length ? res.data.emails_admin : [''],
        notificar_cliente: res.data.notificar_cliente ?? false,
        gmail_user: res.data.gmail_user ?? '',
        gmail_pass: res.data.gmail_pass ?? '',
      }
    }
  } finally {
    loading.value = false
  }
}

async function salvar() {
  error.value = ''
  const emailsValidos = form.value.emails_admin.filter(e => e.trim())
  if (!emailsValidos.length) { error.value = 'Adicione pelo menos um email de admin.'; return }
  if (!form.value.gmail_user) { error.value = 'Informe o Gmail para envio.'; return }

  saving.value = true
  try {
    const token = await getToken()
    await $fetch('/api/notificacoes/config', {
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + token },
      body: { ...form.value, emails_admin: emailsValidos },
    })
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erro ao salvar.'
  } finally {
    saving.value = false
  }
}

async function testarDisparo() {
  testResult.value = ''
  testing.value = true
  try {
    const token = await getToken()
    const res = await $fetch<{ ok: boolean; enviados?: number; message?: string }>('/api/notificacoes/disparar', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    })
    testResult.value = res.ok
      ? (res.enviados ? res.enviados + ' email(s) enviado(s) com sucesso!' : res.message ?? 'Nenhum agendamento próximo.')
      : (res.message ?? 'Erro no disparo.')
  } catch (e: unknown) {
    testResult.value = 'Erro: ' + ((e as { data?: { message?: string } })?.data?.message ?? 'falha no envio')
  } finally {
    testing.value = false
  }
}

function addDia() {
  const d = Number(novoDia.value)
  if (d > 0 && d <= 30 && !form.value.dias_antes.includes(d)) {
    form.value.dias_antes = [...form.value.dias_antes, d].sort((a, b) => a - b)
  }
}

function removeDia(d: number) {
  form.value.dias_antes = form.value.dias_antes.filter(x => x !== d)
}

function addHorario() {
  if (novoHorario.value && !form.value.horarios_envio.includes(novoHorario.value)) {
    form.value.horarios_envio = [...form.value.horarios_envio, novoHorario.value].sort()
  }
}

function removeHorario(h: string) {
  form.value.horarios_envio = form.value.horarios_envio.filter(x => x !== h)
}

function addEmailAdmin() {
  form.value.emails_admin.push('')
}

function removeEmailAdmin(i: number) {
  if (form.value.emails_admin.length > 1) form.value.emails_admin.splice(i, 1)
}

onMounted(carregar)
</script>

<template>
  <div id="admin-notificacoes" class="flex-1 overflow-y-auto px-4 py-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
        <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-white">Notificações de Agendamento</p>
        <p class="text-xs" style="color:#64748b;">Configure avisos por email para agendamentos próximos</p>
      </div>
    </div>

    <div v-if="loading" class="space-y-3 animate-pulse">
      <div v-for="i in 4" :key="i" class="h-16 rounded-xl" style="background:#0d1526;" />
    </div>

    <div v-else class="space-y-4 max-w-2xl">

      <!-- Ativo -->
      <div class="rounded-2xl p-4 flex items-center justify-between" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">
        <div>
          <p class="text-sm font-semibold text-white">Notificações ativas</p>
          <p class="text-xs mt-0.5" style="color:#64748b;">Ativar ou desativar todos os disparos</p>
        </div>
        <button
          class="relative w-12 h-6 rounded-full transition-colors"
          :style="form.ativo ? 'background:#6366f1;' : 'background:#334155;'"
          @click="form.ativo = !form.ativo"
        >
          <span class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" :style="form.ativo ? 'left:26px;' : 'left:2px;'" />
        </button>
      </div>

      <!-- Dias antes -->
      <div class="rounded-2xl p-4 space-y-3" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">
        <p class="text-sm font-semibold text-white">Quantos dias antes avisar</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="d in form.dias_antes"
            :key="d"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style="background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);"
          >
            {{ d }} dia{{ d > 1 ? 's' : '' }} antes
            <button class="hover:text-red-400 transition-colors" @click="removeDia(d)">×</button>
          </span>
        </div>
        <div class="flex gap-2">
          <input v-model.number="novoDia" type="number" min="1" max="30" class="w-20 px-3 py-1.5 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
          <button class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style="background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);" @click="addDia">+ Adicionar</button>
        </div>
      </div>

      <!-- Horários -->
      <div class="rounded-2xl p-4 space-y-3" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">
        <p class="text-sm font-semibold text-white">Horários de envio no dia</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="h in form.horarios_envio"
            :key="h"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style="background:rgba(52,211,153,0.1); color:#6ee7b7; border:1px solid rgba(52,211,153,0.2);"
          >
            {{ h }}
            <button class="hover:text-red-400 transition-colors" @click="removeHorario(h)">×</button>
          </span>
        </div>
        <div class="flex gap-2">
          <input v-model="novoHorario" type="time" class="px-3 py-1.5 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
          <button class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style="background:rgba(52,211,153,0.1); color:#6ee7b7; border:1px solid rgba(52,211,153,0.2);" @click="addHorario">+ Adicionar</button>
        </div>
      </div>

      <!-- Gmail -->
      <div class="rounded-2xl p-4 space-y-3" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">
        <p class="text-sm font-semibold text-white">Gmail para envio</p>
        <p class="text-xs" style="color:#64748b;">Use uma Senha de App do Google (não a senha normal)</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-400 mb-1">Email Gmail</label>
            <input v-model="form.gmail_user" type="email" placeholder="seu@gmail.com" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
          </div>
          <div>
            <label class="block text-xs text-gray-400 mb-1">Senha de App</label>
            <input v-model="form.gmail_pass" type="password" placeholder="••••••••••••••••" class="w-full px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
          </div>
        </div>
      </div>

      <!-- Emails admin -->
      <div class="rounded-2xl p-4 space-y-3" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-white">Emails dos administradores <span class="text-red-400">*</span></p>
            <p class="text-xs mt-0.5" style="color:#64748b;">Obrigatório — receberão todos os avisos</p>
          </div>
          <button class="text-xs px-3 py-1.5 rounded-lg transition-all" style="background:rgba(99,102,241,0.12); color:#a5b4fc; border:1px solid rgba(99,102,241,0.2);" @click="addEmailAdmin">+ Email</button>
        </div>
        <div class="space-y-2">
          <div v-for="(_, i) in form.emails_admin" :key="i" class="flex gap-2">
            <input v-model="form.emails_admin[i]" type="email" placeholder="admin@empresa.com" class="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style="background:#1e293b; color:#e2e8f0; border:1px solid rgba(255,255,255,0.08);" />
            <button v-if="form.emails_admin.length > 1" class="w-8 h-9 rounded-lg flex items-center justify-center transition-colors" style="color:#ef4444; background:rgba(239,68,68,0.08);" @click="removeEmailAdmin(i)">×</button>
          </div>
        </div>
      </div>

      <!-- Notificar cliente -->
      <div class="rounded-2xl p-4 flex items-center justify-between" style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);">
        <div>
          <p class="text-sm font-semibold text-white">Notificar cliente por email</p>
          <p class="text-xs mt-0.5" style="color:#64748b;">Opcional — envia lembrete para o email do cliente se disponível</p>
        </div>
        <button
          class="relative w-12 h-6 rounded-full transition-colors"
          :style="form.notificar_cliente ? 'background:#6366f1;' : 'background:#334155;'"
          @click="form.notificar_cliente = !form.notificar_cliente"
        >
          <span class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" :style="form.notificar_cliente ? 'left:26px;' : 'left:2px;'" />
        </button>
      </div>

      <!-- Feedback -->
      <p v-if="error" class="text-xs text-red-400 px-1">{{ error }}</p>
      <p v-if="testResult" class="text-xs px-1" :style="testResult.includes('Erro') ? 'color:#f87171;' : 'color:#6ee7b7;'">{{ testResult }}</p>

      <!-- Botões -->
      <div class="flex gap-3">
        <button
          :disabled="testing"
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          style="background:rgba(52,211,153,0.1); color:#6ee7b7; border:1px solid rgba(52,211,153,0.2);"
          @click="testarDisparo"
        >
          {{ testing ? 'Disparando...' : 'Testar Disparo Agora' }}
        </button>
        <button
          :disabled="saving"
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
          :style="saved ? 'background:rgba(52,211,153,0.15); color:#6ee7b7; border:1px solid rgba(52,211,153,0.3);' : 'background:rgba(99,102,241,0.2); color:#a5b4fc; border:1px solid rgba(99,102,241,0.3);'"
          @click="salvar"
        >
          {{ saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar Configuração' }}
        </button>
      </div>

      <!-- Info sobre agendamento automático -->
      <div class="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style="background:rgba(99,102,241,0.06); border:1px solid rgba(99,102,241,0.15);">
        <svg class="w-4 h-4 shrink-0 mt-0.5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="text-xs leading-relaxed" style="color:#818cf8;">
          Para disparos automáticos nos horários configurados, configure um cron job externo (ex: cron-job.org) apontando para <code class="px-1 py-0.5 rounded" style="background:rgba(99,102,241,0.2);">POST /api/notificacoes/disparar</code> com o header <code class="px-1 py-0.5 rounded" style="background:rgba(99,102,241,0.2);">Authorization: Bearer internal-job-XXXXXXXX</code>. Use o botão "Testar" para disparar manualmente.
        </p>
      </div>

    </div>
  </div>
</template>
