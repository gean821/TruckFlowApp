<template>
  <v-app>
    <v-app-bar color="transparent" elevation="0" class="px-md-16 px-4 pt-4" absolute>
      <div class="d-flex align-center">
        <v-avatar color="white" size="40" class="mr-3 elevation-2">
          <v-icon color="#195FA0" icon="mdi-truck-fast"></v-icon>
        </v-avatar>
        <span class="text-h6 font-weight-bold text-white tracking-wide">TruckFlow</span>
      </div>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex align-center gap-4">
        <v-btn variant="text" color="white" class="text-capitalize">Início</v-btn>
        <v-btn variant="text" color="white" class="text-capitalize">Funcionalidades</v-btn>
        
        <v-btn 
          color="white" 
          variant="outlined" 
          class="text-capitalize ml-4 px-6" 
          rounded="pill"
          to="/login"
        >
          Login
          <v-icon end icon="mdi-arrow-right" size="small"></v-icon>
        </v-btn>
      </div>

      <v-app-bar-nav-icon class="d-md-none text-white" variant="text"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main class="bg-gradient-primary">
      <v-container class="fill-height py-16">
        <v-row align="center" justify="center" class="mt-16">
          <v-col cols="12" md="8" lg="7" class="text-center text-white">
            
            <v-chip 
              color="blue-lighten-4" 
              variant="flat" 
              size="small" 
              class="mb-6 font-weight-bold text-blue-darken-4 px-4"
            >
              🚀 Logística Inteligente 4.0
            </v-chip>

            <h1 class="text-h2 font-weight-black mb-6 leading-tight">
              Otimize o fluxo de <br/>
              <span class="text-blue-lighten-3">Cargas e Descargas</span>
            </h1>

            <p class="text-h6 font-weight-regular text-blue-grey-lighten-4 mb-10 px-md-16">
              A solução definitiva para agendamento de docas, controle de pátio e redução de filas. Conecte fornecedores, transportadoras e sua operação em um único lugar.
            </p>

            <div class="d-flex justify-center gap-4 flex-wrap">
              <v-btn 
                to="/register"
                color="white" 
                size="x-large" 
                class="text-primary font-weight-bold px-8" 
                elevation="4"
                rounded="lg"
              >
                Começar Agora
              </v-btn>
              
              <v-btn 
                variant="outlined" 
                color="white" 
                size="x-large" 
                class="px-8" 
                rounded="lg"
              >
                <v-icon start icon="mdi-play-circle-outline"></v-icon>
                Saiba Mais
              </v-btn>
            </div>

          </v-col>
        </v-row>

        <v-row class="mt-16 pt-10" justify="center">
          <v-col cols="12" md="4" v-for="(card, i) in features" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <v-card 
                v-bind="props"
                :elevation="isHovering ? 12 : 2"
                class="rounded-xl pa-6 bg-white/10 backdrop-blur-md border-opacity-25 border-white transition-swing"
                height="100%"
              >
                <v-avatar 
                  :color="card.color" 
                  variant="tonal" 
                  size="60" 
                  class="mb-4 rounded-lg"
                >
                  <v-icon size="30" :icon="card.icon"></v-icon>
                </v-avatar>
                
                <h3 class="text-h5 font-weight-bold text-white mb-2">
                  {{ card.title }}
                </h3>
                
                <p class="text-body-1 text-blue-grey-lighten-4">
                  {{ card.text }}
                </p>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
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
import router from '@/router';
import { ref } from 'vue';

const features = ref([
  {
    icon: 'mdi-calendar-clock',
    color: 'light-blue-accent-2',
    title: '1. Agende Online',
    text: 'Fornecedores e transportadoras escolhem os melhores horários conforme a disponibilidade das suas docas.'
  },
  {
    icon: 'mdi-monitor-dashboard',
    color: 'teal-accent-2',
    title: '2. Monitoramento Real',
    text: 'Painel de controle unificado para portaria e operação. Saiba quem entra e quem sai em tempo real.'
  },
  {
    icon: 'mdi-lightning-bolt',
    color: 'amber-accent-2',
    title: '3. Eficiência Total',
    text: 'Reduza o tempo de espera (Demurrage), organize o fluxo de pátio e aumente a produtividade da equipe.'
  }
]);
</script>

<style scoped>
/* Gradiente Profundo e Moderno */
.bg-gradient-primary {
  background: linear-gradient(135deg, #195FA0 0%, #0D3C68 100%);
  /* Opcional: Adicionar uma textura ou padrão svg de fundo bem sutil */
}

/* Glassmorphism nos cards */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.leading-tight {
  line-height: 1.1;
}
</style>