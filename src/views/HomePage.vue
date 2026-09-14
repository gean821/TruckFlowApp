<template>
  <v-app>
    <v-app-bar
      :elevation="0"
      class="px-4 px-md-8"
      style="
        height: 64px !important;
        position: fixed !important;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: rgba(9, 24, 44, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(255,255,255,0.08);
      "
    >
      <div class="d-flex align-center" style="gap: 12px;">
        <v-img
          src="/Rectangle.svg"
          alt="TruckFlow"
          width="115"
          height="115"
          contain
        />
        <span
          style="
            font-size: 22px;
            font-weight: 700;
            color: white;
            line-height: 1;
          "
        >
          TruckFlow
        </span>
      </div>

      <v-spacer />

      <div class="d-none d-md-flex align-center" style="gap: 10px;">
        <v-btn
          to="/more"
          variant="text"
          class="text-capitalize premium-btn"
          style="
            color: white;
            font-weight: 700;
          "
        >
          Funcionalidades
        </v-btn>

        <v-btn
          to="/contact"
          variant="text"
          class="text-capitalize premium-btn"
          style="
            color: white;
            font-weight: 700;
          "
        >
          Contate-nos
        </v-btn>

        <v-btn
          to="/login"
          rounded="pill"
          class="text-capitalize premium-btn"
          style="
            background: linear-gradient(90deg, #2f7ff5 0%, #5aa6ff 100%);
            color: white;
            font-weight: 800;
            padding-inline: 24px;
            min-height: 44px;
            box-shadow: 0 5px 5px rgba(47,127,245,0.24);
          "
        >
          Login
        </v-btn>
      </div>

      <v-app-bar-nav-icon class="d-md-none text-white" />
    </v-app-bar>

    <v-main
      style="
        background:
          radial-gradient(circle at 15% 20%, rgba(110,167,255,0.18), transparent 18%),
          radial-gradient(circle at 85% 15%, rgba(76,140,235,0.18), transparent 18%),
          radial-gradient(circle at 50% 100%, rgba(90,166,255,0.12), transparent 24%),
          linear-gradient(135deg, #08182c 0%, #0f2e57 38%, #1f4f82 72%, #2e6cb5 100%);
        min-height: 100vh;
        overflow: hidden;
        position: relative;
      "
    >
      <div
        :style="{
          position: 'absolute',
          inset: '0',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
          pointerEvents: 'none',
          transform: `translateY(${parallaxGrid}px)`
        }"
      ></div>

      <div
        :style="{
          position: 'absolute',
          top: '120px',
          left: '-80px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,167,255,0.16) 0%, transparent 70%)',
          filter: 'blur(32px)',
          pointerEvents: 'none',
          transform: `translateY(${parallaxGlow1}px)`
        }"
      ></div>

      <div
        :style="{
          position: 'absolute',
          right: '-80px',
          top: '160px',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76,140,235,0.16) 0%, transparent 70%)',
          filter: 'blur(36px)',
          pointerEvents: 'none',
          transform: `translateY(${parallaxGlow2}px)`
        }"
      ></div>

      <v-container
        style="
          position: relative;
          z-index: 2;
          padding-top: 60px;
          padding-bottom: 90px;
        "
      >
        <v-row justify="center">
          <v-col cols="12" lg="10" xl="9" class="text-center text-white">
            <h1
              class="reveal reveal-delay-2"
              style="
                font-size: clamp(3rem, 6vw, 6rem);
                font-weight: 900;
                line-height: 0.95;
                letter-spacing: -0.06em;
                max-width: 980px;
                margin: 0 auto 24px;
                color: white;
                text-shadow: 0 10px 30px rgba(0,0,0,0.16);
              "
            >
              Controle total da
              <span style="display:block; color:#dff0ff;">
                sua operação logística
              </span>
            </h1>

            <p
              class="reveal reveal-delay-3"
              style="
                max-width: 780px;
                margin: 0 auto 38px;
                font-size: 1.14rem;
                line-height: 1.9;
                color: #dbe9f8;
              "
            >
              O TruckFlow centraliza agendamentos de docas, organiza o fluxo do pátio
              e melhora a visibilidade operacional para equipes que precisam de ritmo,
              previsibilidade e menos gargalos no dia a dia.
            </p>

            <div
              class="d-flex flex-wrap justify-center mb-12 reveal reveal-delay-4"
              style="gap: 14px;"
            >
              <v-btn
                to="/more"
                rounded="lg"
                size="x-large"
                elevation="0"
                class="premium-btn"
                style="
                  min-width: 220px;
                  min-height: 56px;
                  background: linear-gradient(90deg, #2f7ff5 0%, #5aa6ff 100%);
                  color: white;
                  font-weight: 800;
                  box-shadow: 0 14px 30px rgba(47,127,245,0.24);
                "
              >
                Clique para saber mais
                <v-icon end icon="mdi-arrow-right" size="18" />
              </v-btn>
            </div>

            <v-row class="ga-3 ga-md-0">
              <v-col cols="12" md="4">
                <div
                  class="reveal reveal-delay-1 premium-card"
                  style="
                    height: 100%;
                    padding: 24px;
                    border-radius: 24px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.10);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    box-shadow: 0 14px 30px rgba(0,0,0,0.08);
                    text-align: left;
                  "
                >
                  <div class="d-flex align-center mb-4" style="gap: 12px;">
                    <v-avatar size="48" color="rgba(90,166,255,0.16)">
                      <v-icon icon="mdi-calendar-clock" color="#cfe5ff" />
                    </v-avatar>
                    <div style="font-size: 1.08rem; font-weight: 800; color: white;">
                      Agendamento inteligente
                    </div>
                  </div>

                  <p
                    style="
                      margin: 0;
                      font-size: 0.98rem;
                      line-height: 1.8;
                      color: #d9e8f8;
                    "
                  >
                    Distribua horários com mais previsibilidade e evite conflitos
                    de janela entre transportadoras e operação.
                  </p>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div
                  class="reveal reveal-delay-2 premium-card"
                  style="
                    height: 100%;
                    padding: 24px;
                    border-radius: 24px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.10);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    box-shadow: 0 14px 30px rgba(0,0,0,0.08);
                    text-align: left;
                  "
                >
                  <div class="d-flex align-center mb-4" style="gap: 12px;">
                    <v-avatar size="48" color="rgba(90,166,255,0.16)">
                      <v-icon icon="mdi-truck-fast-outline" color="#cfe5ff" />
                    </v-avatar>
                    <div style="font-size: 1.08rem; font-weight: 800; color: white;">
                      Fluxo de pátio organizado
                    </div>
                  </div>

                  <p
                    style="
                      margin: 0;
                      font-size: 0.98rem;
                      line-height: 1.8;
                      color: #d9e8f8;
                    "
                  >
                    Dê mais clareza ao pátio, reduza fila e mantenha a movimentação
                    mais fluida do início ao fim da operação.
                  </p>
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <div
                  class="reveal reveal-delay-3 premium-card"
                  style="
                    height: 100%;
                    padding: 24px;
                    border-radius: 24px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.10);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    box-shadow: 0 14px 30px rgba(0,0,0,0.08);
                    text-align: left;
                  "
                >
                  <div class="d-flex align-center mb-4" style="gap: 12px;">
                    <v-avatar size="48" color="rgba(90,166,255,0.16)">
                      <v-icon icon="mdi-chart-line" color="#cfe5ff" />
                    </v-avatar>
                    <div style="font-size: 1.08rem; font-weight: 800; color: white;">
                      Mais previsibilidade
                    </div>
                  </div>

                  <p
                    style="
                      margin: 0;
                      font-size: 0.98rem;
                      line-height: 1.8;
                      color: #d9e8f8;
                    "
                  >
                    Transforme operação em informação útil para tomar decisões
                    melhores e evoluir o desempenho da logística.
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <section
        class="reveal-section"
        style="
          background: linear-gradient(180deg, #f4f8ff 0%, #edf5ff 100%);
          color: #183a63;
          padding: 110px 20px;
        "
      >
        <v-container>
          <div class="reveal" style="max-width: 760px; margin: 0 auto 60px; text-align: center;">
            <div
              style="
                display: inline-block;
                margin-bottom: 14px;
                font-size: 0.8rem;
                font-weight: 800;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #2e6cb5;
              "
            >
              Funcionalidades
            </div>

            <h2
              style="
                font-size: clamp(2.3rem, 4vw, 3.5rem);
                font-weight: 900;
                letter-spacing: -0.05em;
                line-height: 1.08;
                margin-bottom: 16px;
              "
            >
              Organize sua logística<br />
              <span style="color:#2e6cb5;">sem complexidade</span>
            </h2>

            <p
              style="
                margin: 0;
                font-size: 1.04rem;
                line-height: 1.85;
                color: #5a6d85;
              "
            >
              O TruckFlow conecta operação, docas e pátio em um fluxo mais claro,
              reduzindo conflitos, espera e retrabalho.
            </p>
          </div>

          <v-row class="ga-3 ga-md-0">
            <v-col cols="12" md="4">
              <div
                class="reveal premium-card"
                style="
                  background: white;
                  border-radius: 24px;
                  padding: 34px;
                  box-shadow: 0 12px 30px rgba(19,68,125,0.06);
                  border: 1px solid rgba(31,79,130,0.06);
                  height: 100%;
                "
              >
                <div
                  style="
                    width: 58px;
                    height: 58px;
                    border-radius: 16px;
                    background: rgba(76,140,235,0.10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 18px;
                  "
                >
                  <v-icon size="30" color="#2E6CB5">mdi-calendar-clock</v-icon>
                </div>

                <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 12px;">
                  Agendamento Inteligente
                </h3>

                <p style="margin:0; line-height:1.8; color:#5a6d85;">
                  Fornecedores e transportadoras reservam horários diretamente
                  no sistema, evitando conflito de janela e sobrecarga nas docas.
                </p>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div
                class="reveal reveal-delay-1 premium-card"
                style="
                  background: white;
                  border-radius: 24px;
                  padding: 34px;
                  box-shadow: 0 12px 30px rgba(19,68,125,0.06);
                  border: 1px solid rgba(31,79,130,0.06);
                  height: 100%;
                "
              >
                <div
                  style="
                    width: 58px;
                    height: 58px;
                    border-radius: 16px;
                    background: rgba(76,140,235,0.10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 18px;
                  "
                >
                  <v-icon size="30" color="#2E6CB5">mdi-truck-fast-outline</v-icon>
                </div>

                <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 12px;">
                  Controle de Pátio
                </h3>

                <p style="margin:0; line-height:1.8; color:#5a6d85;">
                  Acompanhe o fluxo de veículos e mantenha a operação mais organizada,
                  com menos filas e mais clareza na movimentação diária.
                </p>
              </div>
            </v-col>

            <v-col cols="12" md="4">
              <div
                class="reveal reveal-delay-2 premium-card"
                style="
                  background: white;
                  border-radius: 24px;
                  padding: 34px;
                  box-shadow: 0 12px 30px rgba(19,68,125,0.06);
                  border: 1px solid rgba(31,79,130,0.06);
                  height: 100%;
                "
              >
                <div
                  style="
                    width: 58px;
                    height: 58px;
                    border-radius: 16px;
                    background: rgba(76,140,235,0.10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 18px;
                  "
                >
                  <v-icon size="30" color="#2E6CB5">mdi-chart-line</v-icon>
                </div>

                <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 12px;">
                  Análise de Dados
                </h3>

                <p style="margin:0; line-height:1.8; color:#5a6d85;">
                  Transforme dados operacionais em indicadores que ajudam a identificar
                  gargalos e melhorar o ritmo da sua logística.
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section
        class="reveal-section"
        style="
          background: white;
          color: #183a63;
          padding: 110px 20px;
        "
      >
        <v-container>
          <div class="reveal" style="max-width: 760px; margin: 0 auto 60px; text-align: center;">
            <div
              style="
                display: inline-block;
                margin-bottom: 14px;
                font-size: 0.8rem;
                font-weight: 800;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #2e6cb5;
              "
            >
              Como funciona
            </div>

            <h2
              style="
                font-size: clamp(2.3rem, 4vw, 3.5rem);
                font-weight: 900;
                letter-spacing: -0.05em;
                line-height: 1.08;
                margin-bottom: 16px;
              "
            >
              Um fluxo simples.<br />
              <span style="color:#2e6cb5;">Um ganho real.</span>
            </h2>

            <p
              style="
                margin: 0;
                font-size: 1.04rem;
                line-height: 1.85;
                color: #5a6d85;
              "
            >
              Cada etapa da operação é organizada para reduzir ruído, fila e perda de tempo.
            </p>
          </div>

          <v-row class="ga-3 ga-md-0">
            <v-col
              cols="12"
              md="3"
              v-for="(step, index) in steps"
              :key="step.title"
            >
              <div
                class="reveal premium-card"
                :style="{ transitionDelay: `${index * 120}ms` }"
                style="
                  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
                  border: 1px solid rgba(31,79,130,0.06);
                  box-shadow: 0 10px 26px rgba(19,68,125,0.05);
                  border-radius: 24px;
                  padding: 28px 22px;
                  height: 100%;
                "
              >
                <div
                  style="
                    display: inline-block;
                    background: rgba(76,140,235,0.10);
                    color: #2e6cb5;
                    font-size: 11px;
                    font-weight: 800;
                    padding: 6px 10px;
                    border-radius: 999px;
                    margin-bottom: 16px;
                  "
                >
                  0{{ index + 1 }}
                </div>

                <div
                  style="
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    background: rgba(76,140,235,0.10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                  "
                >
                  <v-icon :icon="step.icon" size="28" color="#2E6CB5" />
                </div>

                <h3 style="font-size: 1.12rem; font-weight: 800; margin-bottom: 10px;">
                  {{ step.title }}
                </h3>

                <p style="margin:0; line-height:1.75; color:#5a6d85;">
                  {{ step.text }}
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <section
        class="reveal"
        style="
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1f4f82, #4c8ceb);
          padding: 110px 20px;
          text-align: center;
        "
      >
        <div
          style="
            position: absolute;
            width: 520px;
            height: 320px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
          "
        ></div>

        <v-container style="position: relative; z-index: 2;">
          <div style="max-width: 760px; margin: auto;">
            <h2
              style="
                font-size: clamp(2.3rem, 4vw, 3.3rem);
                font-weight: 900;
                line-height: 1.08;
                letter-spacing: -0.05em;
                margin-bottom: 16px;
                color: white;
              "
            >
              Pronto para transformar<br />
              sua logística?
            </h2>

            <p
              style="
                color: #e7f1ff;
                margin-bottom: 34px;
                font-size: 1.04rem;
                line-height: 1.8;
              "
            >
              Comece agora e veja como o TruckFlow
              pode organizar sua operação com mais clareza.
            </p>

            <div class="d-flex flex-wrap justify-center" style="gap: 14px;">
              <v-btn
                to="/contact"
                rounded="lg"
                size="x-large"
                elevation="0"
                class="premium-btn"
                style="
                  background: white;
                  color: #1f4f82;
                  font-weight: 800;
                  height: 54px;
                  padding: 0 34px;
                  box-shadow: 0 14px 26px rgba(0,0,0,0.12);
                "
              >
                Fale Com a nossa equipe
              </v-btn>

              <v-btn
                to="/login"
                rounded="lg"
                size="x-large"
                variant="outlined"
                elevation="0"
                class="premium-btn"
                style="
                  color: white;
                  border-color: rgba(255,255,255,0.34);
                  background: rgba(255,255,255,0.05);
                  height: 54px;
                  padding: 0 28px;
                  font-weight: 700;
                "
              >
                Fazer Login
              </v-btn>
            </div>
          </div>
        </v-container>
      </section>

      <footer
        style="
          background: linear-gradient(
            180deg,
            #123B6D 5%,
            #0F2E57 50%,
            #0B2547 100%
          );
        "
      >
        <v-container
          class="d-flex align-center justify-space-between flex-wrap"
          style="gap: 16px;"
        >
          <div class="d-flex align-center" style="color: white; font-weight: 700;">
            <span>TruckFlow</span>
          </div>

          <div style="color: #9fb7d8; font-size: 13px;">
            © 2026 TruckFlow • Política de Privacidade • Termos de Uso
          </div>
        </v-container>
      </footer>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
let observer: IntersectionObserver | null = null
let ticking = false

const parallaxGlow1 = ref(0)
const parallaxGlow2 = ref(0)
const parallaxGrid = ref(0)

const updateScrollEffects = () => {
  const y = window.scrollY || 0
  scrolled.value = y > 20

  parallaxGlow1.value = y * 0.18
  parallaxGlow2.value = y * 0.12
  parallaxGrid.value = y * 0.06

  ticking = false
}

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects)
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  updateScrollEffects()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
        }
      })
    },
    { threshold: 0.15 }
  )

  document.querySelectorAll('.reveal').forEach((el) => {
    observer?.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  observer?.disconnect()
})

const steps = ref([
  {
    icon: 'mdi-web',
    title: 'Empresa agenda',
    text: 'Fornecedor ou transportadora solicita a janela no sistema.'
  },
  {
    icon: 'mdi-check-decagram',
    title: 'Operação valida',
    text: 'A capacidade disponível é verificada para evitar conflito.'
  },
  {
    icon: 'mdi-truck-fast-outline',
    title: 'Fluxo controlado',
    text: 'O pátio opera com mais organização e menos espera.'
  },
  {
    icon: 'mdi-chart-line',
    title: 'Gestão analisa',
    text: 'Os dados operacionais viram melhoria contínua.'
  }
])
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(42px);
  transition:
    opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal.show {
  opacity: 1;
  transform: translateY(0);
}

.reveal-delay-1 {
  transition-delay: 120ms;
}

.reveal-delay-2 {
  transition-delay: 220ms;
}

.reveal-delay-3 {
  transition-delay: 320ms;
}

.reveal-delay-4 {
  transition-delay: 420ms;
}

.premium-btn {
  transition: transform .22s ease, box-shadow .22s ease, filter .22s ease;
}

.premium-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.03);
}

.premium-card {
  transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease;
}

.premium-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 34px rgba(19,68,125,.10);
  border-color: rgba(31,79,130,.10);
}
</style>