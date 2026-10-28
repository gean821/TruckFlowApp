<template>
  <div>
    <Teleport to="#relatorio-acoes" defer>
      <v-btn variant="text" color="primary" prepend-icon="mdi-file-delimited-outline" rounded="lg" :disabled="!dados" @click="exportarCsv">
        CSV
      </v-btn>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-printer-outline" rounded="lg" :disabled="!dados" @click="imprimir">
        Imprimir / PDF
      </v-btn>
    </Teleport>

    <FiltrosRelatorio :filtros="filtros" class="mb-5 nao-imprimir" />

    <v-alert v-if="isError" type="error" variant="tonal" rounded="xl" class="mb-5">
      Não foi possível carregar o desempenho dos fornecedores.
      <template #append><v-btn variant="text" @click="refetch()">Tentar de novo</v-btn></template>
    </v-alert>

    <template v-if="dados">
      <div class="d-flex align-center flex-wrap mb-3 text-body-2 text-grey-darken-1" style="gap: 8px">
        <v-icon size="18">mdi-calendar-blank-outline</v-icon>
        {{ descreverPeriodo(dados.periodo.inicio, dados.periodo.fim) }}
        <span>•</span>
        comparado com {{ descreverPeriodo(dados.periodo.inicioAnterior, dados.periodo.fimAnterior) }}
        <v-progress-circular v-if="isFetching" indeterminate size="16" width="2" color="primary" class="ml-2" />
      </div>

      <v-row v-if="dados.destaques.length" dense class="mb-2">
        <v-col v-for="(d, i) in dados.destaques" :key="i" cols="12" sm="6" :lg="dados.destaques.length > 3 ? 4 : 12 / dados.destaques.length">
          <div class="destaque pa-4 rounded-xl h-100 d-flex" :class="`destaque-${d.tipo}`">
            <v-icon :color="corDestaque(d.tipo)" class="mr-3 mt-1">{{ iconeDestaque(d.tipo) }}</v-icon>
            <div>
              <div class="text-body-2 font-weight-bold text-grey-darken-4">{{ d.titulo }}</div>
              <div class="text-caption text-grey-darken-1">{{ d.descricao }}</div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row dense class="mb-2">
        <v-col v-for="kpi in kpis" :key="kpi.titulo" cols="12" sm="6" lg="3">
          <KpiCard v-bind="kpi" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" lg="6">
          <ChartCard
            titulo="Volume × pontualidade"
            subtitulo="Cada bolha é um fornecedor • tamanho = agendamentos • cor = score. Clique para abrir."
            ajuda="À direita da linha tracejada vertical ficam os fornecedores com 85% ou mais de pontualidade. Acima da horizontal, os que entregam mais que a mediana. O canto superior esquerdo é o mais crítico: muito volume chegando fora da janela."
            :option="opcoes.matriz"
            :carregando="isFetching"
            :vazio="!dados.ranking.some((f) => f.id && f.pontualidadePct !== null && f.pesoKg > 0)"
            texto-vazio="Sem chegadas registradas no período"
            :altura="380"
            @clique="cliqueMatriz"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <ChartCard
            titulo="O que aconteceu com cada agendamento"
            subtitulo="Fornecedores com mais volume • clique numa barra para abrir"
            :option="opcoes.comparativo"
            :carregando="isFetching"
            :vazio="!dados.ranking.some((f) => f.id)"
            :altura="380"
            @clique="cliqueComparativo"
          />
        </v-col>

        <v-col cols="12">
          <ChartCard
            titulo="Evolução da pontualidade, faltas e cancelamentos"
            :subtitulo="`Todos os fornecedores, por ${rotuloAgrupamento}`"
            :option="opcoes.evolucao"
            :carregando="isFetching"
            :vazio="dados.indicadores.fornecedoresAtivos.valor === 0"
            :altura="320"
          >
            <template #acoes>
              <v-btn-toggle v-model="agrupamentoEscolhido" mandatory density="compact" variant="outlined" divided rounded="lg" class="mr-2">
                <v-btn value="auto" size="small" class="text-none">Auto</v-btn>
                <v-btn value="dia" size="small" class="text-none">Dia</v-btn>
                <v-btn value="semana" size="small" class="text-none">Semana</v-btn>
                <v-btn value="mes" size="small" class="text-none">Mês</v-btn>
              </v-btn-toggle>
            </template>
          </ChartCard>
        </v-col>

        <v-col cols="12">
          <v-card elevation="0" class="rounded-xl pa-5 painel">
            <div class="d-flex align-center justify-space-between flex-wrap mb-3" style="gap: 12px">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Ranking de fornecedores</h3>
                <div class="text-caption text-grey-darken-1">
                  Score = 50% pontualidade + 30% comparecimento + 20% sem cancelar (a partir de {{ MINIMO_SCORE }} agendamentos realizados). Clique numa linha para ver o histórico.
                </div>
              </div>
              <div class="d-flex align-center flex-wrap nao-imprimir" style="gap: 8px">
                <v-text-field
                  v-model="busca"
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Buscar fornecedor"
                  hide-details
                  clearable
                  style="min-width: 220px"
                />
                <v-btn-toggle v-model="classificacaoFiltro" density="compact" variant="outlined" divided rounded="lg">
                  <v-btn v-for="c in CLASSIFICACOES" :key="c" :value="c" size="small" class="text-none">
                    <span class="ponto mr-1" :style="{ background: corClassificacao(c) }" />{{ c }}
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>

            <v-data-table
              :headers="colunas"
              :items="rankingFiltrado"
              :items-per-page="15"
              :sort-by="[{ key: 'pesoKg', order: 'desc' }]"
              density="comfortable"
              hover
              class="tabela-ranking"
              items-per-page-text="Por página"
              no-data-text="Nenhum fornecedor no período"
              @click:row="(_: unknown, linha: { item: FornecedorDesempenho }) => abrir(linha.item)"
            >
              <template #item.posicao="{ item }">
                <span class="text-grey-darken-1 font-weight-bold">{{ posicao(item) }}º</span>
              </template>
              <template #item.nome="{ item }">
                <div class="font-weight-bold text-grey-darken-4">{{ item.nome }}</div>
                <div v-if="item.produtoPrincipal" class="text-caption text-grey-darken-1">{{ item.produtoPrincipal }}</div>
              </template>
              <template #item.score="{ item }">
                <v-chip size="small" variant="flat" :color="corClassificacao(item.classificacao)" class="font-weight-bold text-white score-chip">
                  {{ item.score ?? "—" }}
                </v-chip>
                <div class="text-caption text-grey-darken-1 mt-1">{{ item.classificacao }}</div>
              </template>
              <template #item.pesoKg="{ item }">
                <div class="text-no-wrap font-weight-medium">{{ formatarToneladas(item.pesoKg) }}</div>
                <div class="text-caption text-grey-darken-1 text-no-wrap">{{ formatarPct(item.pctVolume) }} do total</div>
                <div class="text-caption text-grey-darken-1 text-no-wrap">{{ formatarNumero(item.agendamentos) }} agend.</div>
              </template>
              <template #item.pontualidadePct="{ item }">
                <div class="text-no-wrap">
                  <span class="font-weight-bold" :class="corPct(item.pontualidadePct, true)">{{ formatarPct(item.pontualidadePct) }}</span>
                  <span v-if="item.variacaoPontualidade !== null && Math.abs(item.variacaoPontualidade) >= 1" class="text-caption ml-1" :class="item.variacaoPontualidade > 0 ? 'text-success' : 'text-error'">
                    <v-icon size="12">{{ item.variacaoPontualidade > 0 ? "mdi-arrow-up" : "mdi-arrow-down" }}</v-icon>{{ formatarNumero(Math.abs(item.variacaoPontualidade), 0) }} pts
                  </span>
                </div>
                <div class="text-caption text-grey-darken-1 text-no-wrap">{{ item.adiantados + item.noHorario }} de {{ item.chegaram }}</div>
              </template>
              <template #item.atrasoMedioMin="{ item }">
                <span class="text-no-wrap">{{ descreverMinutos(item.atrasoMedioMin) }}</span>
                <div v-if="item.atrasados" class="text-caption text-grey-darken-1">{{ item.atrasados }} atraso{{ item.atrasados === 1 ? "" : "s" }}</div>
              </template>
              <template #item.noShowPct="{ item }">
                <span class="font-weight-medium" :class="corPct(item.noShowPct, false)">{{ formatarPct(item.noShowPct) }}</span>
                <div class="text-caption text-grey-darken-1">{{ item.naoCompareceu }} falta{{ item.naoCompareceu === 1 ? "" : "s" }}</div>
              </template>
              <template #item.cancelamentoPct="{ item }">
                <span>{{ formatarPct(item.cancelamentoPct) }}</span>
                <div class="text-caption text-grey-darken-1">{{ item.cancelados }}</div>
              </template>
              <template #item.tendencia="{ item }">
                <v-chart v-if="item.seriePontualidade.filter((v) => v !== null).length > 1" :option="sparkline(item.seriePontualidade)" :theme="TEMA" autoresize class="mini-tendencia" />
                <span v-else class="text-grey">—</span>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <FornecedorDetalheDialog
      :fornecedor-id="detalheId"
      :nome="nomeDetalhe"
      :filtro="filtros.filtroApi.value"
      :serie-geral="dados?.serie ?? []"
      @fechar="detalheId = null"
      @ver-agendamentos="verAgendamentos"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { EChartsOption } from "echarts";
import VChart from "vue-echarts";
import ChartCard from "@/components/relatorios/ChartCard.vue";
import FiltrosRelatorio from "@/components/relatorios/FiltrosRelatorio.vue";
import FornecedorDetalheDialog from "@/components/relatorios/FornecedorDetalheDialog.vue";
import KpiCard from "@/components/relatorios/KpiCard.vue";
import { CORES, TEMA } from "@/components/relatorios/charts/echarts";
import { comparativoOption, corClassificacao, descreverMinutos, evolucaoOption, matrizOption } from "@/components/relatorios/charts/fornecedoresOptions";
import { useFiltrosRelatorio } from "@/composables/useFiltrosRelatorio";
import type { Agrupamento, FornecedorDesempenho, TipoDestaque } from "@/entities/relatorioBi.types";
import { useFornecedoresQuery } from "@/queries/relatorioBi.queries";
import { descreverPeriodo, formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";

const MINIMO_SCORE = 3;
const CLASSIFICACOES = ["Excelente", "Bom", "Atenção", "Crítico"];

const route = useRoute();
const router = useRouter();
const filtros = useFiltrosRelatorio();

const agrupamentoEscolhido = computed<Agrupamento | "auto">({
  get: () => (["dia", "semana", "mes"].includes(route.query.agrupamento as string) ? (route.query.agrupamento as Agrupamento) : "auto"),
  set: (valor) => router.replace({ query: { ...route.query, agrupamento: valor === "auto" ? undefined : valor } }),
});

const filtroApi = computed(() => ({
  ...filtros.filtroApi.value,
  agrupamento: agrupamentoEscolhido.value === "auto" ? undefined : agrupamentoEscolhido.value,
}));

const { data: dados, isFetching, isError, refetch } = useFornecedoresQuery(filtroApi);

const detalheId = computed<string | null>({
  get: () => (typeof route.query.detalhe === "string" ? route.query.detalhe : null),
  set: (valor) => router.replace({ query: { ...route.query, detalhe: valor ?? undefined } }),
});
const nomeDetalhe = computed(() => dados.value?.ranking.find((f) => f.id === detalheId.value)?.nome);

const busca = ref("");
const classificacaoFiltro = ref<string | undefined>();

const rankingFiltrado = computed(() => {
  const termo = (busca.value ?? "").trim().toLowerCase();
  return (dados.value?.ranking ?? []).filter(
    (f) => (!termo || f.nome.toLowerCase().includes(termo)) && (!classificacaoFiltro.value || f.classificacao === classificacaoFiltro.value),
  );
});

const posicao = (f: FornecedorDesempenho) => (dados.value?.ranking.indexOf(f) ?? 0) + 1;

const rotuloAgrupamento = computed(() => ({ dia: "dia", semana: "semana", mes: "mês" })[dados.value?.agrupamento ?? "dia"]);

const opcoes = computed(() => {
  const d = dados.value!;
  return {
    matriz: matrizOption(d.ranking),
    comparativo: comparativoOption(d.ranking),
    evolucao: evolucaoOption(d.serie),
  };
});

const colunas = [
  { title: "#", key: "posicao", sortable: false, width: 48 },
  { title: "Fornecedor", key: "nome", sortable: true },
  { title: "Score", key: "score", sortable: true, align: "center" as const },
  { title: "Recebido", key: "pesoKg", sortable: true, align: "end" as const },
  { title: "Pontualidade", key: "pontualidadePct", sortable: true, align: "end" as const },
  { title: "Atraso médio", key: "atrasoMedioMin", sortable: true, align: "end" as const },
  { title: "Faltas", key: "noShowPct", sortable: true, align: "end" as const },
  { title: "Cancel.", key: "cancelamentoPct", sortable: true, align: "end" as const },
  { title: "Tendência", key: "tendencia", sortable: false, align: "center" as const },
];

const kpis = computed(() => {
  const i = dados.value!.indicadores;
  return [
    { titulo: "Pontualidade", valor: formatarPct(i.pontualidadePct.valor), icone: "mdi-clock-check-outline", cor: "success", variacao: i.pontualidadePct.variacaoPct, serie: i.pontualidadePct.serie },
    { titulo: "Faltas (não compareceu)", valor: formatarPct(i.noShowPct.valor), icone: "mdi-account-cancel-outline", cor: "error", variacao: i.noShowPct.variacaoPct, serie: i.noShowPct.serie, inverter: true },
    { titulo: "Cancelamentos", valor: formatarPct(i.cancelamentoPct.valor), icone: "mdi-cancel", cor: "blue-grey", variacao: i.cancelamentoPct.variacaoPct, serie: i.cancelamentoPct.serie, inverter: true },
    { titulo: "Atraso médio", valor: descreverMinutos(i.atrasoMedioMin.valor || null), icone: "mdi-clock-alert-outline", cor: "warning", variacao: i.atrasoMedioMin.variacaoPct, inverter: true, detalhe: "de quem chegou depois da janela" },
    { titulo: "Toneladas recebidas", valor: formatarToneladas(i.pesoRecebidoKg.valor), icone: "mdi-weight", cor: "indigo", variacao: i.pesoRecebidoKg.variacaoPct, serie: i.pesoRecebidoKg.serie },
    { titulo: "Fornecedores ativos", valor: formatarNumero(i.fornecedoresAtivos.valor), icone: "mdi-domain", cor: "primary", variacao: i.fornecedoresAtivos.variacaoPct, serie: i.fornecedoresAtivos.serie },
    {
      titulo: "Score médio",
      valor: i.scoreMedio === null ? "—" : formatarNumero(i.scoreMedio),
      icone: "mdi-star-circle-outline",
      cor: "amber-darken-2",
      detalhe: i.comScoreCritico > 0 ? `${i.comScoreCritico} ${i.comScoreCritico === 1 ? "fornecedor" : "fornecedores"} em situação crítica` : "nenhum fornecedor crítico",
    },
    {
      titulo: "Concentração (top 3)",
      valor: i.concentracaoTop3Pct === null ? "—" : formatarPct(i.concentracaoTop3Pct, 0),
      icone: "mdi-chart-pie",
      cor: "deep-purple",
      detalhe: i.concentracaoTop3Pct === null ? "precisa de 4 ou mais fornecedores" : "do volume com os 3 maiores",
    },
  ];
});

const corPct = (valor: number | null, maiorMelhor: boolean) => {
  if (valor === null) return "text-grey";
  if (maiorMelhor) return valor >= 85 ? "text-success" : valor >= 70 ? "text-warning" : "text-error";
  return valor <= 5 ? "" : valor <= 15 ? "text-warning" : "text-error";
};

const sparkline = (serie: (number | null)[]): EChartsOption => ({
  grid: { left: 0, right: 0, top: 2, bottom: 2 },
  xAxis: { type: "category", show: false, data: serie.map((_, i) => i) },
  yAxis: { type: "value", show: false, min: 0, max: 100 },
  series: [{ type: "line", data: serie.map((v) => v ?? "-"), smooth: true, symbol: "none", connectNulls: true, lineStyle: { width: 2, color: CORES.sucesso }, areaStyle: { color: "rgba(22,163,74,0.12)" } }],
});

const corDestaque = (tipo: TipoDestaque) => ({ info: "primary", success: "success", warning: "warning" })[tipo];
const iconeDestaque = (tipo: TipoDestaque) =>
  ({ info: "mdi-lightbulb-on-outline", success: "mdi-check-decagram-outline", warning: "mdi-alert-circle-outline" })[tipo];

const abrir = (f: FornecedorDesempenho) => {
  if (f.id) detalheId.value = f.id;
};

const cliqueMatriz = (p: any) => {
  const f = dados.value?.ranking.find((r) => r.id && r.id === p?.data?.fornecedorId);
  if (f) abrir(f);
};

const cliqueComparativo = (p: any) => {
  const f = dados.value?.ranking.filter((x) => x.id)[p?.dataIndex];
  if (f) abrir(f);
};

const verAgendamentos = () => {
  const f = filtros.filtroApi.value;
  router.push({
    name: "relatorios-agendamentos",
    query: {
      periodo: "personalizado",
      inicio: f.inicio,
      fim: f.fim,
      unidade: f.unidadeEntregaId ?? undefined,
      doca: f.localDescargaId ?? undefined,
      produto: f.produtoId ?? undefined,
      fornecedor: detalheId.value ?? undefined,
    },
  });
};

const exportarCsv = () => {
  const d = dados.value;
  if (!d) return;
  const n = (v: number | null) => (v === null ? "" : String(v).replace(".", ","));
  const linhas: (string | number | null)[][] = [
    ["Desempenho de fornecedores", `${d.periodo.inicio} a ${d.periodo.fim}`],
    [],
    ["Posição", "Fornecedor", "Score", "Classificação", "Agendamentos", "Concluídos", "Recebido (kg)", "% do volume", "Pontualidade (%)", "Variação (pts)", "Atrasos", "Atraso médio (min)", "Faltas", "Faltas (%)", "Cancelados", "Cancelamentos (%)", "Espera média (min)", "Descarga média (min)", "Produto principal"],
    ...d.ranking.map((f, i) => [
      i + 1,
      f.nome,
      f.score,
      f.classificacao,
      f.agendamentos,
      f.concluidos,
      n(f.pesoKg),
      n(f.pctVolume),
      n(f.pontualidadePct),
      n(f.variacaoPontualidade),
      f.atrasados,
      n(f.atrasoMedioMin),
      f.naoCompareceu,
      n(f.noShowPct),
      f.cancelados,
      n(f.cancelamentoPct),
      n(f.esperaMediaMin),
      n(f.descargaMediaMin),
      f.produtoPrincipal,
    ]),
  ];
  const csv = linhas
    .map((l) => l.map((c) => (c === null || c === undefined ? "" : `"${String(c).replace(/"/g, '""')}"`)).join(";"))
    .join("\r\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fornecedores-${d.periodo.inicio}-a-${d.periodo.fim}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const imprimir = () => window.print();
</script>

<style scoped>
.painel {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.destaque {
  border: 1px solid transparent;
}
.destaque-info {
  background: #eff6ff;
  border-color: #dbeafe;
}
.destaque-success {
  background: #f0fdf4;
  border-color: #dcfce7;
}
.destaque-warning {
  background: #fffbeb;
  border-color: #fef3c7;
}
.ponto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.score-chip {
  min-width: 44px;
  justify-content: center;
}
.tabela-ranking :deep(th) {
  font-weight: 700 !important;
  color: #475569 !important;
  min-width: 64px;
  line-height: 1.25;
  padding: 8px 8px !important;
}
.tabela-ranking :deep(td) {
  padding: 6px 8px !important;
}
.tabela-ranking :deep(th:first-child) {
  min-width: 0;
}
.tabela-ranking :deep(td:nth-child(2)) {
  min-width: 150px;
}
.tabela-ranking :deep(tbody tr) {
  cursor: pointer;
}
.mini-tendencia {
  width: 64px;
  height: 26px;
  display: inline-block;
}
@media print {
  .nao-imprimir {
    display: none !important;
  }
}
</style>
