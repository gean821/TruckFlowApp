<template>
  <v-container fluid class="pa-6">
    <CrudTable
      :key="agendamentos.length + '-' + agendamentos[0]?.updatedAt"
      title="Gestão de Agendamentos"
      icon="mdi-calendar-clock"
      subtitle="Acompanhe a grade de horários e status de recebimento"
      :headers="headers"
      :items="agendamentos"
      :loading="loading"
      @abrir-dialog="criarAgendamento"
      @delete="deleteAgendamento"
      @refresh="refresh"
    >
      <template #item.dataInicio="{ item }">
        <div class="d-flex flex-column py-2">
          <div class="d-flex align-center">
            <v-icon
              icon="mdi-clock-outline"
              size="small"
              class="mr-1 text-primary"
            />
            <span class="font-weight-bold text-body-2">
              {{ formatTime(item.dataInicio) }} - {{ formatTime(item.dataFim) }}
            </span>
          </div>
          <span class="text-caption text-grey ml-5">
            {{ formatDate(item.dataInicio) }}
          </span>
        </div>
      </template>

      <template #item.produto="{ value }">
        <v-chip
          size="small"
          color="blue-grey"
          variant="tonal"
          class="font-weight-bold"
        >
          {{ value || "Carga Geral" }}
        </v-chip>
      </template>

      <template #item.fornecedorNome="{ value }">
        <span class="text-body-2 font-weight-medium text-grey-darken-3">
          {{ value }}
        </span>
      </template>

      <template #item.motoristaNome="{ item }">
        <div v-if="item.motoristaNome" class="d-flex flex-column">
          <span class="text-body-2 font-weight-medium">{{
            item.motoristaNome
          }}</span>
          <div class="d-flex align-center mt-1">
            <v-icon
              icon="mdi-truck-outline"
              size="x-small"
              class="mr-1 text-grey"
            />
            <span class="text-caption text-grey-darken-1">{{
              item.placaVeiculo
            }}</span>
          </div>
        </div>
        <div v-else class="text-caption text-grey-lighten-1 font-italic">
          -- Aguardando --
        </div>
      </template>

      <template #item.tipoVeiculo="{ value }">
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-truck-cargo-container"
            size="small"
            class="mr-2 text-grey-darken-1"
          />
          <span class="text-body-2 text-grey-darken-3 text-capitalize">
            {{ formatTipoVeiculo(value) }}
          </span>
        </div>
      </template>

      <template #item.pesoCarga="{ value }">
        <span :class="value > 0 ? 'text-grey-darken-3' : 'text-grey-lighten-1'">
          {{ value > 0 ? value.toLocaleString("pt-BR") : "-" }}
          <small v-if="value > 0">kg</small>
        </span>
      </template>

      <template #item.status="{ value }">
        <v-chip
          size="small"
          :color="getStatusColor(value)"
          variant="flat"
          class="font-weight-bold text-uppercase"
        >
          {{ formatStatus(value) }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-center align-center ga-2">
          <v-tooltip
            text="Registrar Chegada (Check-in)"
            location="top"
            v-if="
              isStatus(item.status, 'Agendado') ||
              isStatus(item.status, 'Confirmado')
            "
          >
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-login-variant"
                color="blue-darken-2"
                variant="tonal"
                size="small"
                v-bind="props"
                @click="handleCheckIn(item)"
                :loading="loadingAction === item.id"
              />
            </template>
          </v-tooltip>

          <v-tooltip
            text="Finalizar Operação (Check-out)"
            location="top"
            v-if="isStatus(item.status, 'EmAndamento')"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-check-all"
                color="green-darken-1"
                variant="tonal"
                size="small"
                v-bind="props"
                @click="handleCheckout(item)"
                :loading="loadingAction === item.id"
              />
            </template>
          </v-tooltip>

          <v-menu
            v-if="
              !isStatus(item.status, 'Finalizado') &&
              !isStatus(item.status, 'Concluido') &&
              !isStatus(item.status, 'Cancelado')
            "
          >
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                variant="text"
                size="small"
                v-bind="props"
              ></v-btn>
            </template>

            <v-list density="compact">
              <v-list-item @click="" prepend-icon="mdi-pencil">
                <v-list-item-title>Editar Dados</v-list-item-title>
              </v-list-item>
              <v-divider class="my-1"></v-divider>
              <v-list-item
                @click="handleCancelar(item)"
                prepend-icon="mdi-cancel"
                base-color="red"
              >
                <v-list-item-title class="text-red"
                  >Cancelar Agendamento</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </CrudTable>

    <AgendamentoAvulsoModal 
      @saved="refresh"
      v-model="showDialogAvulso"
    />

    <ConfirmDialog
      v-model="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :color="confirmDialog.color"
      :icon="confirmDialog.icon"
      :confirm-text="confirmDialog.confirmText"
      :loading="loadingAction === 'dialog'"
      @confirm="executeConfirmAction"
    />
  </v-container>
</template>

<script setup lang="ts">
import CrudTable, {
  type VDataTableHeader,
} from "@/components/data-table/CrudTable.vue";
import { useAgendamentoStore } from "@/stores/AgendamentoStore";
import { computed, ref, onMounted } from "vue";
import { format, parseISO } from "date-fns";
import { TipoVeiculoLabels } from "@/utils/tipoVeiculoLabels";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";
import AgendamentoAvulsoModal from "@/components/modals/AgendamentoAvulsoModal.vue";

const loading = ref(false);
const agendamentoStore = useAgendamentoStore();
const agendamentos = computed(() => agendamentoStore.agendamentos);
const loadingAction = ref<string | null>(null);
const showDialogAvulso = ref<boolean>(false);

const confirmDialog = ref({
  show: false,
  title: "",
  message: "",
  color: "primary",
  icon: "mdi-help-circle-outline",
  confirmText: "Confirmar",
  action: null as (() => Promise<void>) | null,
});

const headers: VDataTableHeader = [
  {
    title: "HORÁRIO / DATA",
    key: "dataInicio",
    width: "200px",
    align: "start",
  },
  { title: "PRODUTO", key: "produto", width: "150px" },
  { title: "FORNECEDOR", key: "fornecedorNome" },
  { title: "MOTORISTA / PLACA", key: "motoristaNome", width: "220px" },
  { title: "Unidade De Entrega", key: "unidadeEntrega", width: "220px" },
  { title: "TIPO VEICULO", key: "tipoVeiculo", width: "220px" },
  { title: "PESO", key: "pesoCarga", align: "end", width: "120px" },
  { title: "STATUS", key: "status", align: "center", width: "140px" },
  {
    title: "AÇÕES",
    key: "actions",
    sortable: false,
    align: "center",
    width: "100px",
  },
];

onMounted(async () => {
  await fetchAgendamentos();

  setInterval(() => {
    fetchAgendamentos();
  }, 30000);
});

function askConfirmation(config: {
  title: string;
  message: string;
  color?: string;
  icon?: string;
  confirmText?: string;
  action: () => Promise<void>;
}) {
  confirmDialog.value = {
    show: true,
    title: config.title,
    message: config.message,
    color: config.color || "primary",
    icon: config.icon || "mdi-help-circle-outline",
    confirmText: config.confirmText || "Confirmar",
    action: config.action,
  };
}

async function fetchAgendamentos() {
  loading.value = true;
  try {
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);

    await agendamentoStore.getByFilters({
      dataInicio: hoje.toISOString().split("T")[0],
      dataFim: proximaSemana.toISOString().split("T")[0],
    });
  } finally {
    loading.value = false;
  }
}

function isStatus(atual: string, esperado: string) {
  return atual?.toLowerCase() === esperado?.toLowerCase();
}

async function refresh() {
  await fetchAgendamentos();
}

function formatTime(dateStr: string) {
  if (!dateStr) return "--:--";
  return format(parseISO(dateStr), "HH:mm");
}

function formatDate(dateStr: string) {
  if (!dateStr) {
    return "-";
  }

  return format(parseISO(dateStr), "dd/MM/yyyy");
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "disponivel":
      return "green-lighten-1";
    case "agendado":
      return "blue-darken-1";
    case "confirmado":
      return "indigo-darken-1";
    case "concluido":
      return "grey-darken-2";
    case "cancelado":
      return "red-lighten-1";
    default:
      return "grey";
  }
}

async function handleCheckIn(item: any) {
  askConfirmation({
    title: "Confirmar Check-in",
    message: `Deseja registrar a entrada do veículo ${item.placaVeiculo || "sem placa"}?`,
    color: "blue-darken-2",
    icon: "mdi-login-variant",
    confirmText: "Confirmar Entrada",
    action: async () => {
      await agendamentoStore.realizarCheckIn(item.id);
      await fetchAgendamentos();
    },
  });
}

async function handleCheckout(item: any) {
  askConfirmation({
    title: "Finalizar Operação",
    message: "Confirmar liberação do veículo e conclusão da descarga?",
    color: "green-darken-1",
    icon: "mdi-check-all",
    confirmText: "Finalizar",
    action: async () => {
      await agendamentoStore.realizarCheckOut(item.id);
      await fetchAgendamentos();
    },
  });
}

async function handleCancelar(item: any) {
  askConfirmation({
    title: "Cancelar Agendamento",
    message: "Esta ação irá remover o agendamento da grade. Deseja continuar?",
    color: "error",
    icon: "mdi-cancel",
    confirmText: "Sim, Cancelar",
    action: async () => {
      await agendamentoStore.cancelarAgendamento(item.id);
      await fetchAgendamentos();
    },
  });
}

async function executeConfirmAction() {
  if (confirmDialog.value.action) {
    loadingAction.value = "dialog";
    try {
      await confirmDialog.value.action();
      confirmDialog.value.show = false;
    } catch (e: any) {
      alert(e.response?.data?.message || "Erro na operação");
    } finally {
      loadingAction.value = null;
    }
  }
}

async function deleteAgendamento(id: string) {
  if (confirm("Deseja realmente cancelar este horário?")) {
    await agendamentoStore.DeleteAgendamento(id);
  }
}

function formatTipoVeiculo(tipo: any) {
  if (!tipo) {
    return "-";
  }

  return TipoVeiculoLabels[tipo.toString()] || tipo;
}

function formatStatus(status: string) {
  if (!status) {
    return "-";
  }

  return status.replace(/([A-Z])/g, " $1").trim();
}

const criarAgendamento = () => {
  showDialogAvulso.value = true;
};
</script>
