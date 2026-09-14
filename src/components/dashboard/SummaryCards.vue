<template>
  <v-row>
    <v-col v-for="item in items" :key="item.key" cols="12" sm="6" lg="3">
      <v-card elevation="0" class="rounded-xl pa-5 h-100 summary-card" :class="item.cardClass">
        <div class="d-flex justify-space-between align-start">
          <div class="flex-grow-1">
            <div class="text-caption font-weight-medium text-uppercase mb-2 label-text" style="letter-spacing: 0.06em;">
              {{ item.label }}
            </div>
            <div v-if="!loading" class="text-h3 font-weight-bold value-text">
              {{ stats[item.key] }}
            </div>
            <v-skeleton-loader v-else type="heading" width="60px" class="mt-1 skeleton-clean" />
          </div>

          <v-avatar :class="item.avatarClass" size="52" class="rounded-xl flex-shrink-0">
            <v-icon :color="item.iconColor" size="26">{{ item.icon }}</v-icon>
          </v-avatar>
        </div>

        <div class="card-glow" :style="{ background: item.glowColor }"></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  stats: any;
  loading: boolean;
}>();

const items = [
  {
    key: 'totalAgendamentos',
    label: 'Agendamentos Hoje',
    icon: 'mdi-calendar-check',
    iconColor: '#195FA0',
    cardClass: 'card-blue',
    avatarClass: 'avatar-blue',
    glowColor: 'radial-gradient(ellipse at bottom right, rgba(25,95,160,0.12) 0%, transparent 70%)',
  },
  {
    key: 'emAndamento',
    label: 'Veículos no Pátio',
    icon: 'mdi-truck-fast',
    iconColor: '#0097A7',
    cardClass: 'card-cyan',
    avatarClass: 'avatar-cyan',
    glowColor: 'radial-gradient(ellipse at bottom right, rgba(0,151,167,0.12) 0%, transparent 70%)',
  },
  {
    key: 'finalizados',
    label: 'Descargas Concluídas',
    icon: 'mdi-check-circle',
    iconColor: '#2E7D32',
    cardClass: 'card-green',
    avatarClass: 'avatar-green',
    glowColor: 'radial-gradient(ellipse at bottom right, rgba(46,125,50,0.12) 0%, transparent 70%)',
  },
  {
    key: 'atrasados',
    label: 'Atrasos / Alertas',
    icon: 'mdi-alert-circle',
    iconColor: '#C62828',
    cardClass: 'card-red',
    avatarClass: 'avatar-red',
    glowColor: 'radial-gradient(ellipse at bottom right, rgba(198,40,40,0.12) 0%, transparent 70%)',
  },
];
</script>

<style scoped>
.summary-card {
  position: relative;
  overflow: hidden;
  border: none !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 12px 12px 0 0;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 4px 8px rgba(0,0,0,.06), 0 16px 32px rgba(0,0,0,.10) !important;
}

.card-blue  { background: linear-gradient(145deg, #ffffff 60%, #EBF3FF 100%); }
.card-cyan  { background: linear-gradient(145deg, #ffffff 60%, #E0F7FA 100%); }
.card-green { background: linear-gradient(145deg, #ffffff 60%, #E8F5E9 100%); }
.card-red   { background: linear-gradient(145deg, #ffffff 60%, #FFEBEE 100%); }

.card-blue::before  { background: linear-gradient(90deg, #195FA0, #42A5F5); }
.card-cyan::before  { background: linear-gradient(90deg, #0097A7, #4DD0E1); }
.card-green::before { background: linear-gradient(90deg, #2E7D32, #66BB6A); }
.card-red::before   { background: linear-gradient(90deg, #C62828, #EF5350); }

.avatar-blue  { background: rgba(25, 95, 160, 0.10) !important; }
.avatar-cyan  { background: rgba(0, 151, 167, 0.10) !important; }
.avatar-green { background: rgba(46, 125, 50, 0.10) !important; }
.avatar-red   { background: rgba(198, 40, 40, 0.10) !important; }

.label-text { color: #78909C; }
.value-text { color: #1A2332; }

.card-glow {
  position: absolute;
  bottom: 0; right: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

.skeleton-clean :deep(.v-skeleton-loader__heading) { margin: 0; }
</style>
