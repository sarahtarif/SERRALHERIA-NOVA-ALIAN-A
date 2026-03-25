<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useSupabase } from "~/composables/useSupabase"
import { useAuth } from "~/composables/useAuth"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface Agendamento {
  id: string
  titulo: string
  descricao: string | null
  data_servico: string
  horario: string
  status: "agendado" | "em_andamento" | "concluido" | "cancelado"
  servicos_catalogo: { nome: string } | null
}

const supabase = useSupabase()
const { user } = useAuth()
const agendamentos = ref<Agendamento[]>([])
const loading = ref(true)
const selecionado = ref<Agendamento | null>(null)
let channel: RealtimeChannel | null = null

const statusConfig: Record<string, { label: string; bg: string; dot: string }> = {
  agendado:     { label: "Agendado",     bg: "bg-blue-100 text-blue-700 border-blue-200",    dot: "bg-blue-500" },
  em_andamento: { label: "Em andamento", bg: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  concluido:    { label: "Concluído",    bg: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
  cancelado:    { label: "Cancelado",    bg: "bg-red-100 text-red-700 border-red-200",       dot: "bg-red-500" },
}

function formatDate(d: string): string {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(d + "T00:00:00"))
}

function adicionarAgenda(ag: Agendamento): void {
  const [year, month, day] = ag.data_servico.split("-")
  const [hour, minute] = ag.horario.slice(0, 5).split(":")
  const dtStart = `${year}${month}${day}T${hour}${minute}00`
  const endHour = String(Number(hour) + 2).padStart(2, "0")
  const dtEnd = `${year}${month}${day}T${endHour}${minute}00`
  const servico = ag.servicos_catalogo?.nome ?? "Servico"
  const descricao = ag.descricao ? ag.descricao.replace(/\n/g, "\\n") : ""
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0",
    "PRODID:-//Nova Alianca//Agendamento//PT",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ag.id}@nova-alianca`,
    `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
    `SUMMARY:${ag.titulo} - ${servico}`,
    `DESCRIPTION:${descricao}`,
    "LOCATION:A combinar", "STATUS:CONFIRMED",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n")
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `agendamento-${ag.id.slice(0, 8)}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

async function carregar() {
  if (!user.value) return
  const { data } = await supabase
    .from("agendamentos")
    .select("id, titulo, descricao, data_servico, horario, status, servicos_catalogo(nome)")
    .eq("user_id", user.value.id)
    .order("data_servico", { ascending: false })
  agendamentos.value = (data ?? []).map((ag: Record<string, unknown>) => ({
    ...ag,
    servicos_catalogo: Array.isArray(ag.servicos_catalogo)
      ? (ag.servicos_catalogo[0] ?? null)
      : ag.servicos_catalogo,
  })) as Agendamento[]
  loading.value = false
}

// Atualiza o item selecionado no modal se ele foi alterado via realtime
function sincronizarSelecionado(atualizado: Agendamento) {
  if (selecionado.value?.id === atualizado.id) {
    selecionado.value = atualizado
  }
}

onMounted(async () => {
  await carregar()

  if (!user.value) return

  // Realtime: escuta UPDATE e DELETE na tabela agendamentos filtrado pelo user_id
  channel = supabase
    .channel(`agendamentos-cliente-${user.value.id}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "agendamentos", filter: `user_id=eq.${user.value.id}` },
      async (payload) => {
        // Recarrega para pegar joins (servicos_catalogo)
        await carregar()
        // Atualiza modal se estiver aberto
        const atualizado = agendamentos.value.find(a => a.id === payload.new.id)
        if (atualizado) sincronizarSelecionado(atualizado)
      }
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "agendamentos", filter: `user_id=eq.${user.value.id}` },
      async (payload) => {
        agendamentos.value = agendamentos.value.filter(a => a.id !== payload.old.id)
        if (selecionado.value?.id === payload.old.id) selecionado.value = null
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "agendamentos", filter: `user_id=eq.${user.value.id}` },
      async () => { await carregar() }
    )
    .subscribe()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})
</script>

<template>
  <div class="w-full space-y-3">

    <!-- Skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-20 rounded-2xl animate-pulse bg-gray-100" />
    </div>

    <!-- Lista de cards -->
    <template v-else-if="agendamentos.length">
      <button
        v-for="ag in agendamentos"
        :key="ag.id"
        class="w-full text-left rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all active:scale-[0.99]"
        @click="selecionado = ag"
      >
        <div class="flex items-center gap-3 px-4 py-4">
          <!-- Ícone de data -->
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
            <span class="text-[10px] font-bold text-primary uppercase leading-none">
              {{ new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(new Date(ag.data_servico + "T00:00:00")) }}
            </span>
            <span class="text-lg font-bold text-primary leading-tight">
              {{ new Date(ag.data_servico + "T00:00:00").getDate() }}
            </span>
          </div>

          <!-- Info principal -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 text-sm leading-snug truncate">{{ ag.titulo }}</p>
            <p v-if="ag.servicos_catalogo" class="text-xs text-gray-400 mt-0.5 truncate">{{ ag.servicos_catalogo.nome }}</p>
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', statusConfig[ag.status]?.bg]">
                <span :class="['w-1.5 h-1.5 rounded-full shrink-0', statusConfig[ag.status]?.dot]" />
                {{ statusConfig[ag.status]?.label }}
              </span>
              <span class="text-xs text-gray-400">{{ ag.horario.slice(0, 5) }}</span>
            </div>
          </div>

          <!-- Seta -->
          <svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    </template>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <svg class="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm font-medium text-gray-500">Nenhum agendamento encontrado</p>
      <p class="text-xs text-gray-400 mt-1">Seus agendamentos aparecerão aqui</p>
    </div>

  </div>

  <!-- ===== MODAL DE DETALHES ===== -->
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="selecionado"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style="background:rgba(0,0,0,0.45); backdrop-filter:blur(3px);"
        @click.self="selecionado = null"
      >
        <div class="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl">

          <!-- Handle mobile -->
          <div class="flex justify-center pt-3 pb-1 sm:hidden">
            <div class="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          <!-- Header -->
          <div class="flex items-start justify-between px-5 pt-4 pb-3 border-b border-gray-100">
            <div class="flex-1 min-w-0 pr-3">
              <h3 class="text-base font-bold text-gray-900 leading-snug">{{ selecionado.titulo }}</h3>
              <p v-if="selecionado.servicos_catalogo" class="text-xs text-gray-400 mt-0.5">{{ selecionado.servicos_catalogo.nome }}</p>
            </div>
            <button
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors"
              @click="selecionado = null"
            >
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Corpo -->
          <div class="px-5 py-4 space-y-4">

            <!-- Status -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</span>
              <span :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border', statusConfig[selecionado.status]?.bg]">
                <span :class="['w-2 h-2 rounded-full', statusConfig[selecionado.status]?.dot]" />
                {{ statusConfig[selecionado.status]?.label }}
              </span>
            </div>

            <!-- Detalhes -->
            <div class="rounded-2xl bg-gray-50 divide-y divide-gray-100 overflow-hidden">
              <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-2 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm">Data</span>
                </div>
                <span class="text-sm font-semibold text-gray-800 text-right max-w-[55%] capitalize">{{ formatDate(selecionado.data_servico) }}</span>
              </div>
              <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-2 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm">Horário</span>
                </div>
                <span class="text-sm font-semibold text-gray-800">{{ selecionado.horario.slice(0, 5) }}</span>
              </div>
              <div v-if="selecionado.servicos_catalogo" class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center gap-2 text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span class="text-sm">Serviço</span>
                </div>
                <span class="text-sm font-semibold text-gray-800 text-right max-w-[55%]">{{ selecionado.servicos_catalogo.nome }}</span>
              </div>
            </div>

            <!-- Observações -->
            <div v-if="selecionado.descricao" class="rounded-2xl bg-gray-50 px-4 py-3">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Observações</p>
              <p class="text-sm text-gray-700 leading-relaxed">{{ selecionado.descricao }}</p>
            </div>

            <!-- Botão agenda -->
            <button
              @click="adicionarAgenda(selecionado)"
              class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all hover:brightness-95 active:scale-[0.98]"
              style="background:#eef2ff; color:#4f46e5; border:1px solid #c7d2fe;"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Adicionar na minha agenda
            </button>
          </div>

          <div class="h-4 sm:h-0" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-up-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(40px); }
.slide-up-leave-to { opacity: 0; transform: translateY(20px); }

@media (min-width: 640px) {
  .slide-up-enter-from { opacity: 0; transform: scale(0.95) translateY(0); }
  .slide-up-leave-to { opacity: 0; transform: scale(0.95); }
}
</style>