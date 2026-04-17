<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center"
    style="
      min-height:100vh;
      background:
        linear-gradient(145deg,#041427 0%,#08203d 30%,#0c2b52 60%,#133f74 100%);
      color:white;
      position:relative;
      overflow:hidden;
    "
  >
    <div
      class="grid-bg"
      style="
        position:absolute;
        inset:0;
        background-image:
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
        background-size:40px 40px;
        opacity:.35;
      "
    ></div>

    <div
      class="logo-glow"
      style="
        position:absolute;
        width:760px;
        height:760px;
        border-radius:50%;
        background:radial-gradient(
          circle,
          rgba(255,255,255,0.32) 0%,
          rgba(255,255,255,0.14) 32%,
          rgba(255,255,255,0.06) 54%,
          transparent 72%
        );
        filter:blur(8px);
        left:50%;
        top:180px;
        transform:translateX(-50%);
      "
    ></div>

    <div
      class="logo-backdrop"
      style="
        position:absolute;
        width:660px;
        height:210px;
        left:50%;
        top:88px;
        transform:translateX(-50%);
        border-radius:34px;
        background:linear-gradient(
          90deg,
          rgba(255,255,255,0.00) 0%,
          rgba(255,255,255,0.10) 14%,
          rgba(255,255,255,0.24) 50%,
          rgba(255,255,255,0.10) 86%,
          rgba(255,255,255,0.00) 100%
        );
        backdrop-filter:blur(4px);
        box-shadow:
          0 0 40px rgba(255,255,255,0.08),
          inset 0 0 24px rgba(255,255,255,0.06);
      "
    ></div>

    <div
      class="logo-sweep"
      style="
        position:absolute;
        width:260px;
        height:500px;
        top:120px;
        left:50%;
        transform:translateX(-50%) rotate(18deg);
        background:linear-gradient(
          180deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,0.00) 18%,
          rgba(255,255,255,0.22) 48%,
          rgba(255,255,255,0.62) 50%,
          rgba(255,255,255,0.22) 52%,
          rgba(255,255,255,0.00) 82%,
          rgba(255,255,255,0) 100%
        );
        filter:blur(10px);
        opacity:0;
        pointer-events:none;
        z-index:2;
      "
    ></div>


    <div
      style="
        width:100%;
        max-width:1080px;
        text-align:center;
        position:relative;
        z-index:3;
        padding:48px 20px 72px 20px;
      "
    >
      <img
        src="/Rectangle.svg"
        alt="TruckFlow"
        class="logo-float fade-up delay-1"
        style="
          width:420px;
          max-width:100%;
          margin-bottom:36px;
          filter:
            drop-shadow(0 25px 60px rgba(0,0,0,0.42))
            drop-shadow(0 0 18px rgba(255,255,255,0.10));
        "
      />

      <h1
        class="fade-up delay-2"
        style="
          font-size:3rem;
          font-weight:900;
          margin-bottom:16px;
          letter-spacing:-1px;
          text-shadow:0 8px 24px rgba(0,0,0,0.22);
        "
      >
        Fale com a equipe TruckFlow
      </h1>

      <p
        class="fade-up delay-3"
        style="
          font-size:1.12rem;
          color:rgba(255,255,255,0.86);
          max-width:620px;
          margin:auto;
          margin-bottom:42px;
          line-height:1.85;
        "
      >
        Tire dúvidas, conheça melhor a plataforma e entre em contato com nossa equipe
        para conversar sobre o sistema, agendar uma apresentação ou entender como o TruckFlow pode atender sua operação.
      </p>

      <div
        class="fade-up delay-4"
        style="
          display:flex;
          justify-content:center;
          gap:18px;
          flex-wrap:wrap;
          margin-bottom:48px;
        "
      >
        <v-btn
          size="x-large"
          class="contact-btn primary-btn"
          @click="openWhatsapp('554498213045')"
          style="
            height:62px;
            padding:0 30px;
            font-weight:800;
            color:white;
            background:linear-gradient(135deg,#061a31 0%,#0c2b52 50%,#184d88 100%);
            box-shadow:0 18px 40px rgba(0,0,0,0.28);
            border-radius:18px;
            letter-spacing:.01em;
          "
        >
          <v-icon icon="mdi-whatsapp" start></v-icon>
          WhatsApp Gean
        </v-btn>

        <v-btn
          size="x-large"
          class="contact-btn primary-btn"
          @click="openWhatsapp('554498151645')"
          style="
            height:62px;
            padding:0 30px;
            font-weight:800;
            color:white;
            background:linear-gradient(135deg,#061a31 0%,#0c2b52 50%,#184d88 100%);
            box-shadow:0 18px 40px rgba(0,0,0,0.28);
            border-radius:18px;
            letter-spacing:.01em;
          "
        >
          <v-icon icon="mdi-whatsapp" start></v-icon>
          WhatsApp Felipe
        </v-btn>

        <v-btn
          size="x-large"
          class="contact-btn secondary-btn"
          @click="sendEmail"
          style="
            height:62px;
            padding:0 30px;
            font-weight:800;
            color:white;
            background:rgba(255,255,255,0.08);
            border:1px solid rgba(255,255,255,0.16);
            backdrop-filter:blur(10px);
            box-shadow:0 18px 36px rgba(0,0,0,0.22);
            border-radius:18px;
            letter-spacing:.01em;
          "
        >
          <v-icon icon="mdi-email-outline" start></v-icon>
          Enviar E-mail
        </v-btn>
      </div>

      <div
        class="fade-up delay-5"
        style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
          gap:24px;
          margin-top:20px;
          margin-bottom:52px;
          text-align:left;
        "
      >
        <div class="faq-card">
          <div class="faq-icon-wrap">
            <v-icon icon="mdi-cellphone" size="22" color="white"></v-icon>
          </div>
          <h3>Funciona em celular?</h3>
          <p>
            Sim. O TruckFlow pode ser acessado em dispositivos móveis. Para administradores,
            o uso acontece diretamente pelo navegador. Já para os motoristas, a operação é feita
            pelo aplicativo disponível na Play Store.
          </p>
        </div>

        <div class="faq-card">
          <div class="faq-icon-wrap">
            <v-icon icon="mdi-flask-outline" size="22" color="white"></v-icon>
          </div>
          <h3>O sistema possui teste gratuito?</h3>
          <p>
            No momento não trabalhamos com teste gratuito aberto. Ainda assim, entrando em contato
            conosco você pode esclarecer suas dúvidas, conversar com a equipe, agendar uma reunião
            ou conhecer melhor o funcionamento do sistema.
          </p>
        </div>

        <div class="faq-card">
          <div class="faq-icon-wrap">
            <v-icon icon="mdi-web" size="22" color="white"></v-icon>
          </div>
          <h3>Precisa instalar algo?</h3>
          <p>
            Para uso administrativo não. O sistema funciona totalmente via web. Para os motoristas,
            é necessário instalar o aplicativo do TruckFlow pela Play Store para utilização das rotinas
            operacionais no celular.
          </p>
        </div>
      </div>

      <div
        class="fade-up delay-6"
        style="
          display:flex;
          justify-content:center;
          gap:24px;
          flex-wrap:wrap;
          margin-bottom:28px;
        "
      >
        <div class="email-card">
          <v-icon icon="mdi-email-outline" color="#ffffff"></v-icon>
          <span>ftozadori@gmail.com</span>
        </div>

        <div class="email-card">
          <v-icon icon="mdi-email-outline" color="#ffffff"></v-icon>
          <span>geanlucaramos@gmail.com</span>
        </div>
      </div>

      <div
        class="fade-up delay-7"
        style="
          display:flex;
          justify-content:center;
          gap:18px;
          flex-wrap:wrap;
          margin-top:14px;
        "
      >
        <v-btn
          variant="outlined"
          to="/home"
          class="nav-btn"
          style="
            border:2px solid rgba(255,255,255,0.82);
            color:white;
            height:54px;
            padding:0 28px;
            border-radius:16px;
            font-weight:700;
          "
        >
          Voltar para Home
        </v-btn>

        <v-btn
          variant="text"
          to="/login"
          class="nav-btn"
          style="
            color:white;
            height:54px;
            padding:0 28px;
            border-radius:16px;
            font-weight:700;
          "
        >
          Ir para Login
        </v-btn>
      </div>

      <p
        class="fade-up delay-7"
        style="
          margin-top:34px;
          font-size:.96rem;
          color:rgba(255,255,255,0.75);
        "
      >
        Tempo médio de resposta: até 24 horas
      </p>
    </div>
  </v-container>
</template>

<script setup lang="ts">
function openWhatsapp(numero: string) {
  window.open(`https://wa.me/${numero}`, '_blank')
}

function sendEmail() {
  const to = [
    'ftozadori@gmail.com',
    'geanlucaramos@gmail.com'
  ].join(',')

  const subject = encodeURIComponent('Contato TruckFlow')
  const body = encodeURIComponent(
    'Olá, gostaria de saber mais sobre o TruckFlow.'
  )

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
}
</script>

<style scoped>
.grid-bg {
  animation: gridMove 18s linear infinite;
}

.logo-glow {
  animation: pulseGlow 3.4s ease-in-out infinite;
}

.logo-backdrop {
  animation: backdropPulse 4.2s ease-in-out infinite;
}

.logo-sweep {
  animation: logoSweep 5.3s ease-in-out infinite;
} 

.logo-float {
  animation: floatLogo 5s ease-in-out infinite;
}

.fade-up {
  opacity: 0;
  transform: translateY(26px);
  animation: fadeUp .9s forwards;
}

.delay-1 { animation-delay: .10s; }
.delay-2 { animation-delay: .20s; }
.delay-3 { animation-delay: .32s; }
.delay-4 { animation-delay: .44s; }
.delay-5 { animation-delay: .56s; }
.delay-6 { animation-delay: .68s; }
.delay-7 { animation-delay: .80s; }

.contact-btn {
  transition: transform .24s ease, box-shadow .24s ease, filter .24s ease, background .24s ease;
}

.contact-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.04);
}

.primary-btn:hover {
  box-shadow: 0 26px 52px rgba(0,0,0,0.32) !important;
}

.secondary-btn:hover {
  background: rgba(255,255,255,0.12) !important;
  box-shadow: 0 24px 46px rgba(0,0,0,0.28) !important;
}

.faq-card {
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
  padding: 26px;
  border-radius: 22px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow: 0 14px 28px rgba(0,0,0,0.14);
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease, border-color .25s ease;
}

.faq-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.06),
    rgba(255,255,255,0.00) 40%,
    rgba(255,255,255,0.04)
  );
  pointer-events: none;
}

.faq-card:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.16);
  box-shadow: 0 22px 42px rgba(0,0,0,0.18);
}

.faq-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.12);
  margin-bottom: 14px;
}

.faq-card h3 {
  font-weight: 800;
  margin-bottom: 10px;
  font-size: 1.04rem;
  color: #ffffff;
}

.faq-card p {
  font-size: .96rem;
  line-height: 1.75;
  color: rgba(255,255,255,0.84);
  margin: 0;
}

.email-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 24px;
  border-radius: 18px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: #ffffff;
  font-weight: 600;
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 26px rgba(0,0,0,0.16);
  transition: transform .22s ease, background .22s ease;
}

.email-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.10);
}

.nav-btn {
  transition: transform .22s ease, background .22s ease, border-color .22s ease;
}

.nav-btn:hover {
  transform: translateY(-2px);
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  50% { transform: translate(12px, 8px); }
  100% { transform: translate(0, 0); }
}

@keyframes pulseGlow {
  0% {
    transform: translateX(-50%) scale(0.95);
    opacity: .62;
  }
  50% {
    transform: translateX(-50%) scale(1.15);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(0.95);
    opacity: .62;
  }
}

@keyframes backdropPulse {
  0%, 100% {
    opacity: .88;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.04);
  }
}

@keyframes logoSweep {
  0% {
    opacity: 0;
    transform: translateX(-120%) rotate(18deg);
  }
  8% {
    opacity: .16;
  }
  20% {
    opacity: .92;
  }
  34% {
    opacity: 0;
    transform: translateX(20%) rotate(18deg);
  }
  100% {
    opacity: 0;
    transform: translateX(20%) rotate(18deg);
  }
}

@keyframes floatLogo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>