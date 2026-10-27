<template>
  <v-card
    elevation="0"
    class="rounded-xl h-100 d-flex flex-column premium-card"
  >
    <div class="pa-6 pb-3 d-flex justify-space-between align-center">
      <div class="d-flex align-center gap-2">
        <h3 class="text-h6 font-weight-bold">Agendamentos do Dia</h3>
        <v-progress-circular
          v-if="refreshing"
          indeterminate
          color="primary"
          size="16"
          width="2"
        />
      </div>
      <v-chip v-if="hasData" size="small" variant="tonal" color="primary">
        {{ total }} no dia
      </v-chip>
    </div>

    <v-divider class="mx-6" />

    <div class="flex-grow-1 overflow-y-auto apt-scroll d-flex flex-column">
      <div
        v-if="loading"
        class="d-flex justify-center align-center py-10 flex-grow-1"
      >
        <v-progress-circular indeterminate color="primary" size="32" />
      </div>

      <div
        v-else-if="!hasData"
        class="d-flex flex-column align-center justify-center flex-grow-1 text-grey"
      >
        <v-avatar color="grey-lighten-4" size="52" class="mb-3">
          <v-icon icon="mdi-calendar-check" size="26" color="grey-lighten-1" />
        </v-avatar>
        <p class="text-body-2 font-weight-medium text-grey-darken-1">
          Nenhum agendamento para hoje
        </p>
      </div>

      <v-list v-else lines="two" class="py-0 flex-grow-1 d-flex flex-column">
        <template v-for="(apt, i) in appointments" :key="apt.id">
          <v-list-item class="px-6 flex-grow-1" style="align-items: center">
            <template #prepend>
              <v-avatar
                color="blue-lighten-5"
                size="40"
                class="rounded-lg mr-3"
              >
                <v-icon color="primary" size="20">mdi-truck</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title
              class="text-body-2 font-weight-bold text-grey-darken-3 mb-1"
            >
              {{ titulo(apt) }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-caption text-grey-darken-1">
              {{ detalhe(apt) }}
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex flex-column align-end gap-1">
                <v-chip
                  size="x-small"
                  :color="getStatusConfig(apt.status).color"
                  variant="tonal"
                  class="font-weight-medium"
                >
                  {{ getStatusConfig(apt.status).label }}
                </v-chip>
                <span class="text-caption text-grey">{{
                  formatHora(apt.dataInicio)
                }}</span>
              </div>
            </template>
          </v-list-item>

          <v-divider v-if="i < appointments.length - 1" class="mx-6" />
        </template>
      </v-list>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type AgendamentoAdminResponse from "@/Dtos/agendamento/agendamentoAdminResponse.dto";
import { StatusAgendamento } from "@/enums/StatusAgendamento";
import { useAgendamentosDoDia } from "@/hooks/useDashboard";

const { agendamentos: appointments, total, loading, refreshing } = useAgendamentosDoDia();

const statusConfig: Record<number, { label: string; color: string }> = {
  [StatusAgendamento.Agendado]: { label: "Agendado", color: "purple" },
  [StatusAgendamento.EmAndamento]: { label: "Em Andamento", color: "blue" },
  [StatusAgendamento.Finalizado]: { label: "Finalizado", color: "success" },
  [StatusAgendamento.Cancelado]: { label: "Cancelado", color: "error" },
  [StatusAgendamento.Pendente]: { label: "Pendente", color: "warning" },
  [StatusAgendamento.Disponivel]: { label: "Disponível", color: "grey" },
  [StatusAgendamento.Expirado]: { label: "Expirado", color: "orange" },
};

function getStatusConfig(status: string) {
  const valor = /^\d+$/.test(status)
    ? Number(status)
    : StatusAgendamento[status as keyof typeof StatusAgendamento];
  return statusConfig[valor] ?? { label: status, color: "grey" };
}

function titulo(apt: AgendamentoAdminResponse) {
  return apt.motoristaNome || apt.fornecedorNome || "Motorista não informado";
}

function detalhe(apt: AgendamentoAdminResponse) {
  return [
    apt.motoristaNome ? apt.fornecedorNome : null,
    apt.produto,
    apt.placaVeiculo,
  ]
    .filter(Boolean)
    .join(" • ");
}

function formatHora(dateStr: string) {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

const hasData = computed(() => appointments.value.length > 0);
</script>

<style scoped>
.premium-card {
  background: #ffffff;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
}

.apt-scroll::-webkit-scrollbar {
  width: 4px;
}
.apt-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.apt-scroll::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 4px;
}
</style>
