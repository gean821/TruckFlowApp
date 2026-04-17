<template>
  <v-row
    no-gutters
    class="fill-height"
    style="
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(22, 71, 128, 0.10), transparent 28%),
        radial-gradient(circle at bottom right, rgba(12, 43, 82, 0.08), transparent 30%),
        linear-gradient(135deg, #eef4fb 0%, #f7faff 45%, #edf2f9 100%);
    "
  >
    <v-col
      cols="12"
      md="6"
      lg="7"
      class="d-none d-md-flex align-center justify-center position-relative overflow-hidden"
      style="
        background:
          linear-gradient(145deg, #041427 0%, #08203d 30%, #0c2b52 60%, #133f74 100%);
      "
    >
      <div
        class="animated-grid"
        style="
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size:40px 40px;
          opacity:.35;
        "
      ></div>

      <div
        class="logo-glow"
        style="
          position:absolute;
          width:750px;
          height:750px;
          border-radius:50%;
          background: radial-gradient(
            circle,
            rgba(255,255,255,0.35) 0%,
            rgba(255,255,255,0.18) 30%,
            rgba(255,255,255,0.08) 55%,
            transparent 70%
          );
          filter: blur(6px);
        "
      ></div>

      <div
        class="logo-backdrop"
        style="
          position:absolute;
          width:660px;
          height:230px;
          border-radius:34px;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.10) 14%,
            rgba(255,255,255,0.22) 50%,
            rgba(255,255,255,0.10) 86%,
            rgba(255,255,255,0.00) 100%
          );
          backdrop-filter: blur(4px);
          box-shadow:
            0 0 40px rgba(255,255,255,0.08),
            inset 0 0 24px rgba(255,255,255,0.06);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -108%);
        "
      ></div>

      <div
        class="logo-sweep"
        style="
          position:absolute;
          width:260px;
          height:520px;
          top:50%;
          left:50%;
          transform: translate(-50%, -56%) rotate(18deg);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.00) 18%,
            rgba(255,255,255,0.22) 48%,
            rgba(255,255,255,0.65) 50%,
            rgba(255,255,255,0.22) 52%,
            rgba(255,255,255,0.00) 82%,
            rgba(255,255,255,0) 100%
          );
          filter: blur(10px);
          opacity:0;
          pointer-events:none;
          z-index:2;
        "
      ></div>

      <div
        class="light-line"
        style="
          position:absolute;
          width:760px;
          height:2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.42),
            transparent
          );
          top: calc(50% - 10px);
          left: 50%;
          transform: translateX(-50%);
        "
      ></div>

      <div
        class="left-content"
        style="
          position:relative;
          z-index:3;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
          max-width:700px;
          padding:60px;
        "
      >
        <img
          src="/Rectangle.svg"
          alt="TruckFlow"
          class="floating-logo fade-up delay-1"
          style="
            width:500px;
            max-width:100%;
            height:auto;
            margin-bottom:30px;
            position: relative;
            z-index: 3;
            filter:
              drop-shadow(0 25px 60px rgba(0,0,0,0.42))
              drop-shadow(0 0 18px rgba(255,255,255,0.10));
          "
        />

        <h1
          class="fade-up delay-2"
          style="
            font-size:4rem;
            font-weight:900;
            letter-spacing:-2px;
            color:white;
            margin-bottom:20px;
            text-shadow: 0 8px 24px rgba(0,0,0,0.22);
          "
        >
          TruckFlow
        </h1>

        <p
          class="fade-up delay-3"
          style="
            color:rgba(255,255,255,0.86);
            font-size:1.15rem;
            line-height:1.8;
            max-width:460px;
          "
        >
          Plataforma moderna para gestão logística e controle
          inteligente de operações.
        </p>
      </div>
    </v-col>

    <v-col
      cols="12"
      md="6"
      lg="5"
      class="d-flex align-center justify-center fill-height"
      style="
        background:
          linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(246,249,252,1) 100%);
      "
    >
      <v-container
        class="px-6 px-md-10"
        style="width:100%;max-width:760px;"
      >
        <div class="d-md-none text-center mb-8 mobile-fade" style="padding-top: 10px;">
          <div
            style="
              width: 100%;
              max-width: 340px;
              margin: 0 auto 18px auto;
              padding: 18px 22px;
              border-radius: 24px;
              background: linear-gradient(
                90deg,
                rgba(12,43,82,0.02) 0%,
                rgba(12,43,82,0.06) 50%,
                rgba(12,43,82,0.02) 100%
              );
            "
          >
            <img
              src="/Rectangle.svg"
              alt="TruckFlow"
              style="
                width:280px;
                max-width:100%;
                height:auto;
                display:block;
                margin:0 auto;
                filter:
                  drop-shadow(0 20px 35px rgba(12,43,82,.18))
                  drop-shadow(0 0 10px rgba(255,255,255,.25));
              "
            />
          </div>

          <h2
            style="
              font-size:2rem;
              font-weight:900;
              color:#081b33;
              letter-spacing:-0.03em;
              margin-bottom:6px;
            "
          >
            TruckFlow
          </h2>

          <p style="color:#647587;font-size:.98rem;">
            Faça login para acessar sua operação
          </p>
        </div>

        <div
          class="login-card-enter"
          style="
            background: rgba(255,255,255,0.94);
            border: 1px solid rgba(12,43,82,0.08);
            border-radius: 36px;
            padding: 58px;
            box-shadow:
              0 24px 55px rgba(9,30,66,0.08),
              0 60px 120px rgba(18,61,114,0.10);
            position: relative;
            overflow: hidden;
          "
        >
          <div
            class="card-orb"
            style="
              position:absolute;
              width:220px;
              height:220px;
              top:-110px;
              right:-90px;
              border-radius:50%;
              background: radial-gradient(circle, rgba(22,71,128,0.10) 0%, rgba(22,71,128,0.03) 60%, transparent 75%);
            "
          ></div>

          <div style="position:relative;z-index:2;">
            <div class="mb-10">
              <span
                class="fade-up delay-1"
                style="
                  display:inline-flex;
                  align-items:center;
                  gap:8px;
                  background:#eef4fb;
                  color:#0c2b52;
                  padding:10px 16px;
                  border-radius:999px;
                  font-weight:800;
                  font-size:12px;
                  letter-spacing:1.2px;
                "
              >
                <span
                  class="pulse-dot"
                  style="
                    width:8px;
                    height:8px;
                    border-radius:50%;
                    background:#164780;
                    display:inline-block;
                  "
                ></span>
                PAINEL DE ACESSO
              </span>

              <h2
                class="fade-up delay-2"
                style="
                  margin-top:22px;
                  font-size:2.9rem;
                  font-weight:900;
                  color:#081b33;
                  letter-spacing:-0.04em;
                  margin-bottom:12px;
                  line-height:1.05;
                "
              >
                Entrar no sistema
              </h2>

              <p
                class="fade-up delay-3"
                style="
                  color:#6c7a89;
                  font-size:1.02rem;
                  line-height:1.75;
                  max-width:460px;
                "
              >
                Use suas credenciais para acessar o painel com rapidez e segurança.
              </p>
            </div>

            <v-form @submit.prevent="handleLogin" class="fade-up delay-4">
              <v-text-field
                v-model="formLogin.login"
                label="Usuário"
                variant="solo"
                flat
                prepend-inner-icon="mdi-account-outline"
                class="mb-5 premium-field"
                rounded="xl"
                bg-color="#f4f7fb"
                color="primary"
                hide-details="auto"
                style="--v-theme-primary:#0c2b52;"
              ></v-text-field>

              <v-text-field
                v-model="formLogin.password"
                label="Senha"
                variant="solo"
                flat
                prepend-inner-icon="mdi-lock-outline"
                :type="showPass ? 'text' : 'password'"
                :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPass = !showPass"
                class="mb-3 premium-field"
                rounded="xl"
                bg-color="#f4f7fb"
                color="primary"
                hide-details="auto"
                style="--v-theme-primary:#0c2b52;"
              ></v-text-field>

              <div class="d-flex justify-space-between align-center mb-8 flex-wrap ga-2">
                <v-checkbox
                  v-model="remember"
                  label="Lembrar-me"
                  density="compact"
                  hide-details
                  color="primary"
                  style="--v-theme-primary:#0c2b52;"
                ></v-checkbox>

                <a
                  href="#"
                  style="
                    color:#0c2b52;
                    font-weight:700;
                    text-decoration:none;
                    transition: all .25s ease;
                  "
                >
                  Esqueceu a senha?
                </a>
              </div>

              <v-btn
                block
                size="x-large"
                type="submit"
                rounded="xl"
                elevation="0"
                :loading="loading"
                class="text-capitalize login-btn"
                style="
                  height:68px;
                  font-size:16px;
                  font-weight:800;
                  color:white;
                  background:linear-gradient(135deg,#061a31 0%,#0c2b52 45%,#184d88 100%);
                  box-shadow:0 22px 44px rgba(12,43,82,0.22);
                  letter-spacing:.02em;
                "
              >
                Acessar Sistema
              </v-btn>
            </v-form>

            <div
              class="text-center mt-8 fade-up delay-5"
              style="
                color:#637487;
                font-size:.97rem;
              "
            >
              Ainda não tem conta?
              <a
                href="/contact"
                style="
                  color:#0c2b52;
                  font-weight:800;
                  text-decoration:none;
                "
              >
                Fale com nossa equipe
              </a>
            </div>
          </div>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type AdminLoginDto from '@/Dtos/adm/adminLoginDto'
import { useAuthStore } from '@/stores/AuthStore'
import { useToastStore } from '@/stores/ToastStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToastStore()

const formLogin = ref<AdminLoginDto>({
  password: '',
  login: ''
})

const showPass = ref(false)
const remember = ref(false)
const loading = ref(false)

async function handleLogin() {
  loading.value = true

  try {
    await authStore.login(formLogin.value)
    router.push('/visualizar')
  } catch (e) {
    toast.notify('Credenciais inválidas.', 'error', 3)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animated-grid {
  animation: gridMove 18s linear infinite;
}

.logo-glow {
  animation: pulseGlow 3.2s ease-in-out infinite;
}

.logo-backdrop {
  animation: backdropPulse 4s ease-in-out infinite;
}

.logo-sweep {
  animation: logoSweep 5.2s ease-in-out infinite;
}

.light-line {
  animation: linePulse 2.6s ease-in-out infinite;
}

.floating-logo {
  animation: floatLogo 4.8s ease-in-out infinite;
}

.left-content {
  animation: contentFade 1s ease-out;
}

.login-card-enter {
  animation: cardUp 0.9s ease-out;
}

.card-orb {
  animation: orbFloat 6s ease-in-out infinite;
}

.mobile-fade {
  animation: fadeUp 0.8s ease-out;
}

.pulse-dot {
  animation: pulseDot 1.8s ease-in-out infinite;
}

.fade-up {
  opacity: 0;
  transform: translateY(26px);
  animation: fadeUp 0.9s ease forwards;
}

.delay-1 {
  animation-delay: 0.12s;
}

.delay-2 {
  animation-delay: 0.24s;
}

.delay-3 {
  animation-delay: 0.36s;
}

.delay-4 {
  animation-delay: 0.48s;
}

.delay-5 {
  animation-delay: 0.60s;
}

.login-btn {
  transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 28px 52px rgba(12,43,82,0.28) !important;
  filter: brightness(1.03);
}

:deep(.premium-field .v-field) {
  transition: transform .22s ease, box-shadow .22s ease, background-color .22s ease;
}

:deep(.premium-field .v-field:hover) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(12,43,82,0.08);
}

:deep(.premium-field .v-field--focused) {
  box-shadow: 0 16px 30px rgba(12,43,82,0.10);
}

@keyframes gridMove {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(10px) translateX(6px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

@keyframes pulseGlow {
  0% {
    transform: scale(0.95);
    opacity: .6;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: .6;
  }
}

@keyframes backdropPulse {
  0%, 100% {
    opacity: .88;
    transform: translate(-50%, -108%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -108%) scale(1.04);
  }
}

@keyframes linePulse {
  0% {
    opacity: .2;
    transform: translateX(-50%) scaleX(.7);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scaleX(1.1);
  }
  100% {
    opacity: .2;
    transform: translateX(-50%) scaleX(.7);
  }
}

@keyframes logoSweep {
  0% {
    opacity: 0;
    transform: translate(-110%, -56%) rotate(18deg);
  }
  8% {
    opacity: .15;
  }
  20% {
    opacity: .9;
  }
  34% {
    opacity: 0;
    transform: translate(15%, -56%) rotate(18deg);
  }
  100% {
    opacity: 0;
    transform: translate(15%, -56%) rotate(18deg);
  }
}

@keyframes floatLogo {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes contentFade {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardUp {
  from {
    opacity: 0;
    transform: translateY(35px) scale(.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes orbFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(10px) translateX(-8px);
  }
}

@keyframes pulseDot {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.35);
    opacity: .75;
  }
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>