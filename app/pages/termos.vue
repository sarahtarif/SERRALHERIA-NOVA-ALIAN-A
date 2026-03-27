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
          <h1 class="text-3xl md:text-4xl font-bold font-headline text-on-surface mb-3">Termos de Uso</h1>
          <p class="text-on-surface-variant text-sm">Última atualização: março de 2026</p>
        </div>

        <div class="space-y-8 text-on-surface-variant leading-relaxed text-sm md:text-base">

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">1. Aceitação dos termos</h2>
            <p>Ao acessar o site ou o portal de clientes da <strong class="text-on-surface">Serralheria Nova Aliança</strong>, você concorda com estes Termos de Uso. Caso não concorde, pedimos que não utilize nossos serviços digitais.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">2. Sobre a empresa</h2>
            <p>A Serralheria Nova Aliança é uma empresa especializada em:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>Automação de portões (basculantes, deslizantes e pivotantes)</li>
              <li>Instalação de câmeras de segurança</li>
              <li>Interfones e vídeo porteiros</li>
              <li>Fotocélulas anti-esmagamento</li>
              <li>Travas eletrônicas</li>
              <li>Manutenção preventiva de equipamentos de automação</li>
            </ul>
            <p>Atendemos residências, condomínios e comércios em toda a Grande São Paulo.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">3. Portal do cliente</h2>
            <p>O acesso ao portal de clientes é restrito a usuários cadastrados mediante convite da Nova Aliança. Ao criar sua conta, você se compromete a:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>Fornecer informações verdadeiras e atualizadas.</li>
              <li>Manter a confidencialidade de suas credenciais de acesso.</li>
              <li>Não compartilhar sua conta com terceiros.</li>
              <li>Notificar imediatamente em caso de acesso não autorizado.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">4. Solicitações de serviço</h2>
            <p>Ao enviar uma solicitação de serviço pelo portal, você entende que:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>A solicitação será analisada pela equipe técnica da Nova Aliança.</li>
              <li>O orçamento final será confirmado após visita técnica presencial.</li>
              <li>Fotos, vídeos e áudios enviados serão usados exclusivamente para diagnóstico técnico.</li>
              <li>Agendamentos podem ser reagendados com aviso prévio de pelo menos 2 horas.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">5. Garantia dos serviços</h2>
            <p>Todos os serviços prestados pela Nova Aliança possuem <strong class="text-on-surface">90 dias de garantia em mão de obra</strong>. As peças e equipamentos instalados seguem a garantia do fabricante. A garantia não cobre:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>Danos causados por mau uso ou acidentes.</li>
              <li>Interferências elétricas externas (raios, surtos de tensão sem proteção).</li>
              <li>Modificações realizadas por terceiros após a instalação.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">6. Propriedade intelectual</h2>
            <p>Todo o conteúdo deste site — textos, imagens, logotipo e identidade visual — é de propriedade exclusiva da Serralheria Nova Aliança. É proibida a reprodução, cópia ou distribuição sem autorização prévia por escrito.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">7. Limitação de responsabilidade</h2>
            <p>A Nova Aliança não se responsabiliza por:</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>Indisponibilidade temporária do portal por manutenção ou falhas técnicas.</li>
              <li>Danos indiretos decorrentes do uso ou impossibilidade de uso do portal.</li>
              <li>Informações fornecidas incorretamente pelo usuário no cadastro ou solicitações.</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">8. Alterações nos termos</h2>
            <p>Estes termos podem ser atualizados a qualquer momento. Alterações significativas serão comunicadas por e-mail ou notificação no portal. O uso continuado do serviço após as alterações implica aceitação dos novos termos.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">9. Foro e legislação</h2>
            <p>Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo — SP para dirimir quaisquer controvérsias decorrentes deste instrumento.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-lg font-bold text-on-surface">10. Contato</h2>
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
