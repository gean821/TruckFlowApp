<script setup lang="ts">
import type { DashboardActivityDto } from '@/Dtos/dashboard/Dashboard-responses';
import { computed } from 'vue';

const props = defineProps<{
  activities: DashboardActivityDto[]
}>();

const emit = defineEmits(['viewAll']);

const items = computed(() => props.activities || []);
</script>

<template>
  <v-card elevation="0" class="border rounded-xl h-100 d-flex flex-column">

    <div class="pa-5 pb-2 d-flex justify-space-between align-center">
      <h3 class="text-h6 font-weight-bold">Atividade Recente</h3>

      <v-btn variant="text" density="compact" color="primary" class="text-capitalize" @click="emit('viewAll')">
        Ver tudo
      </v-btn>
    </div>

    <v-divider class="mx-5 mb-2"></v-divider>

    <div class="pa-4 pt-0 flex-grow-1 overflow-y-auto" style="max-height: 400px;">

      <div v-if="items.length === 0" class="text-center py-10 text-grey">
        <v-icon icon="mdi-history" size="large" class="mb-2 opacity-50"></v-icon>
        <p class="text-caption">Nenhuma atividade recente</p>
      </div>

      <v-timeline v-else density="compact" align="start" side="end" truncate-line="start">

        <v-timeline-item v-for="item in items" :key="item.id" :dot-color="item.color" size="x-small" class="mb-2">
          <template v-slot:icon>
            <v-icon size="10" color="white">{{ item.icon }}</v-icon>
          </template>

          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between align-center w-100">
              <span class="text-body-2 font-weight-bold text-grey-darken-3">
                {{ item.title }}
              </span>
              <span class="text-caption text-grey text-no-wrap ml-2">
                {{ item.time }}
              </span>
            </div>

            <span class="text-caption text-grey-darken-1">
              {{ item.subtitle }}
            </span>
          </div>
        </v-timeline-item>

      </v-timeline>
    </div>
  </v-card>
</template>