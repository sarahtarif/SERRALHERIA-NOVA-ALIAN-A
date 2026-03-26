<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useSupabase } from '~/composables/useSupabase'
import AdminPerfil from '~/components/AdminPerfil.vue'
import AdminSolicitacoes from '~/components/AdminSolicitacoes.vue'
import AdminClientes from '~/components/AdminClientes.vue'
import AdminAgendamentos from '~/components/AdminAgendamentos.vue'
import AdminCertificadoA1 from '~/components/AdminCertificadoA1.vue'
import AdminStorageWidget from '~/components/AdminStorageWidget.vue'
import AdminPortfolio from '~/components/AdminPortfolio.vue'
import AdminNotificacoes from '~/components/AdminNotificacoes.vue'
import AdminSiteEditor from '~/components/AdminSiteEditor.vue'
import type { RealtimeChannel } from '@supabase/supabase-js'

definePageMeta({ layout: false, middleware: ['admin-auth'] })

type Section = 'home' | 'solicitacoes' | 'clientes' | 'nfe' | 'agendamentos' | 'portfolio' | 'notificacoes' | 'site' | 'editor'

const { adminUser, logoutAdmin, adminRole } = useAdminAuth()
const iframeKey = ref(0)

function reloadSite(): void { iframeKey.value++ }
const supabase = useSupabase()

const showPerfil = ref(false)
const sidebarOpen = ref(false)
const activeSection = ref<Section>('home')

// Notificações
const unreadCount = ref(0)
const toastVisible = ref(false)
const toastTitle = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
let realtimeChannel: RealtimeChannel | null = null

const initials = computed(() => (adminUser.value?.email ?? '').charAt(0).toUpperCase())

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
})

function navigate(section: Section): void {
  activeSection.value = section
  sidebarOpen.value = false
}

function clearUnread(): void {
  unreadCount.value = 0
}

function showToast(title: string): void {
  toastTitle.value = title
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 5000)
}

onMounted(() => {
  realtimeChannel = supabase
    .channel('solicitacoes-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'solicitacoes' },
      (payload) => {
        unreadCount.value++
        const titulo = (payload.new as { titulo?: string }).titulo ?? 'Nova solicitação'
        showToast(titulo)
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (realtimeChannel) supabase.removeChannel(realtimeChannel)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <div id="gestao-na-page" class="min-h-screen flex flex-col" style="background:#080e1a;">

    <!-- ===== TOPBAR ===== -->
    <header
      class="w-full flex items-center justify-between px-4 py-3 shrink-0 z-30 sticky top-0"
      style="background:#0d1526; border-bottom:1px solid rgba(255,255,255,0.06);"
    >
      <!-- Esquerda: hamburguer + logo -->
      <div class="flex items-center gap-3">
        <button
          class="w-9 h-9 rounded-lg flex items-center justify-center md:hidden transition-colors"
          style="background:rgba(255,255,255,0.05); color:#94a3b8;"
          @click="sidebarOpen = !sidebarOpen"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style="background:linear-gradient(135deg,#6366f1,#818cf8);">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <span class="text-sm font-semibold hidden sm:block" style="color:#e2e8f0;">Painel de Gestão</span>
        </div>
      </div>

      <!-- Direita: sino + avatar + sair -->
      <div class="flex items-center gap-2">

        <!-- Sino de notificações -->
        <button
          id="btn-bell"
          class="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style="background:rgba(255,255,255,0.05); color:#94a3b8;"
          @click="clearUnread"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1"
            style="background:#ef4444;"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>

        <button
          id="btn-admin-perfil"
          class="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center transition-all ring-2 ring-indigo-500/30"
          style="background:linear-gradient(135deg,#6366f1,#818cf8);"
          @click="showPerfil = true"
        >
          {{ initials }}
        </button>
        <button
          id="btn-admin-sair"
          class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style="border:1px solid rgba(255,255,255,0.08); color:#64748b;"
          @click="logoutAdmin"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sair
        </button>
        <button
          class="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style="background:rgba(255,255,255,0.05); color:#64748b;"
          @click="logoutAdmin"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- ===== BODY ===== -->
    <div class="flex flex-1 overflow-hidden relative">

      <!-- Overlay mobile -->
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-20 md:hidden"
          style="background:rgba(0,0,0,0.6); backdrop-filter:blur(2px);"
          @click="sidebarOpen = false"
        />
      </Transition>

      <!-- ===== SIDEBAR ===== -->
      <aside
        class="fixed md:static top-0 left-0 h-full z-30 flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0 pt-[57px] md:pt-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        style="width:220px; background:#0d1526; border-right:1px solid rgba(255,255,255,0.06);"
      >
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'home'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('home')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Início
          </button>

          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'clientes'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('clientes')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Clientes
          </button>

          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'solicitacoes'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('solicitacoes')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Solicitações
          </button>

          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'agendamentos'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('agendamentos')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Agendamentos
          </button>

          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'portfolio'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('portfolio')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Portfólio
          </button>

          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'notificacoes'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('notificacoes')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            Notificações
          </button>

          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'nfe'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('nfe')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 14l2 2 4-4M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z"/>
            </svg>
            Emissão de NF-e
          </button>

          <!-- Divisor -->
          <div class="my-2" style="border-top:1px solid rgba(255,255,255,0.05);"/>

          <!-- Ver Site -->
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'site'
              ? 'background:rgba(52,211,153,0.12); color:#6ee7b7;'
              : 'color:#64748b;'"
            @click="navigate('site')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
            </svg>
            Ver Site
          </button>

          <!-- Editor do Site -->
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            :style="activeSection === 'editor'
              ? 'background:rgba(99,102,241,0.15); color:#a5b4fc;'
              : 'color:#64748b;'"
            @click="navigate('editor')"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Editor do Site
          </button>

        </nav>
      </aside>

      <!-- ===== CONTEÚDO PRINCIPAL ===== -->
      <main class="flex-1 overflow-hidden flex flex-col">

        <!-- Home -->
        <div v-if="activeSection === 'home'" class="flex-1 overflow-y-auto px-4 py-8">
          <div class="max-w-2xl mx-auto space-y-8">

            <!-- Saudação -->
            <div class="text-center space-y-1">
              <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ greeting }}, administrador</h1>
              <p class="text-sm" style="color:#475569;">{{ adminUser?.email }}</p>
            </div>

            <!-- Ações rápidas -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:#475569;">Ações rápidas</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <!-- Ver Clientes -->
                <button
                  class="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);"
                  @click="navigate('clientes')"
                >
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
                    <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Ver Clientes</p>
                    <p class="text-xs mt-0.5" style="color:#64748b;">Lista de clientes cadastrados</p>
                  </div>
                </button>

                <!-- Ver Solicitações -->
                <button
                  class="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);"
                  @click="navigate('solicitacoes')"
                >
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
                    <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Ver Solicitações</p>
                    <p class="text-xs mt-0.5" style="color:#64748b;">Filtrar por status: pendente, aprovada, recusada</p>
                  </div>
                </button>

                <!-- Agendamentos -->
                <button
                  class="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);"
                  @click="navigate('agendamentos')"
                >
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
                    <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Agendamentos</p>
                    <p class="text-xs mt-0.5" style="color:#64748b;">Criar e gerenciar agendamentos de serviço</p>
                  </div>
                </button>

                <!-- Emissão de NF-e -->
                <button
                  class="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style="background:#0d1526; border:1px solid rgba(255,255,255,0.07);"
                  @click="navigate('nfe')"
                >
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
                    <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 14l2 2 4-4M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Emissão de NF-e</p>
                    <p class="text-xs mt-0.5" style="color:#64748b;">Módulo fiscal — em desenvolvimento</p>
                  </div>
                </button>

                <!-- Ver Site -->
                <button
                  class="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] sm:col-span-2"
                  style="background:#0d1526; border:1px solid rgba(52,211,153,0.15);"
                  @click="navigate('site')"
                >
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.2);">
                    <svg class="w-5 h-5" style="color:#34d399;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Ver Site</p>
                    <p class="text-xs mt-0.5" style="color:#64748b;">Visualize o site sem sair do painel</p>
                  </div>
                </button>

                <!-- Editor do Site -->
                <button
                  class="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] sm:col-span-2"
                  style="background:#0d1526; border:1px solid rgba(99,102,241,0.2);"
                  @click="navigate('editor')"
                >
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
                    <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Editor do Site</p>
                    <p class="text-xs mt-0.5" style="color:#64748b;">Edite textos, cores e conteúdo — Super Admin</p>
                  </div>
                </button>

                <!-- Portfólio -->
                <button
                  class="flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] sm:col-span-2"
                  style="background:#0d1526; border:1px solid rgba(99,102,241,0.15);"
                  @click="navigate('portfolio')"
                >
                  <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
                    <svg class="w-5 h-5" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 16m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-white">Portfólio</p>
                    <p class="text-xs mt-0.5" style="color:#64748b;">Publique fotos e vídeos dos trabalhos realizados</p>
                  </div>
                </button>

              </div>
            </div>

            <!-- Storage Widget -->
            <AdminStorageWidget />

          </div>
        </div>

        <!-- Clientes -->
        <div v-else-if="activeSection === 'clientes'" class="flex-1 overflow-hidden flex flex-col">
          <AdminClientes />
        </div>

        <!-- Solicitações -->
        <div v-else-if="activeSection === 'solicitacoes'" class="flex-1 overflow-hidden flex flex-col">
          <AdminSolicitacoes />
        </div>

        <!-- Agendamentos -->
        <div v-else-if="activeSection === 'agendamentos'" class="flex-1 overflow-hidden flex flex-col">
          <AdminAgendamentos />
        </div>

        <!-- Editor do Site -->
        <div v-else-if="activeSection === 'editor'" class="flex-1 overflow-hidden flex flex-col">
          <AdminSiteEditor />
        </div>

        <!-- Portfólio -->
        <div v-else-if="activeSection === 'portfolio'" class="flex-1 overflow-hidden flex flex-col">
          <AdminPortfolio />
        </div>

        <!-- Notificações -->
        <div v-else-if="activeSection === 'notificacoes'" class="flex-1 overflow-hidden flex flex-col">
          <AdminNotificacoes />
        </div>

        <!-- Ver Site -->
        <div v-else-if="activeSection === 'site'" class="flex-1 overflow-hidden flex flex-col">
          <!-- Barra de controle do iframe -->
          <div
            class="flex items-center gap-3 px-4 py-2.5 shrink-0"
            style="background:#0d1526; border-bottom:1px solid rgba(255,255,255,0.06);"
          >
            <div class="w-2 h-2 rounded-full" style="background:#34d399;"/>
            <span class="text-xs font-medium" style="color:#94a3b8;">novaalianca.com.br</span>
            <div class="flex-1"/>
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style="background:rgba(52,211,153,0.1); color:#6ee7b7; border:1px solid rgba(52,211,153,0.2);"
              @click="reloadSite"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Recarregar
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style="background:rgba(255,255,255,0.04); color:#64748b; border:1px solid rgba(255,255,255,0.07);"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Abrir em nova aba
            </a>
          </div>
          <!-- iframe do site -->
          <iframe
            :key="iframeKey"
            src="/"
            class="flex-1 w-full border-0"
            title="Preview do site"
            style="background:#fff;"
          />
        </div>

        <!-- Emissão de NF-e -->
        <div v-else-if="activeSection === 'nfe'" class="flex-1 overflow-y-auto px-4 py-8">          <div class="max-w-lg mx-auto space-y-6">

            <!-- Título -->
            <div class="text-center space-y-3">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style="background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2);">
                <svg class="w-8 h-8" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 14l2 2 4-4M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Emissão de NF-e</h2>
              <p class="text-sm" style="color:#475569;">Módulo fiscal em desenvolvimento.</p>
            </div>

            <!-- Card de requisito: Certificado A1 -->
            <div class="rounded-2xl p-5 space-y-3" style="background:#0d1526; border:1px solid rgba(245,166,35,0.25);">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(245,166,35,0.12); border:1px solid rgba(245,166,35,0.2);">
                  <svg class="w-5 h-5" style="color:#f5a623;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white">Certificado Digital A1 necessário</p>
                  <p class="text-xs mt-0.5" style="color:#64748b;">Requisito obrigatório para emissão de NF-e</p>
                </div>
              </div>
              <p class="text-sm leading-relaxed" style="color:#94a3b8;">
                Para ativar a emissão de notas fiscais eletrônicas neste sistema, é necessário fornecer o
                <span class="font-semibold text-white">Certificado Digital A1</span> da empresa (arquivo <span style="color:#f5a623;">.pfx</span> ou <span style="color:#f5a623;">.p12</span>)
                emitido por uma Autoridade Certificadora credenciada pela ICP-Brasil (ex: Serasa, Certisign, Soluti).
              </p>
              <div class="pt-1 space-y-1.5 text-xs" style="color:#64748b;">
                <div class="flex items-start gap-2">
                  <span style="color:#f5a623;" class="mt-0.5 shrink-0">•</span>
                  <span>O certificado deve estar dentro do prazo de validade</span>
                </div>
                <div class="flex items-start gap-2">
                  <span style="color:#f5a623;" class="mt-0.5 shrink-0">•</span>
                  <span>É necessário o CNPJ da empresa vinculado ao certificado</span>
                </div>
                <div class="flex items-start gap-2">
                  <span style="color:#f5a623;" class="mt-0.5 shrink-0">•</span>
                  <span>A senha do certificado será necessária para configuração</span>
                </div>
              </div>
            </div>

            <!-- Upload do certificado -->
            <AdminCertificadoA1 />

          </div>
        </div>

      </main>
    </div>

    <!-- Toast de nova solicitação -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div
          v-if="toastVisible"
          id="admin-toast"
          class="fixed bottom-6 right-4 z-50 flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl max-w-xs"
          style="background:#1e293b; border:1px solid rgba(99,102,241,0.4);"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style="background:rgba(99,102,241,0.2);">
            <svg class="w-4 h-4" style="color:#818cf8;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white">Nova solicitação recebida</p>
            <p class="text-xs mt-0.5 truncate" style="color:#94a3b8;">{{ toastTitle }}</p>
          </div>
          <button
            class="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
            style="color:#64748b;"
            @click="toastVisible = false"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

    <AdminPerfil v-if="showPerfil" @close="showPerfil = false" />
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.toast-slide-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-slide-leave-active { transition: all 0.2s ease; }
.toast-slide-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>
