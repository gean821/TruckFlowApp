<template>
  <v-dialog :model-value="modelValue" max-width="980" scrollable @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="agendamento" class="rounded-xl detalhe">
      <div class="pa-5 pb-4 d-flex align-start justify-space-between cabecalho">
        <div>
          <div class="text-overline text-primary font-weight-bold">Agendamento</div>
          <div class="d-flex align-center flex-wrap" style="gap: 10px">
            <span class="text-h5 font-weight-bold text-grey-darken-4 placa">{{ agendamento.placaVeiculo || "Sem placa" }}</span>
            <v-chip :color="status.cor" variant="flat" size="small" :prepend-icon="status.icone" class="font-weight-medium">{{ agendamento.statusRotulo }}</v-chip>
            <v-chip v-if="situacao" :color="situacao.cor" variant="tonal" size="small" :prepend-icon="situacao.icone">{{ situacao.rotulo }}</v-chip>
            <v-chip variant="outlined" size="small" :prepend-icon="agendamento.origem === 'Grade' ? 'mdi-calendar-blank-outline' : 'mdi-lightning-bolt-outline'">
              {{ agendamento.origem === "Grade" ? "Pela grade" : "Avulso" }}
            </v-chip>
          </div>
          <div class="text-body-2 text-grey-darken-1 mt-1">
            <v-icon size="16" class="mr-1">mdi-calendar-clock</v-icon>{{ formatarJanela(agendamento.dataInicio, agendamento.dataFim) }}
            <template v-if="agendamento.localDescarga"> • {{ agendamento.localDescarga }}</template>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="emit('update:modelValue', false)" />
      </div>

      <v-divider />

      <v-card-text class="pa-5">
        <v-row>
          <v-col cols="12" md="7">
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2">Ciclo do caminhão</div>
            <v-timeline side="end" density="compact" truncate-line="both" class="ciclo">
              <v-timeline-item
                v-for="passo in passos"
                :key="passo.titulo"
                :dot-color="passo.horario ? passo.cor : 'grey-lighten-2'"
                size="small"
                :icon="passo.icone"
              >
                <div class="d-flex justify-space-between align-start" style="gap: 8px">
                  <div>
                    <div class="text-body-2 font-weight-medium" :class="passo.horario ? 'text-grey-darken-4' : 'text-grey'">{{ passo.titulo }}</div>
                    <div v-if="passo.intervalo" class="text-caption text-grey-darken-1">{{ passo.intervalo }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-body-2 font-weight-bold" :class="passo.horario ? 'text-grey-darken-3' : 'text-grey'">
                      {{ passo.horario ? formatarDataHora(passo.horario) : "—" }}
                    </div>
                    <v-chip v-if="passo.horario && passo.estimado" size="x-small" variant="tonal" color="amber-darken-3">estimado</v-chip>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>

            <div class="tempos d-flex rounded-lg mt-1">
              <div class="flex-grow-1 text-center pa-3">
                <div class="text-caption text-grey-darken-1">Espera</div>
                <div class="text-h6 font-weight-bold">{{ formatarDuracao(agendamento.esperaMin) }}</div>
              </div>
              <div class="flex-grow-1 text-center pa-3">
                <div class="text-caption text-grey-darken-1">Descarga</div>
                <div class="text-h6 font-weight-bold">{{ formatarDuracao(agendamento.descargaMin) }}</div>
              </div>
              <div class="flex-grow-1 text-center pa-3">
                <div class="text-caption text-grey-darken-1">Permanência</div>
                <div class="text-h6 font-weight-bold">{{ formatarDuracao(agendamento.permanenciaMin) }}</div>
              </div>
            </div>
            <div v-if="agendamento.atrasoChegadaMin !== null" class="text-caption text-grey-darken-1 mt-2">
              <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>Chegou {{ descreverAtraso(agendamento.atrasoChegadaMin) }}.
            </div>
            <div v-if="agendamento.inicioEstimado || agendamento.saidaEstimada" class="text-caption text-grey-darken-1 mt-1">
              <v-icon size="14" class="mr-1">mdi-calculator-variant-outline</v-icon>Horários estimados pela chegada, pelo fim da descarga e pelo caminhão anterior na mesma doca.
            </div>
          </v-col>

          <v-col cols="12" md="5">
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2">Dados</div>
            <div class="dados rounded-lg px-4 py-2">
              <div v-for="item in dados" :key="item.rotulo" class="d-flex justify-space-between py-2 linha-dado" style="gap: 12px">
                <span class="text-body-2 text-grey-darken-1 text-no-wrap"><v-icon size="16" class="mr-2">{{ item.icone }}</v-icon>{{ item.rotulo }}</span>
                <span class="text-body-2 font-weight-medium text-grey-darken-4 text-right">{{ item.valor }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <template v-if="whatsapp || podeConferir">
        <v-divider />
        <v-card-actions class="pa-4 justify-end" style="gap: 8px">
          <v-btn
            v-if="whatsapp"
            :href="whatsapp"
            target="_blank"
            rel="noopener"
            variant="tonal"
            color="success"
            prepend-icon="mdi-whatsapp"
            rounded="lg"
            class="text-none"
          >
            Falar com o motorista
          </v-btn>
          <v-btn
            v-if="podeConferir"
            :to="{ name: 'conferencia', params: { agendamentoId: agendamento.id } }"
            variant="flat"
            color="primary"
            prepend-icon="mdi-clipboard-check-outline"
            rounded="lg"
            class="text-none"
          >
            Abrir conferência
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { AgendamentoDetalhado } from "@/entities/relatorioAgendamentos.types";
import { descreverAtraso, linhaDoTempo, linkWhatsapp, metaSituacao, metaStatus } from "@/components/relatorios/agendamentosDetalhado";
import { formatarDuracao, formatarNumero } from "@/utils/relatorioFormat";

const props = defineProps<{ modelValue: boolean; agendamento: AgendamentoDetalhado | null }>();
const emit = defineEmits<{ "update:modelValue": [valor: boolean] }>();

const status = computed(() => metaStatus(props.agendamento?.status ?? ""));
const situacao = computed(() => metaSituacao(props.agendamento?.situacaoChegada ?? null));
const passos = computed(() => (props.agendamento ? linhaDoTempo(props.agendamento) : []));
const whatsapp = computed(() => linkWhatsapp(props.agendamento?.motoristaTelefone ?? null));
const podeConferir = computed(() => ["EmAndamento", "Finalizado"].includes(props.agendamento?.status ?? ""));

const dados = computed(() => {
  const a = props.agendamento;
  if (!a) return [];
  return [
    { rotulo: "Motorista", valor: a.motoristaNome || "—", icone: "mdi-account-outline" },
    { rotulo: "Telefone", valor: a.motoristaTelefone || "—", icone: "mdi-phone-outline" },
    { rotulo: "Veículo", valor: a.tipoVeiculo || "—", icone: "mdi-truck-outline" },
    { rotulo: "Fornecedor", valor: a.fornecedorNome || "—", icone: "mdi-domain" },
    { rotulo: "Produto", valor: a.produto, icone: "mdi-package-variant-closed" },
    { rotulo: "Nota fiscal", valor: a.notaFiscalNumero ? String(a.notaFiscalNumero) : "—", icone: "mdi-receipt-text-outline" },
    { rotulo: "Carga", valor: a.pesoKg ? `${formatarNumero(a.pesoKg)} kg` : "—", icone: "mdi-weight-kilogram" },
    { rotulo: "Unidade", valor: a.unidadeEntrega || "—", icone: "mdi-factory" },
    { rotulo: "Doca", valor: a.localDescarga || "—", icone: "mdi-garage-variant" },
  ];
});

const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

const formatarJanela = (inicio: string, fim: string) => {
  const dia = new Date(inicio).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", timeZone: "America/Sao_Paulo" });
  const hora = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)}, ${hora(inicio)} às ${hora(fim)}`;
};
</script>

<style scoped>
.placa {
  letter-spacing: 0.04em;
}
.cabecalho {
  background: linear-gradient(180deg, rgba(25, 95, 160, 0.06), transparent);
}
.tempos {
  background: rgba(25, 95, 160, 0.06);
}
.tempos > div + div {
  border-left: 1px solid rgba(15, 23, 42, 0.08);
}
.dados {
  border: 1px solid rgba(15, 23, 42, 0.08);
}
.linha-dado + .linha-dado {
  border-top: 1px dashed rgba(15, 23, 42, 0.08);
}
.ciclo :deep(.v-timeline-item__body) {
  width: 100%;
}
</style>
