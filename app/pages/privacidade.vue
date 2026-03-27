<script setup lang="ts">
import NavTop from '~/components/NavTop.vue'
import NavDesktop from '~/components/NavDesktop.vue'
import NavBottom from '~/components/NavBottom.vue'
import PageFooter from '~/components/PageFooter.vue'
import FooterDesktop from '~/components/FooterDesktop.vue'
import WhatsAppFab from '~/components/WhatsAppFab.vue'
</script>

<template>
  <div class="bg-surface text-on-surface font-body antialiased min-h-screen">
    <div class="lg:hidden"><NavTop /></div>
    <div class="hidden lg:block"><NavDesktop /></div>

    <main class="pt-20 pb-16 px-4">
      <div class="max-w-3xl mx-auto space-y-10">

        <!-- Header -->
        <div class="text-center pt-8 pb-4">
          <h1 class="text-3xl md:text-4xl font-bold font-headline text-on-surface mb-3">Política de Privacidade</h1>
          <p class="text-on-surface-variant text-sm">Última atualização: março de 2026</p>
        </div>

        <div class="space-y-8 text-on-surface-variant leading-relaxed text-sm md:text-base">

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">1. Quem somos</h2>
            <p>A <strong class="text-on-surface">Serralheria Nova Aliança</strong> é uma empresa especializada em automação de portões, câmeras de segurança, interfones, fotocélulas, travas eletrônicas e manutenção preventiva, com sede em São Paulo — SP. Este documento descreve como coletamos, usamos e protegemos seus dados pessoais ao utilizar nosso site e portal de clientes.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">2. Dados que coletamos</h2>
            <p>Coletamos apenas os dados necessários para prestar nossos serviços:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li><strong class="text-on-surface">Dados de cadastro:</strong> nome completo, e-mail, telefone e endereço, fornecidos ao criar sua conta ou solicitar um serviço.</li>
              <li><strong class="text-on-surface">Dados de uso:</strong> informações sobre agendamentos, solicitações de serviço e histórico de atendimentos.</li>
              <li><strong class="text-on-surface">Dados de acesso:</strong> endereço IP, tipo de dispositivo, navegador e horário de acesso ao painel administrativo, para fins de segurança.</li>
              <li><strong class="text-on-surface">Mídias:</strong> fotos, vídeos e áudios enviados em solicitações de serviço, armazenados de forma segura.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">3. Como usamos seus dados</h2>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>Gerenciar agendamentos e solicitações de serviço.</li>
              <li>Enviar lembretes e notificações sobre seus atendimentos.</li>
              <li>Entrar em contato via e-mail ou WhatsApp para confirmar visitas técnicas.</li>
              <li>Emitir notas fiscais e documentos relacionados ao serviço prestado.</li>
              <li>Garantir a segurança do sistema e prevenir acessos não autorizados.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">4. Compartilhamento de dados</h2>
            <p>Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais. Seus dados podem ser compartilhados apenas com:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li><strong class="text-on-surface">Técnicos da Nova Aliança</strong> responsáveis pelo atendimento agendado.</li>
              <li><strong class="text-on-surface">Supabase</strong> (infraestrutura de banco de dados e autenticação), com sede nos EUA, em conformidade com a LGPD.</li>
              <li><strong class="text-on-surface">Autoridades competentes</strong>, quando exigido por lei.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">5. Armazenamento e segurança</h2>
            <p>Seus dados são armazenados em servidores seguros com criptografia em trânsito (HTTPS) e em repouso. O acesso ao painel administrativo é protegido por autenticação e monitoramento de sessões. Mantemos registros de acesso para fins de auditoria e segurança.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">6. Seus direitos (LGPD)</h2>
            <p>Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Acessar, corrigir ou atualizar seus dados pessoais.</li>
              <li>Solicitar a exclusão dos seus dados, quando aplicável.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
              <li>Solicitar a portabilidade dos seus dados.</li>
            </ul>
            <p>Para exercer seus direitos, entre em contato pelo WhatsApp <strong class="text-on-surface">(11) 98711-5613</strong> ou pelo e-mail <strong class="text-on-surface">marcelababreu01@gmail.com</strong>.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">7. Cookies</h2>
            <p>Nosso site utiliza cookies técnicos essenciais para o funcionamento da autenticação e da sessão do usuário. Não utilizamos cookies de rastreamento ou publicidade.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">8. Contato</h2>
            <p>Em caso de dúvidas sobre esta política, entre em contato:</p>
            <ul class="list-none space-y-1 pl-2">
              <li>📍 São Paulo — SP</li>
              <li>📞 (11) 98711-5613</li>
              <li>✉️ marcelababreu01@gmail.com</li>
            </ul>
          </section>

        </div>

        <div class="pt-4 border-t border-outline-variant/20">
          <NuxtLink to="/" class="text-primary text-sm hover:underline">← Voltar ao início</NuxtLink>
        </div>

      </div>
    </main>

    <div class="lg:hidden"><PageFooter /></div>
    <div class="hidden lg:block"><FooterDesktop /></div>
    <div class="lg:hidden"><NavBottom /></div>
    <WhatsAppFab />
  </div>
</template>
