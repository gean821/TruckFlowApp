<template>
  <v-card elevation="0" class="rounded-xl h-100 d-flex flex-column premium-card">

    <div class="pa-5 pb-3 d-flex justify-space-between align-center">
      <div class="d-flex align-center gap-2">
        <h3 class="text-h6 font-weight-bold">Atividade Recente</h3>
        <v-chip v-if="items.length > 0" size="x-small" color="primary" variant="tonal">
          {{ items.length }}
        </v-chip>
      </div>

      <v-btn variant="text" density="compact" color="primary" class="text-capitalize" @click="emit('viewAll')">
        Ver tudo
      </v-btn>
    </div>

    <v-divider class="mx-5" />

    <div class="pa-4 pt-2 flex-grow-1 activity-scroll" style="max-height: 400px; overflow-y: auto;">

      <div v-if="items.length === 0" class="d-flex flex-column align-center justify-center py-10 text-grey">
        <v-avatar color="grey-lighten-4" size="56" class="mb-3">
          <v-icon icon="mdi-history" size="28" color="grey-lighten-1" />
        </v-avatar>
        <p class="text-body-2 font-weight-medium text-grey-darken-1">Nenhuma atividade recente</p>
        <p class="text-caption text-grey mt-1">As atividades aparecerão aqui</p>
      </div>

      <v-timeline v-else density="compact" align="start" side="end" truncate-line="start">

        <v-timeline-item
          v-for="item in items"
          :key="item.id"
          :dot-color="item.color"
          size="x-small"
          class="mb-3"
        >
          <template #icon>
            <v-icon size="10" color="white">{{ item.icon }}</v-icon>
          </template>

          <div class="d-flex flex-column activity-item rounded-lg pa-2">
            <div class="d-flex justify-space-between align-center w-100">
              <span class="text-body-2 font-weight-bold text-grey-darken-3">
                {{ item.title }}
              </span>
              <v-chip size="x-small" variant="tonal" color="grey" class="ml-2 text-no-wrap">
                {{ item.time }}
              </v-chip>
            </div>

            <span class="text-caption text-grey-darken-1 mt-1">
              {{ item.subtitle }}
            </span>
          </div>
        </v-timeline-item>

      </v-timeline>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { DashboardActivityDto } from '@/Dtos/dashboard/Dashboard-responses';
import { computed } from 'vue';

const props = defineProps<{
  activities: DashboardActivityDto[]
}>();

const emit = defineEmits(['viewAll']);

const items = computed(() => props.activities || []);
</script>

<style scoped>
.premium-card {
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(0,0,0,.04), 0 2px 4px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
}

.activity-scroll::-webkit-scrollbar { width: 4px; }
.activity-scroll::-webkit-scrollbar-track { background: transparent; }
.activity-scroll::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

.activity-item {
  transition: background-color 0.15s ease;
}
.activity-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
