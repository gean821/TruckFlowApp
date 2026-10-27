<template>
  <v-dialog :model-value="!!fornecedorId" max-width="1180" scrollable @update:model-value="(v: boolean) => !v && emit('fechar')">
    <v-card class="rounded-xl detalhe-fornecedor">
      <div class="pa-5 pb-3 d-flex align-start justify-space-between cabecalho">
        <div class="d-flex align-center" style="gap: 16px">
          <div class="medidor">
            <v-chart v-if="d" :option="opcoesScore" :theme="TEMA" autoresize style="height: 96px; width: 120px" />
          </div>
          <div>
            <div class="text-overline text-primary font-weight-bold">Fornecedor</div>
            <div class="text-h5 font-weight-bold text-grey-darken-4">{{ d?.fornecedor.nome ?? nome }}</div>
            <div v-if="d" class="text-body-2 text-grey-darken-1">
              {{ d.posicao }}º de {{ d.totalFornecedores }} em volume • {{ formatarToneladas(d.fornecedor.pesoKg) }} ({{ formatarPct(d.fornecedor.pctVolume) }} do total)
              <template v-if="d.fornecedor.produtoPrincipal"> • principal produto: {{ d.fornecedor.produtoPrincipal }}</template>
            </div>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="emit('fechar')" />
      </div>

      <v-divider />

      <v-card-text class="pa-5">
        <div v-if="isLoading" class="py-12 text-center"><v-progress-circular indeterminate color="primary" /></div>
        <v-alert v-else-if="isError" type="error" variant="tonal" rounded="lg">Não foi possível carregar o fornecedor.</v-alert>

        <template v-else-if="d">
          <div class="text-caption text-grey-darken-1 mb-2">Comparado com a média de todos os fornecedores no mesmo período e filtros</div>
          <v-row dense class="mb-3">
            <v-col v-for="c in comparacoes" :key="c.titulo" cols="6" md="4" lg="2">
              <div class="comparacao pa-3 rounded-lg h-100">
                <div class="text-caption text-grey-darken-1">{{ c.titulo }}</div>
                <div class="text-h6 font-weight-bold" :class="`text-${c.cor}`">{{ c.valor }}</div>
                <div class="text-caption text-grey">média {{ c.media }}</div>
              </div>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" lg="7">
              <div class="painel-interno pa-4 rounded-lg h-100">
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">Histórico de pontualidade e faltas</div>
                <div class="text-caption text-grey-darken-1 mb-2">Por {{ rotuloAgrupamento }} • linha pontilhada = pontualidade de todos os fornecedores</div>
                <v-chart :option="opcoes.historico" :theme="TEMA" autoresize style="height: 280px" />
              </div>
            </v-col>
            <v-col cols="12" lg="5">
              <div class="painel-interno pa-4 rounded-lg h-100">
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">Quando os caminhões chegam</div>
                <div class="text-caption text-grey-darken-1 mb-2">Em relação à janela agendada • vermelho = depois da janela</div>
                <v-chart v-if="d.fornecedor.chegaram" :option="opcoes.chegada" :theme="TEMA" autoresize style="height: 280px" />
                <div v-else class="text-body-2 text-grey py-12 text-center">Nenhuma chegada registrada</div>
              </div>
            </v-col>

            <v-col cols="12" lg="6">
              <div class="painel-interno pa-4 rounded-lg h-100">
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2">Por dia da semana</div>
                <v-chart :option="opcoes.dias" :theme="TEMA" autoresize style="height: 240px" />
              </div>
            </v-col>
            <v-col cols="12" lg="6">
              <div class="painel-interno pa-4 rounded-lg h-100">
                <div class="d-flex align-center justify-space-between mb-2">
                  <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">Por {{ visao === "produto" ? "produto" : "unidade" }}</div>
                  <v-btn-toggle v-model="visao" mandatory density="compact" variant="outlined" divided rounded="lg">
                    <v-btn value="produto" size="x-small" class="text-none">Produto</v-btn>
                    <v-btn value="unidade" size="x-small" class="text-none">Unidade</v-btn>
                  </v-btn-toggle>
                </div>
                <v-table density="compact" class="tabela-compacta">
                  <thead>
                    <tr>
                      <th>{{ visao === "produto" ? "Produto" : "Unidade" }}</th>
                      <th class="text-end">Agend.</th>
                      <th class="text-end">Recebido</th>
                      <th class="text-end">Pontual.</th>
                      <th class="text-end">Faltas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="g in grupos" :key="g.nome">
                      <td class="font-weight-medium">{{ g.nome }}</td>
                      <td class="text-end">{{ formatarNumero(g.agendamentos) }}</td>
                      <td class="text-end text-no-wrap">{{ formatarToneladas(g.pesoKg) }}</td>
                      <td class="text-end">{{ formatarPct(g.pontualidadePct) }}</td>
                      <td class="text-end">{{ formatarPct(g.noShowPct) }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="painel-interno pa-4 rounded-lg">
                <div class="d-flex align-center justify-space-between mb-2 flex-wrap" style="gap: 8px">
                  <div>
                    <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">Últimas ocorrências</div>
                    <div class="text-caption text-grey-darken-1">Atrasos, faltas e cancelamentos mais recentes do período</div>
                  </div>
                  <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-table-search" rounded="lg" class="text-none" @click="emit('verAgendamentos')">
                    Ver todos os agendamentos
                  </v-btn>
                </div>
                <div v-if="!d.ocorrencias.length" class="text-body-2 text-grey py-6 text-center">
                  <v-icon color="success" class="mr-1">mdi-check-circle-outline</v-icon>Nenhum atraso, falta ou cancelamento no período
                </div>
                <v-table v-else density="compact" class="tabela-compacta">
                  <thead>
                    <tr>
                      <th>Janela</th>
                      <th>Ocorrência</th>
                      <th>Placa</th>
                      <th>Motorista</th>
                      <th>Produto</th>
                      <th>Doca</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="o in d.ocorrencias" :key="o.agendamentoId">
                      <td class="text-no-wrap">{{ formatarJanela(o.dataInicio, o.dataFim) }}</td>
                      <td>
                        <v-chip size="x-small" variant="tonal" :color="corOcorrencia(o.tipo)" class="font-weight-medium">
                          {{ o.tipo }}<template v-if="o.atrasoMin !== null"> +{{ descreverMinutos(o.atrasoMin) }}</template>
                        </v-chip>
                      </td>
                      <td class="font-weight-bold text-no-wrap">{{ o.placa ?? "—" }}</td>
                      <td>{{ o.motorista ?? "—" }}</td>
                      <td>{{ o.produto ?? "—" }}</td>
                      <td>{{ o.doca ?? "—" }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import VChart from "vue-echarts";
import { TEMA } from "@/components/relatorios/charts/echarts";
import { chegadaOption, descreverMinutos, diaSemanaOption, evolucaoOption, scoreOption } from "@/components/relatorios/charts/fornecedoresOptions";
import type { FornecedoresBalde, RelatorioBiFiltro } from "@/entities/relatorioBi.types";
import { useFornecedorDetalheQuery } from "@/queries/relatorioBi.queries";
import { formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";

const props = defineProps<{ fornecedorId: string | null; nome?: string; filtro: RelatorioBiFiltro; serieGeral: FornecedoresBalde[] }>();
const emit = defineEmits<{ fechar: []; verAgendamentos: [] }>();

const visao = ref<"produto" | "unidade">("produto");
const id = computed(() => props.fornecedorId);
const filtro = computed(() => props.filtro);

const { data: d, isLoading, isError } = useFornecedorDetalheQuery(filtro, id);

const rotuloAgrupamento = computed(() => ({ dia: "dia", semana: "semana", mes: "mês" })[d.value?.agrupamento ?? "dia"]);
const grupos = computed(() => (visao.value === "produto" ? d.value?.porProduto : d.value?.porUnidade) ?? []);

const opcoesScore = computed(() => scoreOption(d.value?.fornecedor.score ?? null, d.value?.fornecedor.classificacao ?? "Poucos dados"));

const opcoes = computed(() => ({
  historico: evolucaoOption(d.value!.serie, props.serieGeral.length === d.value!.serie.length ? props.serieGeral : undefined),
  chegada: chegadaOption(d.value!.distribuicaoChegada),
  dias: diaSemanaOption(d.value!.porDiaSemana),
}));

const comparacoes = computed(() => {
  const f = d.value!.fornecedor;
  const m = d.value!.media;
  const cor = (valor: number | null, media: number | null, maiorMelhor: boolean) => {
    if (valor === null || media === null) return "grey-darken-3";
    if (Math.abs(valor - media) < 0.5) return "grey-darken-3";
    return (valor > media) === maiorMelhor ? "success" : "error";
  };
  return [
    { titulo: "Pontualidade", valor: formatarPct(f.pontualidadePct), media: formatarPct(m.pontualidadePct), cor: cor(f.pontualidadePct, m.pontualidadePct, true) },
    { titulo: "Faltas", valor: formatarPct(f.noShowPct), media: formatarPct(m.noShowPct), cor: cor(f.noShowPct, m.noShowPct, false) },
    { titulo: "Cancelamentos", valor: formatarPct(f.cancelamentoPct), media: formatarPct(m.cancelamentoPct), cor: cor(f.cancelamentoPct, m.cancelamentoPct, false) },
    { titulo: "Atraso médio", valor: descreverMinutos(f.atrasoMedioMin), media: descreverMinutos(m.atrasoMedioMin), cor: cor(f.atrasoMedioMin, m.atrasoMedioMin, false) },
    { titulo: "Espera no pátio", valor: descreverMinutos(f.esperaMediaMin), media: descreverMinutos(m.esperaMediaMin), cor: cor(f.esperaMediaMin, m.esperaMediaMin, false) },
    { titulo: "Descarga", valor: descreverMinutos(f.descargaMediaMin), media: descreverMinutos(m.descargaMediaMin), cor: cor(f.descargaMediaMin, m.descargaMediaMin, false) },
  ];
});

const corOcorrencia = (tipo: string) => ({ Atraso: "warning", "Não compareceu": "error", Cancelado: "grey" })[tipo] ?? "grey";

const formatarJanela = (inicio: string, fim: string) => {
  const dia = new Date(inicio).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
  const hora = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  return `${dia} ${hora(inicio)}–${hora(fim)}`;
};
</script>

<style scoped>
.cabecalho {
  background: linear-gradient(180deg, rgba(25, 95, 160, 0.06), transparent);
}
.comparacao,
.painel-interno {
  border: 1px solid rgba(15, 23, 42, 0.08);
}
.tabela-compacta :deep(th) {
  font-weight: 700 !important;
  color: #475569 !important;
  white-space: nowrap;
}
</style>
