<template>
  <v-app>
    
    <v-main class="more-page">
      <section class="hero-section">
        <v-container class="py-16 hero-container" style="position: relative; z-index: 1;">
          <v-row align="center" justify="space-between" class="mt-10 hero-row">
            <v-col cols="12" md="6" lg="6" class="text-white hero-left">
              <v-img
                src="/Rectangle.svg"
                alt="TruckFlow"
                width="250"
                class="mb-6 float-logo"
                contain
              />

              <div
                class="d-inline-flex align-center mb-5"
                style="padding: 10px 16px; border-radius: 999px; background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"
              >
                <v-icon icon="mdi-lightning-bolt-outline" size="18" color="#9bc3ff" class="mr-2"></v-icon>
                <span class="text-blue-grey-lighten-4" style="font-size: 0.9rem; font-weight: 700; letter-spacing: 0.01em;">
                  Logística inteligente para operações mais fluidas
                </span>
              </div>

              <h1 class="font-weight-black mb-5 leading-tight" style="font-size: clamp(2.8rem, 5.2vw, 4.7rem); line-height: 1.02; letter-spacing: -0.04em; max-width: 760px;">
                Organize cargas e descargas com
                <span class="text-blue-lighten-3">mais controle, fluidez e previsibilidade</span>
              </h1>

              <p
                class="font-weight-regular text-blue-grey-lighten-4 mb-8"
                style="font-size: clamp(1rem, 1.45vw, 1.18rem); line-height: 1.9; max-width: 680px;"
              >
                Filas, espera, falta de visibilidade, agendamentos confusos e comunicação
                desencontrada custam tempo, dinheiro e produtividade. O TruckFlow foi pensado
                para transformar isso em uma operação mais organizada, previsível e eficiente.
              </p>

              <div class="d-flex gap-4 flex-wrap mb-10 hero-actions-left">
                <v-btn
                  to="/register"
                  color="white"
                  size="x-large"
                  class="text-primary font-weight-bold px-8"
                  elevation="4"
                  rounded="lg"
                  style="min-width: 210px;"
                >
                  Começar Agora
                </v-btn>

                <v-btn
                  to="/home"
                  variant="outlined"
                  color="white"
                  size="x-large"
                  class="px-8"
                  rounded="lg"
                  style="min-width: 210px; border-color: rgba(255,255,255,0.28);"
                >
                  Voltar ao Início
                </v-btn>
              </div>

              <v-row>
                <v-col cols="12" sm="4" v-for="(item, i) in heroCards" :key="i">
                  <v-card
                    class="rounded-xl pa-5 h-100"
                    elevation="0"
                    style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
                  >
                    <div class="text-subtitle-1 font-weight-bold text-white mb-2">{{ item.title }}</div>
                    <p class="text-body-2 text-blue-grey-lighten-4 ma-0" style="line-height: 1.75;">{{ item.text }}</p>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="5" lg="5" class="hero-right">
              <div style="position: relative; max-width: 560px; margin: 0 auto;">

                <div class="dashboard-glow"></div>

                <v-card
                  class="rounded-xxl pa-4 pa-md-5 dashboard-card"
                  elevation="0"
                  style="background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 28px 70px rgba(7,18,34,0.30); position: relative; z-index: 2;"
                >

                  <div class="d-flex align-center justify-space-between mb-4">
                    <div>
                      <div class="text-white font-weight-bold" style="font-size:1.1rem">Dashboard Operacional</div>
                      <div class="text-blue-grey-lighten-4" style="font-size:0.8rem">Visão da operação</div>
                    </div>
                    <v-icon icon="mdi-refresh" color="#9bc3ff"></v-icon>
                  </div>

                  <div style="display:flex;flex-direction:center;align-items:center;gap:18px"> </div>

                    <div style="display:flex;flex-direction:center;align-items:center;gap:14px;margin-bottom:6px">

                      <v-icon icon="mdi-view-dashboard" color="white" size="22"></v-icon>
                      <v-icon icon="mdi-calendar-clock" color="white" size="20"></v-icon>
                      <v-icon icon="mdi-truck" color="white" size="20"></v-icon>
                      <v-icon icon="mdi-chart-box" color="white" size="20"></v-icon>
                      <v-icon icon="mdi-bell-outline" color="white" size="20"></v-icon>

                    </div>

                    <div style="width:100%"> </div>

                      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">

                        <div class="mini-stat-box">
                          <div style="display:flex;align-items:center;gap:6px">
                            <v-icon icon="mdi-calendar" size="14" color="#9bc3ff"></v-icon>
                            <span class="mini-stat-label">Agendamentos Hoje</span>
                          </div>
                          <strong class="mini-stat-value">0</strong>
                        </div>

                        <div class="mini-stat-box">
                          <div style="display:flex;align-items:center;gap:6px">
                            <v-icon icon="mdi-truck" size="14" color="#9bc3ff"></v-icon>
                            <span class="mini-stat-label">Veículos no Pátio</span>
                          </div>
                          <strong class="mini-stat-value">0</strong>
                        </div>

                        <div class="mini-stat-box">
                          <div style="display:flex;align-items:center;gap:6px">
                            <v-icon icon="mdi-check-circle" size="14" color="#9bc3ff"></v-icon>
                            <span class="mini-stat-label">Descargas Concluídas</span>
                          </div>
                          <strong class="mini-stat-value">0</strong>
                        </div>

                        <div class="mini-stat-box">
                          <div style="display:flex;align-items:center;gap:6px">
                            <v-icon icon="mdi-alert" size="14" color="#9bc3ff"></v-icon>
                            <span class="mini-stat-label">Alertas/Atrasos</span>
                          </div>
                          <strong class="mini-stat-value">0</strong>
                        </div>

                      </div>

                      <div class="dashboard-panel" style="margin-bottom:12px">

                        <div class="d-flex justify-space-between mb-2">
                          <span class="text-blue-grey-lighten-4" style="font-size:0.8rem">Status Operacional</span>
                          <v-chip size="x-small" color="green" variant="tonal">Normal</v-chip>
                        </div>

                        <div class="status-bars">
                          <div class="status-bar-fill" style="width:45%"></div>
                        </div>

                        <div class="text-blue-grey-lighten-4 mt-2" style="font-size:0.75rem">
                          Ocupação das docas
                        </div>

                      </div>

                  <div style="margin-top:14px">
                    <div class="text-blue-grey-lighten-4 mb-2" style="font-size:0.8rem;font-weight:700">Atividade Recente</div>

                    <div class="dashboard-list">

                      <div class="dashboard-row">
                        <div class="d-flex align-center" style="gap:10px">
                          <div class="dashboard-dot" style="background:#7dd3fc"></div>
                          <span class="text-white" style="font-size:0.85rem">Novo agendamento</span>
                        </div>
                        <span class="text-blue-lighten-3" style="font-size:0.75rem">08:40</span>
                      </div>

                      <div class="dashboard-row">
                        <div class="d-flex align-center" style="gap:10px">
                          <div class="dashboard-dot" style="background:#34d399"></div>
                          <span class="text-white" style="font-size:0.85rem">Descarga concluída</span>
                        </div>
                        <span class="text-blue-lighten-3" style="font-size:0.75rem">09:15</span>
                      </div>

                    </div>

                  </div>

                </v-card>

                <v-card
                  class="floating-card rounded-xl pa-4"
                  elevation="0"
                  style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);"
                >
                  <div class="text-blue-grey-lighten-4 mb-1" style="font-size:0.78rem;font-weight:700">Benefício direto</div>
                  <div class="text-white" style="font-size:1rem;font-weight:800;line-height:1.4">
                    Menos filas e mais controle da operação.
                  </div>
                </v-card>

              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="section-block bg-soft">
        <v-container>
          <v-row align="stretch" class="ga-6">
            <v-col cols="12" md="7">
              <div class="section-label mb-4">O que é o TruckFlow</div>
              <h2 class="section-title text-grey-darken-4 mb-4">
                Uma plataforma para organizar o fluxo logístico com mais inteligência
              </h2>
              <p class="section-text mb-4">
                O TruckFlow é uma solução de gestão logística criada para centralizar
                agendamentos, acompanhamento operacional, controle de motoristas,
                fornecedores e informações estratégicas em um único ambiente.
              </p>
              <p class="section-text">
                Em vez de depender de planilhas, mensagens dispersas e processos manuais,
                sua empresa passa a operar com mais padronização, previsibilidade e dados
                para tomada de decisão.
              </p>
            </v-col>

            <v-col cols="12" md="5">
              <v-card class="rounded-xxl pa-8 h-100" elevation="0" style="background: rgba(255,255,255,0.94); border: 1px solid rgba(25,95,160,0.08); box-shadow: 0 18px 45px rgba(13,60,104,0.08);">
                <h3 class="text-h5 font-weight-bold text-grey-darken-4 mb-4">
                  Com o TruckFlow, sua operação pode:
                </h3>

                <div class="d-flex flex-column ga-4">
                  <div v-for="(item, i) in operationBenefits" :key="i" class="d-flex align-start ga-3">
                    <v-avatar size="34" color="blue-lighten-5">
                      <v-icon icon="mdi-check" color="#195FA0" size="20"></v-icon>
                    </v-avatar>
                    <div class="text-body-1 text-grey-darken-2" style="line-height: 1.7;">{{ item }}</div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="section-block bg-white">
        <v-container>
          <div class="text-center mb-10">
            <div class="section-label mx-auto mb-4">Problemas que ele resolve</div>
            <h2 class="section-title text-grey-darken-4 mb-4">
              Você reconhece algum destes cenários na sua operação?
            </h2>
            <p class="section-text section-text-center mx-auto">
              Empresas perdem eficiência todos os dias em falhas que parecem pequenas,
              mas se repetem constantemente e acabam custando caro.
            </p>
          </div>

          <v-row>
            <v-col cols="12" sm="6" lg="4" v-for="(item, i) in problems" :key="i">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 10 : 1"
                  class="rounded-xl pa-6 transition-swing h-100"
                  style="background: #ffffff; border: 1px solid rgba(25,95,160,0.08); box-shadow: 0 14px 38px rgba(13,60,104,0.06);"
                >
                  <v-avatar size="52" :color="item.color" variant="tonal" class="mb-4 rounded-lg">
                    <v-icon :icon="item.icon" size="28"></v-icon>
                  </v-avatar>
                  <h3 class="text-h6 font-weight-bold text-grey-darken-4 mb-2">{{ item.title }}</h3>
                  <p class="text-body-1 text-grey-darken-1 ma-0" style="line-height: 1.8;">{{ item.text }}</p>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="section-block bg-gradient-secondary text-white">
        <v-container>
          <div class="text-center mb-10">
            <div class="section-label-dark mx-auto mb-4">Como funciona</div>
            <h2 class="section-title text-white mb-4">
              Uma jornada simples para organizar a operação
            </h2>
          </div>

          <v-row>
            <v-col cols="12" sm="6" lg="3" v-for="(step, i) in steps" :key="i">
              <v-card
                class="rounded-xl pa-6 h-100"
                elevation="0"
                style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.10); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
              >
                <div class="step-number mb-4">0{{ i + 1 }}</div>
                <h3 class="text-h6 font-weight-bold text-white mb-3">{{ step.title }}</h3>
                <p class="text-body-1 text-blue-grey-lighten-4 ma-0" style="line-height: 1.8;">{{ step.text }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="section-block bg-soft">
        <v-container>
          <div class="mb-10">
            <div class="section-label mb-4">Funcionalidades principais</div>
            <h2 class="section-title text-grey-darken-4 mb-4">
              Recursos pensados para uma operação mais fluida
            </h2>
          </div>

          <v-row>
            <v-col cols="12" sm="6" lg="4" v-for="(feature, i) in mainFeatures" :key="i">
              <v-card
                class="rounded-xl pa-6 h-100"
                elevation="0"
                style="background: rgba(255,255,255,0.94); border: 1px solid rgba(25,95,160,0.08); box-shadow: 0 18px 45px rgba(13,60,104,0.08);"
              >
                <v-avatar size="54" :color="feature.color" variant="tonal" class="mb-4 rounded-lg">
                  <v-icon :icon="feature.icon" size="28"></v-icon>
                </v-avatar>
                <h3 class="text-h6 font-weight-bold text-grey-darken-4 mb-2">{{ feature.title }}</h3>
                <p class="text-body-1 text-grey-darken-1 ma-0" style="line-height: 1.8;">{{ feature.text }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="section-block bg-white">
        <v-container>
          <v-row align="stretch" class="ga-6">
            <v-col cols="12" md="7">
              <v-card class="rounded-xxl pa-8 h-100" elevation="0" style="background: rgba(255,255,255,0.94); border: 1px solid rgba(25,95,160,0.08); box-shadow: 0 18px 45px rgba(13,60,104,0.08);">
                <div class="section-label mb-4">Benefícios reais</div>
                <h2 class="section-title text-grey-darken-4 mb-6">
                  Mais organização, menos desperdício operacional
                </h2>

                <v-row>
                  <v-col cols="12" sm="6" v-for="(item, i) in benefits" :key="i">
                    <div style="display: flex; align-items: center; padding: 14px 16px; border-radius: 16px; background: #f4f8ff; border: 1px solid #dce9ff; font-weight: 600; color: #22364a;">
                      <v-icon icon="mdi-check-circle" color="#195FA0" size="20" class="mr-2"></v-icon>
                      <span>{{ item }}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" md="5">
              <v-card
                class="rounded-xxl pa-8 h-100"
                elevation="0"
                style="background: linear-gradient(135deg, #12335b 0%, #24518a 100%); box-shadow: 0 20px 48px rgba(18,51,91,0.2);"
              >
                <div class="section-label-dark mb-4">Curiosidade estratégica</div>
                <h3 class="text-h5 font-weight-bold text-white mb-4">
                  Um caminhão parado pode representar um custo invisível muito maior do que parece.
                </h3>
                <p class="text-body-1 text-blue-grey-lighten-4 mb-0" style="line-height: 1.8;">
                  Quando atrasos e filas se repetem todos os dias, a empresa perde tempo,
                  capacidade, previsibilidade e eficiência. O TruckFlow ajuda a enxergar e
                  reduzir esse desperdício antes que ele vire rotina.
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="section-block bg-soft">
        <v-container>
          <v-row align="stretch" class="ga-6">
            <v-col cols="12" md="6">
              <div class="section-label mb-4">Para quem é</div>
              <h2 class="section-title text-grey-darken-4 mb-4">
                Uma solução adaptável para diferentes operações logísticas
              </h2>
              <p class="section-text mb-0">
                O TruckFlow pode atender empresas que precisam organizar fluxo de veículos,
                horários, docas, fornecedores e operações com mais controle.
              </p>
            </v-col>

            <v-col cols="12" md="6">
              <div style="display: flex; flex-wrap: wrap; gap: 14px;">
                <div
                  v-for="(item, i) in audiences"
                  :key="i"
                  style="padding: 14px 18px; border-radius: 999px; background: #ffffff; border: 1px solid rgba(25,95,160,0.1); box-shadow: 0 10px 30px rgba(13,60,104,0.05); color: #163459; font-weight: 700;"
                >
                  {{ item }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section class="section-block bg-white">
        <v-container>
          <v-row align="stretch" class="ga-6">
            <v-col cols="12" md="6">
              <div class="section-label mb-4">Tecnologia e segurança</div>
              <h2 class="section-title text-grey-darken-4 mb-4">
                Estrutura moderna para apoiar a operação com confiabilidade
              </h2>
              <p class="section-text mb-0">
                O TruckFlow foi pensado para entregar uma experiência clara, organizada e segura,
                com acesso controlado, centralização de dados e base tecnológica preparada para
                crescer com a operação.
              </p>
            </v-col>

            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12" sm="6" v-for="(item, i) in securityItems" :key="i">
                  <v-card
                    class="rounded-xl pa-5 h-100"
                    elevation="1"
                    style="background: #ffffff; border: 1px solid rgba(25,95,160,0.08); box-shadow: 0 14px 38px rgba(13,60,104,0.06);"
                  >
                    <div class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-2">{{ item.title }}</div>
                    <p class="text-body-2 text-grey-darken-1 ma-0" style="line-height: 1.8;">{{ item.text }}</p>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-main>

    <v-footer color="#0D3C68" class="text-center d-flex flex-column py-8 text-caption text-grey-lighten-1">
      <div class="d-flex gap-4 mb-4">
        <v-btn icon="mdi-linkedin" variant="text" color="white" density="comfortable"></v-btn>
        <v-btn icon="mdi-instagram" variant="text" color="white" density="comfortable"></v-btn>
        <v-btn icon="mdi-email" variant="text" color="white" density="comfortable"></v-btn>
      </div>
      <div>
        &copy; 2026 TruckFlow &bull; Política de Privacidade &bull; Termos de Uso
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const heroCards = ref([
  {
    title: '+ controle',
    text: 'Mais clareza sobre agendamentos, fluxo operacional e ocupação da operação.'
  },
  {
    title: '+ visibilidade',
    text: 'Equipe, portaria e gestão acompanham o que acontece com muito mais precisão.'
  },
  {
    title: '- gargalos',
    text: 'Menos fila, menos espera e mais fluidez na rotina de carga e descarga.'
  }
]);

const operationBenefits = ref([
  'Organizar carga e descarga sem conflitos de horário',
  'Acompanhar motoristas e operações com mais clareza',
  'Centralizar fornecedores e transportadoras',
  'Reduzir tempo de espera e falhas de comunicação',
  'Gerar relatórios úteis para gestão'
]);

const problems = ref([
  {
    icon: 'mdi-truck-alert-outline',
    color: 'red-lighten-5',
    title: 'Caminhões chegando ao mesmo tempo',
    text: 'Filas, sobrecarga operacional e uso desorganizado das docas.'
  },
  {
    icon: 'mdi-timer-sand',
    color: 'deep-orange-lighten-5',
    title: 'Motoristas esperando demais',
    text: 'Tempo parado, insatisfação e perda de produtividade logística.'
  },
  {
    icon: 'mdi-file-document-outline',
    color: 'blue-lighten-5',
    title: 'Controle em planilhas ou papel',
    text: 'Informações dispersas, risco de erro e baixa rastreabilidade.'
  },
  {
    icon: 'mdi-eye-off-outline',
    color: 'indigo-lighten-5',
    title: 'Falta de visibilidade da operação',
    text: 'Dificuldade para saber quem está chegando, carregando ou descarregando.'
  },
  {
    icon: 'mdi-message-alert-outline',
    color: 'amber-lighten-5',
    title: 'Comunicação desencontrada',
    text: 'Portaria, logística e fornecedores sem fluxo claro de informação.'
  },
  {
    icon: 'mdi-chart-line-variant',
    color: 'teal-lighten-5',
    title: 'Ausência de histórico e indicadores',
    text: 'Sem dados confiáveis, fica difícil corrigir gargalos e melhorar processos.'
  }
]);

const steps = ref([
  {
    title: 'Agendamento',
    text: 'Organize horários de carga e descarga com muito mais previsibilidade.'
  },
  {
    title: 'Controle do fluxo',
    text: 'Visualize ocupação, filas, prioridades e andamento das operações.'
  },
  {
    title: 'Monitoramento',
    text: 'Acompanhe motoristas, fornecedores e status operacionais em tempo real.'
  },
  {
    title: 'Relatórios',
    text: 'Transforme a rotina operacional em informações estratégicas para gestão.'
  }
]);

const mainFeatures = ref([
  {
    icon: 'mdi-calendar-clock',
    color: 'light-blue-accent-2',
    title: 'Gestão de agendamentos',
    text: 'Evite conflitos de horário e distribua melhor a operação.'
  },
  {
    icon: 'mdi-account-switch-outline',
    color: 'teal-accent-2',
    title: 'Controle de motoristas',
    text: 'Registre e acompanhe informações de entrada, saída e movimentação.'
  },
  {
    icon: 'mdi-domain',
    color: 'indigo-accent-2',
    title: 'Gestão de fornecedores',
    text: 'Mantenha tudo centralizado, padronizado e de fácil consulta.'
  },
  {
    icon: 'mdi-chart-box-outline',
    color: 'amber-accent-2',
    title: 'Relatórios inteligentes',
    text: 'Descubra horários críticos, gargalos e oportunidades de melhoria.'
  },
  {
    icon: 'mdi-bell-outline',
    color: 'deep-purple-accent-2',
    title: 'Notificações operacionais',
    text: 'Melhore a comunicação entre administração e operação.'
  },
  {
    icon: 'mdi-view-dashboard-outline',
    color: 'cyan-accent-2',
    title: 'Visão centralizada',
    text: 'Tenha em um único painel o que antes ficava espalhado em vários canais.'
  }
]);

const benefits = ref([
  'Redução de filas e atrasos',
  'Menor tempo de espera',
  'Melhor comunicação entre setores',
  'Mais produtividade logística',
  'Melhor rastreabilidade da operação',
  'Decisões baseadas em dados'
]);

const audiences = ref([
  'Centros de distribuição',
  'Indústrias',
  'Transportadoras',
  'Armazéns logísticos',
  'Cooperativas',
  'Operações de carga e descarga'
]);

const securityItems = ref([
  {
    title: 'Acesso controlado',
    text: 'Mais segurança por perfil de usuário e organização do uso do sistema.'
  },
  {
    title: 'Dados centralizados',
    text: 'Informações importantes reunidas em um só lugar e de fácil consulta.'
  },
  {
    title: 'Operação mais estável',
    text: 'Menos dependência de controles manuais e comunicação dispersa.'
  },
  {
    title: 'Base escalável',
    text: 'Estrutura preparada para evoluir conforme novas demandas surgem.'
  }
]);

const dashboardRows = ref([
  {
    title: 'Carga confirmada',
    subtitle: 'Doca 03 • Transportadora Alfa',
    time: '08:40',
    dot: '#7dd3fc'
  },
  {
    title: 'Motorista aguardando liberação',
    subtitle: 'Pátio • Entrada principal',
    time: '09:10',
    dot: '#fbbf24'
  },
  {
    title: 'Descarga finalizada',
    subtitle: 'Doca 07 • Fornecedor Beta',
    time: '09:35',
    dot: '#34d399'
  }
]);
</script>

<style scoped>
.more-page {
  background: #f5f8fc;
}

.hero-section {
  background: linear-gradient(135deg, #091524 0%, #102843 38%, #18416d 72%, #1f5f99 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(102, 170, 255, 0.12), transparent 22%),
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.05), transparent 18%),
    radial-gradient(circle at bottom left, rgba(90, 155, 230, 0.14), transparent 26%);
  pointer-events: none;
}

.hero-section::after {
  content: '';
  position: absolute;
  inset: auto auto -120px -120px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(63, 130, 210, 0.18) 0%, rgba(63, 130, 210, 0.06) 45%, transparent 72%);
  filter: blur(28px);
  pointer-events: none;
}

.hero-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-row {
  width: 100%;
}

.hero-left,
.hero-right {
  position: relative;
  z-index: 1;
}

.dashboard-glow {
  position: absolute;
  inset: 8% 2% auto;
  height: 78%;
  background: radial-gradient(circle, rgba(127, 197, 255, 0.22) 0%, rgba(127, 197, 255, 0.08) 42%, transparent 72%);
  filter: blur(30px);
  z-index: 1;
}

.dashboard-panel {
  padding: 18px;
  border-radius: 22px;
  background: rgba(8, 20, 34, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mini-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mini-stat-box {
  padding: 14px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.mini-stat-label {
  display: block;
  color: #c8d8ec;
  font-size: 0.75rem;
  margin-bottom: 6px;
}

.mini-stat-value {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 800;
}

.status-bars {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}

.status-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #7dd3fc 0%, #93c5fd 52%, #bfdbfe 100%);
}

.dashboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dashboard-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.06);
}

.dashboard-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 12px currentColor;
}

.floating-card {
  position: absolute;
  right: -16px;
  bottom: 26px;
  max-width: 220px;
  z-index: 3;
  animation: floatCard 4.8s ease-in-out infinite;
  box-shadow: 0 18px 40px rgba(0,0,0,0.22);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #102843 0%, #1d4879 100%);
}

.bg-soft {
  background: linear-gradient(180deg, #f4f8ff 0%, #eef4fb 100%);
}

.bg-white {
  background: #ffffff;
}

.section-block {
  padding: 88px 0;
}

.leading-tight {
  line-height: 1.08;
}

.section-label,
.section-label-dark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.section-label {
  background: rgba(25, 95, 160, 0.09);
  color: #195FA0;
}

.section-label-dark {
  background: rgba(255, 255, 255, 0.12);
  color: #dce9ff;
}

.section-title {
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1.15;
  font-weight: 900;
}

.section-text {
  font-size: 1.05rem;
  line-height: 1.9;
  color: #43556b;
}

.section-text-center {
  max-width: 760px;
}

.step-number {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #9bc3ff;
  font-size: 0.88rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.rounded-xxl {
  border-radius: 28px !important;
}

.float-logo {
  animation: floatLogo 4.6s ease-in-out infinite;
  filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.22));
}

@keyframes floatLogo {
  0% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.015);
  }
  100% {
    transform: translateY(0px) scale(1);
  }
}

@keyframes floatCard {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-7px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 1264px) {
  .floating-card {
    right: 0;
    bottom: 18px;
  }
}

@media (max-width: 960px) {
  .section-block {
    padding: 72px 0;
  }

  .hero-container {
    min-height: auto;
    padding-top: 72px;
    padding-bottom: 72px;
  }

  .hero-left {
    text-align: center;
  }

  .hero-actions-left {
    justify-content: center;
  }

  .hero-left .v-img {
    margin-left: auto;
    margin-right: auto;
  }

  .floating-card {
    position: relative;
    right: auto;
    bottom: auto;
    margin: 16px auto 0;
    max-width: 100%;
  }

  .mini-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
