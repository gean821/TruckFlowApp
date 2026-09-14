<template>
  <v-container fluid style="padding: 24px;">
    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10);">

      <div style="background: linear-gradient(135deg, #0e2f5a 0%, #195FA0 100%); padding: 24px 28px; position: relative; overflow: hidden;">
        <div style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); opacity: 0.05; pointer-events: none;">
          <v-icon size="200" color="white">mdi-calendar-clock</v-icon>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; position: relative; z-index: 1;">
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            <div style="background: rgba(255,255,255,0.12); border-radius: 12px; padding: 10px 11px; flex-shrink: 0;">
              <v-icon color="white" size="24">mdi-calendar-clock</v-icon>
            </div>
            <div>
              <div style="font-size: 0.62rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px; display: flex; align-items: center; gap: 5px;">
                <v-icon size="9" color="rgba(255,255,255,0.5)">mdi-square</v-icon>
                GESTÃO DE AGENDAMENTOS
              </div>
              <div style="font-size: 1.4rem; font-weight: 800; color: white; line-height: 1.15; letter-spacing: -0.3px;">Agendamentos</div>
              <div style="font-size: 0.77rem; color: rgba(255,255,255,0.6); margin-top: 4px;">Acompanhe a grade de horários e status de recebimento</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; position: relative; z-index: 1;">
            <v-btn-toggle
              v-model="periodoPreset"
              density="compact"
              color="white"
              variant="outlined"
              mandatory
              divided
              style="border-radius: 8px;"
            >
              <v-btn value="hoje" size="small" style="color: rgba(255,255,255,0.88); font-size: 0.72rem; letter-spacing: 0;">Hoje</v-btn>
              <v-btn value="semana" size="small" style="color: rgba(255,255,255,0.88); font-size: 0.72rem; letter-spacing: 0;">Semana</v-btn>
              <v-btn value="proxima" size="small" style="color: rgba(255,255,255,0.88); font-size: 0.72rem; letter-spacing: 0;">Próx. 7</v-btn>
              <v-btn value="custom" size="small" style="color: rgba(255,255,255,0.88); font-size: 0.72rem; letter-spacing: 0;">Custom</v-btn>
            </v-btn-toggle>

            <v-btn icon variant="text" :loading="isFetching" style="color: white;" @click="refetch()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>

            <v-btn
              prepend-icon="mdi-file-delimited-outline"
              variant="outlined"
              size="small"
              style="height: 36px; border-radius: 8px; text-transform: none; font-weight: 600; letter-spacing: 0; color: white; border-color: rgba(255,255,255,0.35);"
              :loading="csvLoading"
              :disabled="csvCooldown > 0"
              @click="exportCsv"
            >
              {{ csvCooldown > 0 ? `CSV (${csvCooldown}s)` : 'Exportar CSV' }}
            </v-btn>

            <v-btn
              v-if="canManageGrade"
              prepend-icon="mdi-plus"
              elevation="0"
              style="height: 36px; border-radius: 8px; text-transform: none; font-weight: 700; letter-spacing: 0; padding: 0 20px; background: rgba(255,255,255,0.15); color: white;"
              @click="criarAgendamento"
            >
              Agendamento Avulso
            </v-btn>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 10px; position: relative; z-index: 1;">
          <v-text-field
            v-model="search"
            density="compact"
            variant="solo"
            label="Buscar (placa, motorista, produto, fornecedor...)"
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 260px; flex: 1 1 260px;"
            clearable
            flat
          />
          <v-text-field
            v-model="filtroDataInicio"
            type="date"
            label="Início"
            density="compact"
            variant="solo"
            hide-details
            flat
            style="max-width: 160px;"
            :disabled="periodoPreset !== 'custom'"
          />
          <v-text-field
            v-model="filtroDataFim"
            type="date"
            label="Fim"
            density="compact"
            variant="solo"
            hide-details
            flat
            style="max-width: 160px;"
            :disabled="periodoPreset !== 'custom'"
          />
          <v-autocomplete
            v-model="filtroFornecedor"
            :items="fornecedores"
            item-title="nome"
            item-value="id"
            label="Fornecedor"
            density="compact"
            variant="solo"
            hide-details
            flat
            style="max-width: 200px;"
            clearable
            placeholder="Todos"
          />
          <v-autocomplete
            v-model="filtroUnidade"
            :items="unidades"
            item-title="nome"
            item-value="id"
            label="Unidade Entrega"
            density="compact"
            variant="solo"
            hide-details
            flat
            style="max-width: 200px;"
            clearable
            placeholder="Todas"
          />
          <v-autocomplete
            v-model="filtroProduto"
            :items="produtos"
            item-title="nome"
            item-value="id"
            label="Produto"
            density="compact"
            variant="solo"
            hide-details
            flat
            style="max-width: 180px;"
            clearable
            placeholder="Todos"
          />
          <v-select
            v-model="filtroStatus"
            :items="statusOptions"
            label="Status"
            density="compact"
            variant="solo"
            hide-details
            flat
            style="max-width: 170px;"
            clearable
            placeholder="Todos"
          />
          <v-select
            v-model="filtroTipoVeiculo"
            :items="tipoVeiculoOptions"
            label="Tipo Veículo"
            density="compact"
            variant="solo"
            hide-details
            flat
            style="max-width: 190px;"
            clearable
            placeholder="Todos"
          />
        </div>
      </div>

      <div style="background: #f4f6f9; min-height: 200px; padding: 20px;">

        <div v-if="isLoading" style="background: white; border-radius: 14px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <v-skeleton-loader type="list-item-two-line@8" />
        </div>

        <div
          v-else-if="!data?.items?.length"
          style="background: white; border-radius: 14px; padding: 64px 24px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06);"
        >
          <v-icon size="52" style="opacity: 0.18; display: block; margin: 0 auto 14px; color: #195FA0;">mdi-calendar-remove-outline</v-icon>
          <div style="font-size: 0.9rem; color: #aaa; font-weight: 500;">Nenhum agendamento encontrado para os filtros selecionados.</div>
        </div>

        <div v-else>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
            <span
              v-for="(count, status) in statusCounts"
              :key="status"
              style="display: inline-flex; align-items: center; gap: 5px; border-radius: 20px; padding: 5px 14px; font-size: 0.72rem; font-weight: 700; white-space: nowrap;"
              :style="getStatusInlineStyle(String(status))"
            >
              <v-icon size="12">{{ getStatusIcon(String(status)) }}</v-icon>
              {{ formatStatus(String(status)) }} · {{ count }}
            </span>
          </div>

          <div
            v-for="item in data.items"
            :key="item.id"
            :style="`background: white; border-radius: 16px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.06); border-left: 4px solid ${getStatusAccentColor(item.status)};`"
          >
            <div style="padding: 18px 20px 14px; display: flex; align-items: flex-start; gap: 14px;">

              <div
                :style="`background: ${getStatusAvatarColor(item.status)}; border-radius: 50%; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;`"
              >
                <v-icon color="white" size="22">{{ getStatusIcon(item.status) }}</v-icon>
              </div>

              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                  <div style="min-width: 0;">
                    <div style="font-size: 0.95rem; font-weight: 700; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      {{ item.fornecedorNome || '—' }}
                    </div>
                    <div style="font-size: 0.77rem; color: #aaa; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      @ {{ item.motoristaNome || 'Aguardando motorista' }}
                    </div>
                  </div>
                  <span style="font-size: 0.71rem; color: #bbb; white-space: nowrap; flex-shrink: 0; margin-top: 2px;">
                    {{ formatDate(item.dataInicio) }}
                  </span>
                </div>

                <div style="margin-top: 10px;">
                  <span
                    :style="`display: inline-flex; align-items: center; gap: 5px; border-radius: 20px; padding: 4px 11px; font-size: 0.73rem; font-weight: 600; color: white; background: ${getStatusAvatarColor(item.status)};`"
                  >
                    <v-icon size="12" color="white">mdi-clock-outline</v-icon>
                    {{ formatTime(item.dataInicio) }} — {{ formatTime(item.dataFim) }}
                  </span>
                </div>

                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 9px;">
                  <span style="background: #eef2f8; color: #195FA0; border-radius: 20px; padding: 3px 10px; font-size: 0.7rem; font-weight: 700; white-space: nowrap;">
                    {{ item.produto || 'Carga Geral' }}
                  </span>

                  <div
                    v-if="item.placaVeiculo"
                    style="display: flex; align-items: center; gap: 3px; font-size: 0.7rem; color: #555; background: #f5f5f5; border-radius: 20px; padding: 3px 10px; font-family: monospace; letter-spacing: 0.3px; white-space: nowrap;"
                  >
                    <v-icon size="11" color="grey-darken-1">mdi-truck-outline</v-icon>
                    {{ item.placaVeiculo }}
                  </div>

                  <div
                    v-if="item.localDescarga"
                    style="display: flex; align-items: center; gap: 3px; font-size: 0.7rem; color: #555; background: #f5f5f5; border-radius: 20px; padding: 3px 10px; white-space: nowrap;"
                  >
                    <v-icon size="11" color="grey-darken-1">mdi-map-marker-outline</v-icon>
                    {{ item.localDescarga }}
                  </div>

                  <div
                    v-if="item.unidadeEntrega"
                    style="display: flex; align-items: center; gap: 3px; font-size: 0.7rem; color: #555; background: #f5f5f5; border-radius: 20px; padding: 3px 10px; white-space: nowrap;"
                  >
                    <v-icon size="11" color="grey-darken-1">mdi-warehouse</v-icon>
                    {{ item.unidadeEntrega }}
                  </div>

                  <div style="margin-left: auto; flex-shrink: 0;">
                    <span
                      style="border-radius: 20px; padding: 4px 12px; font-size: 0.67rem; font-weight: 700; white-space: nowrap; display: inline-block;"
                      :style="getStatusInlineStyle(item.status)"
                    >
                      {{ formatStatus(item.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style="height: 1px; background: #f0f0f0; margin: 0 20px;"></div>

            <div style="padding: 8px 14px; display: flex; justify-content: flex-end; align-items: center; gap: 2px;">
              <v-tooltip
                v-if="canCheckIn && (isStatus(item.status, 'Agendado') || isStatus(item.status, 'Confirmado'))"
                text="Registrar Chegada (Check-in)"
                location="top"
              >
                <template v-slot:activator="{ props }">
                  <v-btn icon size="small" variant="text" color="blue-darken-2" v-bind="props" @click="handleCheckIn(item)">
                    <v-icon size="18">mdi-login-variant</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip
                v-if="canCheckIn && isStatus(item.status, 'EmAndamento')"
                text="Finalizar Operação (Check-out)"
                location="top"
              >
                <template v-slot:activator="{ props }">
                  <v-btn icon size="small" variant="text" color="green-darken-1" v-bind="props" @click="handleCheckout(item)">
                    <v-icon size="18">mdi-check-all</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip v-if="canManageGrade && item.status !== 'Finalizado' && item.status !== 'EmAndamento'"  text="Editar Agendamento" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="grey-darken-1"
                    v-bind="props"
                    @click="handleEditar(item)"
                  >
                    <v-icon size="18">mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip
                v-if="canManageGrade && item.motoristaNome"
                text="Enviar mensagem ao motorista"
                location="top"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="primary"
                    v-bind="props"
                    @click="abrirComunicacao(item)"
                  >
                    <v-icon size="18">mdi-message-text-outline</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip v-if="canManageGrade" text="Cancelar Agendamento" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="red-darken-1"
                    v-bind="props"
                    @click="handleCancelar(item)"
                  >
                    <v-icon size="18">mdi-account-cancel-outline</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>

          <div style="display: flex; justify-content: center; align-items: center; gap: 16px; padding: 16px 0 4px;">
            <v-pagination
              v-model="page"
              :length="totalPages"
              :total-visible="7"
              density="compact"
              rounded="circle"
              color="primary"
            />
            <span style="font-size: 0.75rem; color: #aaa; white-space: nowrap;">
              {{ data?.totalCount ?? 0 }} agendamento{{ (data?.totalCount ?? 0) !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <AgendamentoAvulsoModal @saved="refetch()" v-model="showDialogAvulso" />

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

    <v-dialog v-model="finalizarDialog.show" max-width="480" persistent>
      <v-card rounded="xl" elevation="8">
        <div style="background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%); padding: 20px 24px; display: flex; align-items: center; gap: 10px;">
          <div style="background: rgba(255,255,255,0.2); border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <v-icon color="white" size="20">mdi-check-all</v-icon>
          </div>
          <div>
            <div style="font-size: 1rem; font-weight: 700; color: white;">Finalizar Operação</div>
            <div style="font-size: 0.72rem; color: rgba(255,255,255,0.72); margin-top: 1px;">Confirme a quantidade recebida</div>
          </div>
          <v-spacer />
          <v-btn icon variant="text" color="white" size="small" @click="finalizarDialog.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text style="padding: 20px 24px;">
          <p style="font-size: 0.85rem; color: #777; margin-bottom: 16px;">
            Pré-preenchido com o peso da NF; ajuste se houve divergência na balança.
          </p>
          <div style="background: #f5f5f5; padding: 12px 14px; border-radius: 10px; margin-bottom: 16px; font-size: 0.8rem; color: #555; display: flex; flex-direction: column; gap: 4px;">
            <div><strong>Placa:</strong> {{ finalizarDialog.placa || '—' }}</div>
            <div><strong>Produto:</strong> {{ finalizarDialog.produto || '—' }}</div>
            <div>
              <strong>Reservado (NF):</strong>
              {{ Number(finalizarDialog.pesoReservado).toLocaleString('pt-BR', { maximumFractionDigits: 3 }) }} kg
            </div>
          </div>
          <v-text-field
            v-model.number="finalizarDialog.quantidade"
            type="number"
            label="Quantidade real recebida (kg)"
            variant="outlined"
            density="compact"
            :min="0"
            :step="0.001"
            autofocus
            :error-messages="finalizarDialog.quantidade > 0 ? '' : 'Informe uma quantidade maior que zero.'"
          />
        </v-card-text>

        <v-card-actions style="padding: 12px 20px 20px;">
          <v-spacer />
          <v-btn variant="text" :disabled="isFinalizando" @click="finalizarDialog.show = false">Cancelar</v-btn>
          <v-btn
            color="green-darken-1"
            variant="flat"
            rounded="lg"
            :loading="isFinalizando"
            :disabled="!(finalizarDialog.quantidade > 0)"
            @click="confirmarFinalizacao"
          >
            Confirmar Recebimento
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { format, parseISO } from "date-fns";
import { useRoute, useRouter } from "vue-router";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";

import type IAgendamentoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";
import { useAgendamentoQuery } from "@/queries/agendamento.queries";
import { AgendamentoService } from "@/services/AgendamentoService";
import { useAgendamento } from "@/hooks/useAgendamento";
import { useFornecedor } from "@/hooks/useFornecedor";
import { useUnidadeEntrega } from "@/hooks/useUnidadeEntrega";
import { useProduto } from "@/hooks/useProdutos";
import { TipoVeiculoLabels } from "@/utils/tipoVeiculoLabels";
import { usePermissions } from "@/hooks/usePermissions";
import AgendamentoAvulsoModal from "@/components/modals/AgendamentoAvulsoModal.vue";
import { useComunicacaoDialogStore } from "@/stores/ComunicacaoDialogStore";

type PeriodoPreset = "hoje" | "semana" | "proxima" | "custom";

const route = useRoute();
const router = useRouter();
const { canManageGrade, canCheckIn } = usePermissions();

const agendamentoService = AgendamentoService();

const { fornecedores } = useFornecedor();
const { unidades } = useUnidadeEntrega();
const { produtos } = useProduto();
const { checkIn, finalizar, cancelar, isFinalizando } = useAgendamento();

const search = ref(route.query.search?.toString() || "");
const searchDebounced = ref(search.value);

const periodoPreset = ref<PeriodoPreset>(
  (route.query.periodo?.toString() as PeriodoPreset) || "semana",
);
const filtroDataInicio = ref(route.query.dataInicio?.toString() || "");
const filtroDataFim = ref(route.query.dataFim?.toString() || "");

const filtroFornecedor = ref(route.query.fornecedor?.toString() || null);
const filtroUnidade = ref(route.query.unidade?.toString() || null);
const filtroProduto = ref(route.query.produto?.toString() || null);
const filtroStatus = ref(route.query.status?.toString() || null);
const filtroTipoVeiculo = ref<number | null>(
  route.query.tipoVeiculo ? Number(route.query.tipoVeiculo) : null,
);

const page = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.pageSize) || 20);

const showDialogAvulso = ref(false);

const comunicacaoDialog = useComunicacaoDialogStore();

function abrirComunicacao(item: {
  id: string;
  motoristaNome?: string | null;
  motoristaTelefone?: string | null;
}) {
  comunicacaoDialog.abrir(
    item.id,
    item.motoristaNome ?? null,
    item.motoristaTelefone ?? null);
}

if (route.query.agendamentoId) {
  comunicacaoDialog.abrir(route.query.agendamentoId.toString());
}

const loadingAction = ref<string | null>(null);
const csvLoading = ref(false);
const csvCooldown = ref(0);
let csvCooldownTimer: ReturnType<typeof setInterval> | null = null;

const confirmDialog = ref({
  show: false,
  title: "",
  message: "",
  color: "primary",
  icon: "mdi-help-circle-outline",
  confirmText: "Confirmar",
  action: null as (() => Promise<void>) | null,
});

const finalizarDialog = ref({
  show: false,
  agendamentoId: "" as string,
  placa: "" as string,
  produto: "" as string,
  pesoReservado: 0 as number,
  quantidade: 0 as number,
});

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchDebounced.value = (val ?? "").toString();
  }, 350);
});

function applyPreset(preset: PeriodoPreset): { inicio: string; fim: string } {
  const hoje = new Date();
  const toIso = (d: Date) => format(d, "yyyy-MM-dd");

  if (preset === "hoje") return { inicio: toIso(hoje), fim: toIso(hoje) };

  if (preset === "semana") {
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - hoje.getDay());
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    return { inicio: toIso(inicio), fim: toIso(fim) };
  }

  if (preset === "proxima") {
    const fim = new Date(hoje);
    fim.setDate(hoje.getDate() + 7);
    return { inicio: toIso(hoje), fim: toIso(fim) };
  }

  return { inicio: filtroDataInicio.value, fim: filtroDataFim.value };
}

watch(periodoPreset, (preset) => {
  if (preset !== "custom") {
    const { inicio, fim } = applyPreset(preset);
    filtroDataInicio.value = inicio;
    filtroDataFim.value = fim;
  }
}, { immediate: true });

watch(
  [searchDebounced, periodoPreset, filtroDataInicio, filtroDataFim,
   filtroFornecedor, filtroUnidade, filtroProduto, filtroStatus, filtroTipoVeiculo],
  () => { page.value = 1; },
);

const params = computed<IAgendamentoFilterDto>(() => ({
  search: searchDebounced.value || undefined,
  dataInicio: filtroDataInicio.value ? `${filtroDataInicio.value}T00:00:00` : undefined,
  dataFim: filtroDataFim.value ? `${filtroDataFim.value}T23:59:59.999` : undefined,
  fornecedorId: filtroFornecedor.value || undefined,
  unidadeEntregaId: filtroUnidade.value || undefined,
  produtoId: filtroProduto.value || undefined,
  status: filtroStatus.value || undefined,
  tipoVeiculo:
    filtroTipoVeiculo.value !== null && filtroTipoVeiculo.value !== undefined
      ? Number(filtroTipoVeiculo.value)
      : undefined,
  pageNumber: page.value,
  pageSize: pageSize.value,
}));

const { data, isLoading, isFetching, refetch } = useAgendamentoQuery(params, {
  refetchInterval: 30_000,
});

const totalPages = computed(() =>
  Math.ceil((data.value?.totalCount ?? 0) / pageSize.value),
);

watch(
  [searchDebounced, periodoPreset, filtroDataInicio, filtroDataFim,
   filtroFornecedor, filtroUnidade, filtroProduto, filtroStatus, filtroTipoVeiculo, page, pageSize],
  () => {
    router.replace({
      query: {
        search: searchDebounced.value || undefined,
        periodo: periodoPreset.value !== "semana" ? periodoPreset.value : undefined,
        dataInicio: periodoPreset.value === "custom" ? filtroDataInicio.value || undefined : undefined,
        dataFim: periodoPreset.value === "custom" ? filtroDataFim.value || undefined : undefined,
        fornecedor: filtroFornecedor.value || undefined,
        unidade: filtroUnidade.value || undefined,
        produto: filtroProduto.value || undefined,
        status: filtroStatus.value || undefined,
        tipoVeiculo: filtroTipoVeiculo.value !== null && filtroTipoVeiculo.value !== undefined
          ? String(filtroTipoVeiculo.value) : undefined,
        page: page.value !== 1 ? page.value : undefined,
        pageSize: pageSize.value !== 20 ? pageSize.value : undefined,
      },
    });
  },
);

const statusOptions = [
  { title: "Disponível", value: "Disponivel" },
  { title: "Pendente", value: "Pendente" },
  { title: "Agendado", value: "Agendado" },
  { title: "Em Andamento", value: "EmAndamento" },
  { title: "Finalizado", value: "Finalizado" },
  { title: "Cancelado", value: "Cancelado" },
  { title: "Expirado", value: "Expirado" },
];

const tipoVeiculoOptions = computed(() =>
  Object.entries(TipoVeiculoLabels).map(([value, title]) => ({
    title,
    value: Number(value),
  })),
);

const statusCounts = computed(() => {
  const items = data.value?.items ?? [];
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = item.status?.toLowerCase() ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
});

function getStatusIcon(status: string): string {
  const map: Record<string, string> = {
    disponivel: "mdi-check-circle",
    pendente: "mdi-clock-alert",
    agendado: "mdi-calendar-check",
    confirmado: "mdi-calendar-check",
    emandamento: "mdi-truck-fast",
    finalizado: "mdi-check-all",
    concluido: "mdi-check-all",
    cancelado: "mdi-close-circle",
    expirado: "mdi-clock-remove",
  };
  return map[status?.toLowerCase()] ?? "mdi-calendar";
}

function getStatusInlineStyle(status: string) {
  const map: Record<string, string> = {
    disponivel: "background: #e8f5e9; color: #2e7d32;",
    pendente: "background: #fff8e1; color: #f57f17;",
    agendado: "background: #e3f2fd; color: #1565c0;",
    confirmado: "background: #e8eaf6; color: #3949ab;",
    emandamento: "background: #fff3e0; color: #e65100;",
    finalizado: "background: #f3e5f5; color: #6a1b9a;",
    concluido: "background: #f3e5f5; color: #6a1b9a;",
    cancelado: "background: #fce4ec; color: #b71c1c;",
    expirado: "background: #f5f5f5; color: #757575;",
  };
  return map[status?.toLowerCase()] ?? "background: #f5f5f5; color: #666;";
}

function getStatusAvatarColor(status: string) {
  const map: Record<string, string> = {
    disponivel: "#43a047",
    pendente: "#fb8c00",
    agendado: "#195FA0",
    confirmado: "#3949ab",
    emandamento: "#e65100",
    finalizado: "#7b1fa2",
    concluido: "#7b1fa2",
    cancelado: "#e53935",
    expirado: "#9e9e9e",
  };
  return map[status?.toLowerCase()] ?? "#195FA0";
}

function getStatusAccentColor(status: string) {
  const map: Record<string, string> = {
    disponivel: "#43a047",
    pendente: "#fb8c00",
    agendado: "#195FA0",
    confirmado: "#3949ab",
    emandamento: "#e65100",
    finalizado: "#7b1fa2",
    concluido: "#7b1fa2",
    cancelado: "#e53935",
    expirado: "#bdbdbd",
  };
  return map[status?.toLowerCase()] ?? "#195FA0";
}

async function exportCsv() {
  if (csvCooldown.value > 0 || csvLoading.value) return;
  csvLoading.value = true;
  try {
    const result = await agendamentoService.getByFilters({ ...params.value, pageNumber: 1, pageSize: 1000 });
    const items = result.items ?? [];
    const header = ["Horário Início", "Horário Fim", "Data", "Produto", "Fornecedor",
      "Motorista", "Placa", "Unidade Entrega", "Doca", "Tipo Veículo", "Peso (kg)", "Status"];
    const rows = items.map((i: any) => [
      formatTime(i.dataInicio), formatTime(i.dataFim), formatDate(i.dataInicio),
      i.produto || "", i.fornecedorNome || "", i.motoristaNome || "", i.placaVeiculo || "",
      i.unidadeEntrega || "", i.localDescarga || "", formatTipoVeiculo(i.tipoVeiculo),
      Number(i.pesoCarga || 0) > 0 ? String(i.pesoCarga) : "", formatStatus(i.status),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agendamentos_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    csvCooldown.value = 30;
    csvCooldownTimer = setInterval(() => {
      csvCooldown.value--;
      if (csvCooldown.value <= 0) { clearInterval(csvCooldownTimer!); csvCooldownTimer = null; }
    }, 1000);
  } finally {
    csvLoading.value = false;
  }
}

onUnmounted(() => { if (csvCooldownTimer) clearInterval(csvCooldownTimer); });

function askConfirmation(config: {
  title: string; message: string; color?: string; icon?: string;
  confirmText?: string; action: () => Promise<void>;
}) {
  confirmDialog.value = {
    show: true, title: config.title, message: config.message,
    color: config.color || "primary", icon: config.icon || "mdi-help-circle-outline",
    confirmText: config.confirmText || "Confirmar", action: config.action,
  };
}

async function handleCheckIn(item: any) {
  askConfirmation({
    title: "Confirmar Check-in",
    message: `Deseja registrar a entrada do veículo ${item.placaVeiculo || "sem placa"}?`,
    color: "blue-darken-2", icon: "mdi-login-variant", confirmText: "Confirmar Entrada",
    action: async () => { await checkIn(item.id); await refetch(); },
  });
}

function handleCheckout(item: any) {
  const peso = Number(item.pesoCarga) > 0 ? Number(item.pesoCarga) : 0;
  finalizarDialog.value = {
    show: true, agendamentoId: item.id, placa: item.placaVeiculo ?? "",
    produto: item.produto ?? "", pesoReservado: peso, quantidade: peso,
  };
}

async function confirmarFinalizacao() {
  const { agendamentoId, quantidade } = finalizarDialog.value;
  if (!agendamentoId || !(quantidade > 0)) return;
  try {
    await finalizar({ id: agendamentoId, quantidadeRecebida: quantidade });
    finalizarDialog.value.show = false;
    await refetch();
  } catch {}
}

async function handleCancelar(item: any) {
  askConfirmation({
    title: "Cancelar Agendamento",
    message: "Esta ação irá remover o agendamento da grade. Deseja continuar?",
    color: "error", icon: "mdi-cancel", confirmText: "Sim, Cancelar",
    action: async () => { await cancelar(item.id); await refetch(); },
  });
}

function handleEditar(_item: any) {}

async function executeConfirmAction() {
  if (!confirmDialog.value.action) return;
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

function isStatus(atual: string, esperado: string) {
  return atual?.toLowerCase() === esperado?.toLowerCase();
}

function formatTime(dateStr: string) {
  if (!dateStr) return "--:--";
  return format(parseISO(dateStr), "HH:mm");
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return format(parseISO(dateStr), "dd/MM/yyyy");
}

function formatTipoVeiculo(tipo: any) {
  if (tipo === null || tipo === undefined || tipo === "") return "-";
  if (typeof tipo === "string" && isNaN(Number(tipo))) return tipo.replace(/([A-Z])/g, " $1").trim();
  const key = Number(tipo);
  return TipoVeiculoLabels[key] || String(tipo);
}

function formatStatus(status: string) {
  if (!status) return "-";
  return status.replace(/([A-Z])/g, " $1").trim();
}

function criarAgendamento() {
  showDialogAvulso.value = true;
}
</script>
