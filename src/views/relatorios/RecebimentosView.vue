<template>
  <div>
    <Teleport to="#relatorio-acoes" defer>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-printer-outline" rounded="lg" :disabled="!dados" @click="imprimir">
        Imprimir / PDF
      </v-btn>
    </Teleport>

    <FiltrosRelatorio :filtros="filtros" class="mb-5 nao-imprimir" />

    <v-alert v-if="isError" type="error" variant="tonal" rounded="xl" class="mb-5">
      Não foi possível carregar os recebimentos.
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

      <v-row dense class="mb-2">
        <v-col v-for="kpi in kpis" :key="kpi.titulo" cols="12" sm="6" lg="3">
          <KpiCard v-bind="kpi" @clique="kpi.clicavel && abrirDrill('Descargas concluídas', {})" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <ChartCard
            titulo="Volume recebido por produto"
            :subtitulo="`Toneladas pela nota fiscal por ${rotuloAgrupamento} • linha preta = média móvel${dados.serie.some((b) => b.metaKg) ? ' • tracejado = meta' : ''}. Clique numa barra para ver as descargas.`"
            :option="opcoes.volume"
            :carregando="isFetching"
            :vazio="dados.indicadores.descargas.valor === 0"
            :altura="340"
            @clique="cliqueBalde"
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
          <ChartCard
            titulo="Para onde vai cada tonelada"
            subtitulo="Fluxo fornecedor → produto → unidade. Passe o mouse para destacar um caminho."
            ajuda="A espessura de cada faixa é proporcional às toneladas recebidas pela nota fiscal."
            :option="opcoes.fluxo"
            :carregando="isFetching"
            :vazio="dados.fluxo.ligacoes.length === 0"
            :altura="420"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ChartCard
            titulo="Por produto"
            subtitulo="Clique para ver as descargas"
            :option="opcoes.produtos"
            :vazio="dados.porProduto.length === 0"
            :altura="Math.max(200, dados.porProduto.length * 42)"
            @clique="(p: any) => cliqueRanking(p, 'produto')"
          />
        </v-col>
        <v-col cols="12" md="4">
          <ChartCard
            titulo="Por fornecedor"
            subtitulo="Clique para ver as descargas"
            :option="opcoes.fornecedores"
            :vazio="dados.porFornecedor.length === 0"
            :altura="Math.max(200, dados.porFornecedor.length * 42)"
            @clique="(p: any) => cliqueRanking(p, 'fornecedor')"
          />
        </v-col>
        <v-col cols="12" md="4">
          <ChartCard
            titulo="Por unidade"
            subtitulo="Clique para ver as descargas"
            :option="opcoes.unidades"
            :vazio="dados.porUnidade.length === 0"
            :altura="Math.max(200, dados.porUnidade.length * 42)"
            @clique="(p: any) => cliqueRanking(p, 'unidade')"
          />
        </v-col>

        <v-col cols="12" lg="7">
          <ChartCard
            titulo="Planejado × recebido"
            :subtitulo="planejamentoSubtitulo"
            ajuda="Planejado = cadência diária do planejamento × dias de operação no período, até hoje. Recebido = quantidades confirmadas ao finalizar as descargas."
            :option="opcoes.planejamento"
            :vazio="dados.planejamento.length === 0"
            texto-vazio="Nenhum planejamento de recebimento ativo no período"
            :altura="Math.max(240, dados.planejamento.length * 46 + 40)"
          />
        </v-col>
        <v-col cols="12" lg="5">
          <v-card elevation="0" class="rounded-xl pa-5 painel h-100">
            <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-3">Situação do planejamento</h3>
            <div v-if="!dados.planejamento.length" class="text-body-2 text-grey py-6 text-center">Sem planejamento no período</div>
            <div v-for="p in dados.planejamento" :key="p.itemId" class="py-2 item-plano">
              <div class="d-flex align-center justify-space-between">
                <div class="text-body-2 font-weight-medium text-truncate pr-2">{{ p.fornecedor }} <span class="text-grey-darken-1">• {{ p.produto }}</span></div>
                <v-chip size="x-small" :color="corSituacao(p.situacao)" variant="tonal" class="font-weight-bold">{{ p.situacao }}</v-chip>
              </div>
              <v-progress-linear
                :model-value="Math.min(100, p.cumprimentoPct ?? 0)"
                :color="corSituacao(p.situacao)"
                bg-color="grey-lighten-3"
                height="6"
                rounded
                class="my-1"
              />
              <div class="text-caption text-grey-darken-1">
                {{ formatarToneladas(p.recebidoKg) }} de {{ formatarToneladas(p.planejadoKg) }} • {{ formatarPct(p.cumprimentoPct) }}
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12">
          <DivergenciasTabela :divergencias="dados.divergencias" :sem-conferencia="dados.indicadores.pesoRecebidoKg === null" />
        </v-col>

        <v-col cols="12">
          <MatrizRecebimentos :matriz="dados.matriz" :nome-arquivo="`recebimentos-${dados.periodo.inicio}-a-${dados.periodo.fim}`" />
        </v-col>
      </v-row>
    </template>

    <v-row v-else-if="isLoading" dense>
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" lg="3"><v-skeleton-loader type="article" class="rounded-xl" /></v-col>
      <v-col cols="12"><v-skeleton-loader type="image" height="340" class="rounded-xl" /></v-col>
    </v-row>

    <DrillDownDialog v-model="drill.aberto" :titulo="drill.titulo" :filtro="drill.filtro" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChartCard from "@/components/relatorios/ChartCard.vue";
import DivergenciasTabela from "@/components/relatorios/DivergenciasTabela.vue";
import DrillDownDialog, { type FiltroDrillDown } from "@/components/relatorios/DrillDownDialog.vue";
import FiltrosRelatorio from "@/components/relatorios/FiltrosRelatorio.vue";
import KpiCard from "@/components/relatorios/KpiCard.vue";
import MatrizRecebimentos from "@/components/relatorios/MatrizRecebimentos.vue";
import { fluxoOption, planejamentoOption, volumeOption } from "@/components/relatorios/charts/recebimentosOptions";
import { rankingOption } from "@/components/relatorios/charts/visaoGeralOptions";
import { useFiltrosRelatorio } from "@/composables/useFiltrosRelatorio";
import type { Agrupamento, RelatorioBiRanking } from "@/entities/relatorioBi.types";
import { useRecebimentosQuery } from "@/queries/relatorioBi.queries";
import { descreverPeriodo, formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";

const route = useRoute();
const router = useRouter();
const filtros = useFiltrosRelatorio();

const agrupamentoEscolhido = computed<Agrupamento | "auto">({
  get: () => (["dia", "semana", "mes"].includes(route.query.agrupamento as string) ? (route.query.agrupamento as Agrupamento) : "auto"),
  set: (valor) => router.replace({ query: { ...route.query, agrupamento: valor === "auto" ? undefined : valor } }),
});

const agrupamentoApi = computed<Agrupamento | null>(() => (agrupamentoEscolhido.value === "auto" ? null : agrupamentoEscolhido.value));

const { data: dados, isLoading, isFetching, isError, refetch } = useRecebimentosQuery(filtros.filtroApi, agrupamentoApi);

const rotuloAgrupamento = computed(() => ({ dia: "dia", semana: "semana", mes: "mês" })[dados.value?.agrupamento ?? "dia"]);

const opcoes = computed(() => {
  const d = dados.value!;
  return {
    volume: volumeOption(d.serie, d.produtos, d.agrupamento),
    fluxo: fluxoOption(d.fluxo),
    produtos: rankingOption(d.porProduto),
    fornecedores: rankingOption(d.porFornecedor),
    unidades: rankingOption(d.porUnidade),
    planejamento: planejamentoOption(d.planejamento),
  };
});

const kpis = computed(() => {
  const i = dados.value!.indicadores;
  const metaPct = i.metaPeriodoKg ? (i.pesoNotaKg.valor * 100) / i.metaPeriodoKg : null;
  return [
    { titulo: "Toneladas recebidas", valor: formatarToneladas(i.pesoNotaKg.valor), icone: "mdi-weight", cor: "indigo", variacao: i.pesoNotaKg.variacaoPct, serie: i.pesoNotaKg.serie, clicavel: true, detalhe: "pela nota fiscal" },
    { titulo: "Descargas", valor: formatarNumero(i.descargas.valor), icone: "mdi-truck-check", cor: "success", variacao: i.descargas.variacaoPct, clicavel: true },
    { titulo: "Peso médio por descarga", valor: formatarToneladas(i.pesoMedioKg.valor), icone: "mdi-scale-balance", cor: "deep-purple", variacao: i.pesoMedioKg.variacaoPct },
    { titulo: "Meta do período", valor: formatarPct(metaPct), icone: "mdi-target", cor: "amber-darken-2", detalhe: i.metaPeriodoKg ? `de ${formatarToneladas(i.metaPeriodoKg)}` : filtros.quantidadeFiltros.value > 0 ? "disponível sem filtros" : "meta não configurada" },
    { titulo: "Recebido conferido", valor: i.pesoRecebidoKg === null ? "—" : formatarToneladas(i.pesoRecebidoKg), icone: "mdi-clipboard-check-outline", cor: "teal", detalhe: `${formatarPct(i.coberturaConferenciaPct, 0)} das descargas com quantidade lançada` },
    { titulo: "Divergência nota × recebido", valor: i.divergenciaPct === null ? "—" : `${i.divergenciaPct > 0 ? "+" : ""}${formatarPct(i.divergenciaPct, 2)}`, icone: "mdi-swap-vertical", cor: i.divergenciaPct !== null && Math.abs(i.divergenciaPct) > 1 ? "error" : "blue-grey", detalhe: i.divergenciaKg === null ? "sem conferência no período" : `${i.divergenciaKg > 0 ? "+" : ""}${formatarNumero(i.divergenciaKg)} kg` },
    { titulo: "Cumprimento do planejamento", valor: formatarPct(i.cumprimentoPlanejamentoPct), icone: "mdi-calendar-check-outline", cor: "primary", detalhe: i.cumprimentoPlanejamentoPct === null ? "sem planejamento no período" : "recebido ÷ planejado até hoje" },
    { titulo: "Recebimentos órfãos", valor: formatarNumero(i.orfaos), icone: "mdi-link-variant-off", cor: i.orfaos > 0 ? "warning" : "grey", detalhe: i.orfaos > 0 ? `${formatarToneladas(i.orfaosKg)} sem planejamento` : "tudo vinculado" },
  ];
});

const planejamentoSubtitulo = computed(() => {
  const n = dados.value?.planejamento.length ?? 0;
  const atrasados = dados.value?.planejamento.filter((p) => p.situacao === "Atrasado").length ?? 0;
  return n === 0 ? "Planejamentos de recebimento ativos no período" : `${n} ite${n === 1 ? "m" : "ns"} de planejamento • ${atrasados} atrasado${atrasados === 1 ? "" : "s"}`;
});

const corSituacao = (situacao: string) =>
  ({ Adiantado: "success", "No ritmo": "primary", Atrasado: "error" } as Record<string, string>)[situacao] ?? "grey";


const drill = reactive<{ aberto: boolean; titulo: string; filtro: FiltroDrillDown }>({
  aberto: false,
  titulo: "",
  filtro: { dataInicio: "", dataFim: "" },
});

const abrirDrill = (titulo: string, extra: Partial<FiltroDrillDown>) => {
  const f = filtros.filtroApi.value;
  drill.titulo = titulo;
  drill.filtro = {
    dataInicio: f.inicio,
    dataFim: f.fim,
    status: "Finalizado",
    fornecedorId: f.fornecedorId,
    produtoId: f.produtoId,
    unidadeEntregaId: f.unidadeEntregaId,
    ...extra,
  };
  drill.aberto = true;
};

const cliqueBalde = (p: any) => {
  const balde = dados.value?.serie[p.dataIndex];
  if (!balde) return;
  abrirDrill(`Descargas de ${descreverPeriodo(balde.inicio, balde.fim)}`, { dataInicio: balde.inicio, dataFim: balde.fim });
};

const cliqueRanking = (p: any, tipo: "produto" | "fornecedor" | "unidade") => {
  const lista: RelatorioBiRanking[] | undefined =
    tipo === "produto" ? dados.value?.porProduto : tipo === "fornecedor" ? dados.value?.porFornecedor : dados.value?.porUnidade;
  const item = lista ? [...lista].reverse()[p.dataIndex] : undefined;
  if (!item?.id) return;
  const chave = { produto: "produtoId", fornecedor: "fornecedorId", unidade: "unidadeEntregaId" }[tipo];
  abrirDrill(item.nome, { [chave]: item.id });
};

const imprimir = () => window.print();
</script>

<style scoped>
.painel {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
}
.item-plano + .item-plano {
  border-top: 1px solid #f1f5f9;
}
@media print {
  .nao-imprimir {
    display: none !important;
  }
}
</style>
