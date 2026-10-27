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

    <FiltrosRelatorio :filtros="filtros" sem-fornecedor class="mb-5 nao-imprimir" />

    <v-alert v-if="isError" type="error" variant="tonal" rounded="xl" class="mb-5">
      Não foi possível carregar a capacidade das docas.
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

      <v-alert v-if="semGrade" type="info" variant="tonal" rounded="xl" class="mb-5" icon="mdi-calendar-blank-outline">
        Nenhuma vaga de grade no período. A capacidade é medida pelas vagas que a grade oferece. Cadastre uma grade de agendamento para acompanhar ocupação e ociosidade.
      </v-alert>

      <v-row v-if="dados.recomendacoes.length" dense class="mb-2">
        <v-col v-for="(r, i) in dados.recomendacoes" :key="i" cols="12" sm="6" :lg="dados.recomendacoes.length > 3 ? 4 : 12 / dados.recomendacoes.length">
          <div class="destaque pa-4 rounded-xl h-100 d-flex" :class="`destaque-${r.tipo}`">
            <v-icon :color="corDestaque(r.tipo)" class="mr-3 mt-1">{{ iconeDestaque(r.tipo) }}</v-icon>
            <div>
              <div class="text-body-2 font-weight-bold text-grey-darken-4">{{ r.titulo }}</div>
              <div class="text-caption text-grey-darken-1">{{ r.descricao }}</div>
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
        <v-col cols="12">
          <ChartCard
            titulo="Ocupação por dia da semana e horário"
            :subtitulo="`${subtituloHeatmap} • roxo = encaixes fora da grade`"
            ajuda="Cada quadrado soma todas as docas filtradas naquele dia da semana e horário, no período. Reservado = vagas com motorista ou placa ÷ vagas ofertadas pela grade. Utilização real = tempo efetivo de descarga ÷ tempo ofertado. Dias esgotados = em quantos dias todas as vagas daquele horário foram reservadas."
            :option="opcoes.heatmapSemana"
            :carregando="isFetching"
            :vazio="dados.heatmapSemana.length === 0"
            texto-vazio="Nenhuma vaga de grade no período"
            :altura="380"
          >
            <template #acoes>
              <v-btn-toggle v-model="metricaSemana" mandatory density="compact" variant="outlined" divided rounded="lg" class="mr-2">
                <v-btn value="reserva" size="small" class="text-none">Reservado</v-btn>
                <v-btn value="utilizacao" size="small" class="text-none">Utilização real</v-btn>
                <v-btn value="esgotadas" size="small" class="text-none">Esgotadas</v-btn>
                <v-btn value="ofertadas" size="small" class="text-none">Vagas</v-btn>
              </v-btn-toggle>
            </template>
          </ChartCard>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" class="rounded-xl pa-5 painel h-100">
            <div class="d-flex align-center mb-1">
              <v-avatar color="red-lighten-5" size="32" rounded="lg" class="mr-3"><v-icon color="error" size="18">mdi-fire</v-icon></v-avatar>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Janelas com excesso de demanda</h3>
                <div class="text-caption text-grey-darken-1">Horários que esgotam com frequência ou recebem caminhões fora da grade</div>
              </div>
            </div>
            <div v-if="!dados.excessoDemanda.length" class="text-body-2 text-grey py-8 text-center">
              <v-icon size="32" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
              <div>Nenhuma janela saturada no período</div>
            </div>
            <div v-for="j in dados.excessoDemanda" :key="`${j.diaSemana}-${j.hora}`" class="py-2 item-janela">
              <div class="d-flex align-center justify-space-between">
                <div class="text-body-2 font-weight-medium">{{ capitalizar(j.rotulo) }}</div>
                <div class="d-flex" style="gap: 4px">
                  <v-chip v-if="j.foraDaGrade" size="x-small" color="deep-purple" variant="tonal" class="font-weight-bold">+{{ j.foraDaGrade }} fora da grade</v-chip>
                  <v-chip size="x-small" color="error" variant="tonal" class="font-weight-bold">{{ formatarPct(j.taxaReservaPct, 0) }}</v-chip>
                </div>
              </div>
              <v-progress-linear :model-value="j.taxaReservaPct ?? 0" color="error" bg-color="grey-lighten-3" height="6" rounded class="my-1" />
              <div class="text-caption text-grey-darken-1">
                {{ j.reservadas }} de {{ j.ofertadas }} vagas reservadas
                <template v-if="j.diasComOferta"> • esgotou em {{ j.diasEsgotados }} de {{ j.diasComOferta }} dias</template>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" class="rounded-xl pa-5 painel h-100">
            <div class="d-flex align-center mb-1">
              <v-avatar color="blue-grey-lighten-5" size="32" rounded="lg" class="mr-3"><v-icon color="blue-grey" size="18">mdi-sleep</v-icon></v-avatar>
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Janelas ociosas</h3>
                <div class="text-caption text-grey-darken-1">Horários com até 40% das vagas reservadas: candidatos a reduzir ou redistribuir</div>
              </div>
            </div>
            <div v-if="!dados.ociosas.length" class="text-body-2 text-grey py-8 text-center">
              <v-icon size="32" color="primary" class="mb-2">mdi-chart-bar</v-icon>
              <div>Nenhuma janela ociosa no período</div>
            </div>
            <div v-for="j in dados.ociosas" :key="`${j.diaSemana}-${j.hora}`" class="py-2 item-janela">
              <div class="d-flex align-center justify-space-between">
                <div class="text-body-2 font-weight-medium">{{ capitalizar(j.rotulo) }}</div>
                <v-chip size="x-small" color="blue-grey" variant="tonal" class="font-weight-bold">{{ j.vagasLivres }} vagas livres</v-chip>
              </div>
              <v-progress-linear :model-value="j.taxaReservaPct ?? 0" color="blue-grey" bg-color="grey-lighten-3" height="6" rounded class="my-1" />
              <div class="text-caption text-grey-darken-1">{{ j.reservadas }} de {{ j.ofertadas }} vagas reservadas • {{ formatarPct(j.taxaReservaPct, 0) }}</div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="8">
          <ChartCard
            titulo="Ocupação por doca e faixa horária"
            subtitulo="Quais docas lotam e em que horário. Passe o mouse para ver vagas e reservas."
            :option="opcoes.heatmapDocas"
            :carregando="isFetching"
            :vazio="dados.heatmapDocas.length === 0"
            texto-vazio="Nenhuma vaga de grade no período"
            :altura="Math.max(260, docasComVagas * 52 + 100)"
          >
            <template #acoes>
              <v-btn-toggle v-model="metricaDocas" mandatory density="compact" variant="outlined" divided rounded="lg" class="mr-2">
                <v-btn value="reserva" size="small" class="text-none">Reservado</v-btn>
                <v-btn value="utilizacao" size="small" class="text-none">Utilização real</v-btn>
                <v-btn value="ofertadas" size="small" class="text-none">Vagas</v-btn>
              </v-btn-toggle>
            </template>
          </ChartCard>
        </v-col>
        <v-col cols="12" lg="4">
          <v-card elevation="0" class="rounded-xl pa-5 painel h-100 d-flex flex-column">
            <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Aproveitamento da vaga</h3>
            <div class="text-caption text-grey-darken-1 mb-2">Quanto do tempo da vaga a descarga realmente usa</div>
            <template v-if="dados.indicadores.aproveitamentoVagaPct !== null">
              <v-chart :option="opcoes.aproveitamento" :theme="TEMA" autoresize style="height: 200px" />
              <div class="d-flex justify-space-around text-center mt-1">
                <div>
                  <div class="text-h6 font-weight-bold text-grey-darken-4">{{ formatarDuracao(dados.indicadores.descargaMediaMin) }}</div>
                  <div class="text-caption text-grey-darken-1">descarga média</div>
                </div>
                <v-divider vertical />
                <div>
                  <div class="text-h6 font-weight-bold text-grey-darken-4">{{ formatarDuracao(dados.indicadores.vagaMediaMin) }}</div>
                  <div class="text-caption text-grey-darken-1">duração da vaga</div>
                </div>
              </div>
              <div class="text-caption text-grey mt-3">
                <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>
                Estimado pelos horários de check-in e finalização (início = chegada ou fim do caminhão anterior na doca).
              </div>
            </template>
            <div v-else class="flex-grow-1 d-flex flex-column align-center justify-center text-grey text-body-2 text-center py-6">
              <v-icon size="36" class="mb-2">mdi-timer-sand-empty</v-icon>
              Sem descargas com check-in e finalização registrados no período
            </div>
          </v-card>
        </v-col>

        <v-col cols="12">
          <ChartCard
            titulo="Capacidade planejada × utilização real"
            subtitulo="Horas de doca por dia: ofertadas pela grade, reservadas e de fato usadas na descarga. Clique num dia para ver os caminhões."
            :option="opcoes.serie"
            :carregando="isFetching"
            :vazio="semGrade"
            texto-vazio="Nenhuma vaga de grade no período"
            :altura="340"
            @clique="cliqueDia"
          />
        </v-col>

        <v-col cols="12" lg="6">
          <ChartCard
            titulo="Perfil do dia: capacidade × demanda por hora"
            subtitulo="Onde a reserva encosta na capacidade e onde sobra doca"
            :option="opcoes.perfil"
            :vazio="semGrade"
            texto-vazio="Nenhuma vaga de grade no período"
            :altura="320"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <ChartCard
            titulo="Para onde vai a capacidade de cada doca"
            subtitulo="Horas usadas na descarga, reservadas sem uso e ociosas. % = reservado."
            :option="opcoes.composicao"
            :vazio="docasComVagas === 0"
            texto-vazio="Nenhuma vaga de grade no período"
            :altura="Math.max(240, docasComVagas * 48 + 60)"
            @clique="cliqueComposicao"
          />
        </v-col>

        <v-col cols="12">
          <v-card elevation="0" class="rounded-xl painel">
            <div class="d-flex align-center justify-space-between flex-wrap pa-5 pb-2" style="gap: 8px">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Docas mais e menos utilizadas</h3>
                <div class="text-caption text-grey-darken-1">Clique numa doca para ver os caminhões do período</div>
              </div>
            </div>
            <v-data-table
              :headers="colunasDocas"
              :items="dados.docas"
              :items-per-page="-1"
              density="comfortable"
              hide-default-footer
              hover
              class="tabela-docas"
              @click:row="(_: unknown, { item }: { item: CapacidadeDoca }) => abrirDoca(item)"
            >
              <template #item.nome="{ item }">
                <div class="font-weight-medium text-grey-darken-4">{{ item.nome }}</div>
                <div v-if="item.unidade" class="text-caption text-grey-darken-1">{{ item.unidade }}</div>
              </template>
              <template #item.taxaReservaPct="{ item }">
                <div class="d-flex align-center" style="gap: 8px; min-width: 140px">
                  <v-progress-linear :model-value="item.taxaReservaPct ?? 0" :color="corTaxa(item.taxaReservaPct)" bg-color="grey-lighten-3" height="8" rounded />
                  <span class="text-body-2 font-weight-bold" style="min-width: 42px">{{ formatarPct(item.taxaReservaPct, 0) }}</span>
                </div>
              </template>
              <template #item.utilizacaoRealPct="{ item }">
                <div class="d-flex align-center" style="gap: 8px; min-width: 140px">
                  <v-progress-linear :model-value="item.utilizacaoRealPct ?? 0" color="primary" bg-color="grey-lighten-3" height="8" rounded />
                  <span class="text-body-2 font-weight-bold" style="min-width: 42px">{{ formatarPct(item.utilizacaoRealPct, 0) }}</span>
                </div>
              </template>
              <template #item.vagasOfertadas="{ item }">
                <span v-if="item.vagasOfertadas">{{ item.vagasReservadas }} / {{ item.vagasOfertadas }}</span>
                <span v-else class="text-grey">sem vagas</span>
              </template>
              <template #item.horasOciosas="{ item }">{{ formatarNumero(item.horasOciosas, 1) }} h</template>
              <template #item.naoCompareceu="{ item }">
                <span :class="item.naoCompareceu ? 'text-error font-weight-medium' : 'text-grey'">{{ item.naoCompareceu }}</span>
              </template>
              <template #item.foraDaGrade="{ item }">
                <span :class="item.foraDaGrade ? 'text-deep-purple font-weight-medium' : 'text-grey'">{{ item.foraDaGrade }}</span>
              </template>
              <template #item.descargaMediaMin="{ item }">{{ formatarDuracao(item.descargaMediaMin) }}</template>
              <template #item.horaPico="{ item }">{{ item.horaPico === null ? "—" : `${String(item.horaPico).padStart(2, "0")}h` }}</template>
              <template #item.tendencia="{ item }">
                <v-chart v-if="item.serieTaxaReserva.filter((v) => v !== null).length > 1" :option="sparkline(item.serieTaxaReserva)" :theme="TEMA" autoresize class="mini-tendencia" />
                <span v-else class="text-grey">—</span>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <v-row v-else-if="isLoading" dense>
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" lg="3"><v-skeleton-loader type="article" class="rounded-xl" /></v-col>
      <v-col cols="12"><v-skeleton-loader type="image" height="380" class="rounded-xl" /></v-col>
    </v-row>

    <DrillDownDialog v-model="drill.aberto" :titulo="drill.titulo" :filtro="drill.filtro" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";
import ChartCard from "@/components/relatorios/ChartCard.vue";
import DrillDownDialog, { type FiltroDrillDown } from "@/components/relatorios/DrillDownDialog.vue";
import FiltrosRelatorio from "@/components/relatorios/FiltrosRelatorio.vue";
import KpiCard from "@/components/relatorios/KpiCard.vue";
import {
  aproveitamentoOption,
  composicaoDocasOption,
  heatmapDocasOption,
  heatmapSemanaOption,
  perfilHoraOption,
  serieCapacidadeOption,
  type MetricaCapacidade,
} from "@/components/relatorios/charts/capacidadeOptions";
import { CORES, TEMA } from "@/components/relatorios/charts/echarts";
import { useFiltrosRelatorio } from "@/composables/useFiltrosRelatorio";
import type { CapacidadeDoca, TipoDestaque } from "@/entities/relatorioBi.types";
import { useCapacidadeDocasQuery } from "@/queries/relatorioBi.queries";
import { descreverPeriodo, formatarDuracao, formatarNumero, formatarPct } from "@/utils/relatorioFormat";

const route = useRoute();
const router = useRouter();
const filtros = useFiltrosRelatorio();

const { data: dados, isLoading, isFetching, isError, refetch } = useCapacidadeDocasQuery(filtros.filtroApi);

const metricaQuery = (chave: string, permitidas: MetricaCapacidade[]) =>
  computed<MetricaCapacidade>({
    get: () => (permitidas.includes(route.query[chave] as MetricaCapacidade) ? (route.query[chave] as MetricaCapacidade) : "reserva"),
    set: (valor) => router.replace({ query: { ...route.query, [chave]: valor === "reserva" ? undefined : valor } }),
  });

const metricaSemana = metricaQuery("metrica", ["reserva", "utilizacao", "esgotadas", "ofertadas"]);
const metricaDocas = metricaQuery("metricaDoca", ["reserva", "utilizacao", "ofertadas"]);

const semGrade = computed(() => (dados.value?.indicadores.vagasOfertadas ?? 0) === 0);
const docasComVagas = computed(() => dados.value?.docas.filter((d) => d.vagasOfertadas > 0).length ?? 0);

const subtituloHeatmap = computed(
  () =>
    ({
      reserva: "% das vagas da grade que foram reservadas • vermelho = horário lotado",
      utilizacao: "% do tempo ofertado que a doca passou descarregando",
      esgotadas: "% dos dias em que todas as vagas do horário foram reservadas",
      ofertadas: "Quantas vagas a grade ofereceu em cada horário",
    })[metricaSemana.value],
);

const opcoes = computed(() => {
  const d = dados.value!;
  return {
    heatmapSemana: heatmapSemanaOption(d.heatmapSemana, metricaSemana.value),
    heatmapDocas: heatmapDocasOption(d.heatmapDocas, d.docas, metricaDocas.value as Exclude<MetricaCapacidade, "esgotadas">),
    serie: serieCapacidadeOption(d.serieDiaria),
    perfil: perfilHoraOption(d.porHora),
    composicao: composicaoDocasOption(d.docas),
    aproveitamento: aproveitamentoOption(d.indicadores.vagaMediaMin, d.indicadores.descargaMediaMin),
  };
});

const kpis = computed(() => {
  const i = dados.value!.indicadores;
  const janelasPct = i.janelasComOferta ? (i.janelasEsgotadas * 100) / i.janelasComOferta : null;
  return [
    { titulo: "Vagas reservadas", valor: formatarPct(i.taxaReservaPct.valor), icone: "mdi-calendar-check", cor: "primary", variacao: i.taxaReservaPct.variacaoPct, serie: i.taxaReservaPct.serie, detalhe: `${formatarNumero(i.vagasReservadas)} de ${formatarNumero(i.vagasOfertadas)} vagas` },
    { titulo: "Utilização real", valor: formatarPct(i.utilizacaoRealPct.valor), icone: "mdi-timer-outline", cor: "indigo", variacao: i.utilizacaoRealPct.variacaoPct, serie: i.utilizacaoRealPct.serie, detalhe: "tempo descarregando ÷ ofertado" },
    { titulo: "Capacidade ofertada", valor: `${formatarNumero(i.horasOfertadas.valor, 0)} h`, icone: "mdi-garage-variant", cor: "teal", variacao: i.horasOfertadas.variacaoPct, serie: i.horasOfertadas.serie, detalhe: `${formatarNumero(i.vagasOfertadas)} vagas da grade` },
    { titulo: "Horas ociosas", valor: `${formatarNumero(i.horasOciosas.valor, 0)} h`, icone: "mdi-sleep", cor: "blue-grey", variacao: i.horasOciosas.variacaoPct, serie: i.horasOciosas.serie, inverter: true, detalhe: "vagas sem reserva" },
    { titulo: "Janelas esgotadas", valor: formatarNumero(i.janelasEsgotadas), icone: "mdi-fire", cor: i.janelasEsgotadas > 0 ? "error" : "grey", detalhe: i.janelasComOferta ? `${formatarPct(janelasPct, 0)} das ${formatarNumero(i.janelasComOferta)} janelas dia × hora` : "sem janelas na grade" },
    { titulo: "Perdido por não comparecimento", valor: `${formatarNumero(i.horasNaoComparecimento.valor, 1)} h`, icone: "mdi-account-off-outline", cor: "warning", variacao: i.horasNaoComparecimento.variacaoPct, inverter: true, detalhe: "vagas reservadas que ninguém usou" },
    { titulo: "Fora da grade", valor: formatarNumero(i.foraDaGrade.valor), icone: "mdi-truck-alert-outline", cor: "deep-purple", variacao: i.foraDaGrade.variacaoPct, inverter: true, detalhe: "encaixes sem vaga: demanda acima da grade" },
    { titulo: "Aproveitamento da vaga", valor: formatarPct(i.aproveitamentoVagaPct, 0), icone: "mdi-gauge", cor: i.aproveitamentoVagaPct === null ? "grey" : i.aproveitamentoVagaPct > 100 ? "error" : i.aproveitamentoVagaPct < 70 ? "warning" : "success", detalhe: i.descargaMediaMin !== null ? `${formatarDuracao(i.descargaMediaMin)} de descarga em vagas de ${formatarDuracao(i.vagaMediaMin)}` : "sem descargas medidas" },
  ];
});

const colunasDocas = [
  { title: "Doca", key: "nome", sortable: true },
  { title: "Reservado", key: "taxaReservaPct", sortable: true },
  { title: "Utilização real", key: "utilizacaoRealPct", sortable: true },
  { title: "Vagas", key: "vagasOfertadas", sortable: true, align: "end" as const },
  { title: "Ociosas", key: "horasOciosas", sortable: true, align: "end" as const },
  { title: "Descargas", key: "descargas", sortable: true, align: "end" as const },
  { title: "Não vieram", key: "naoCompareceu", sortable: true, align: "end" as const },
  { title: "Fora da grade", key: "foraDaGrade", sortable: true, align: "end" as const },
  { title: "Descarga média", key: "descargaMediaMin", sortable: true, align: "end" as const },
  { title: "Pico", key: "horaPico", sortable: true, align: "end" as const },
  { title: "Tendência", key: "tendencia", sortable: false, align: "center" as const },
];

const corTaxa = (pct: number | null) => (pct === null ? "grey" : pct >= 90 ? "error" : pct >= 70 ? "warning" : pct <= 40 ? "blue-grey" : "primary");

const sparkline = (serie: (number | null)[]): EChartsOption => ({
  animation: false,
  grid: { left: 0, right: 0, top: 2, bottom: 2 },
  xAxis: { type: "category", show: false, data: serie.map((_, i) => i) },
  yAxis: { type: "value", show: false, min: 0, max: 100 },
  series: [{ type: "line", data: serie, smooth: true, symbol: "none", connectNulls: true, lineStyle: { width: 2, color: CORES.primaria }, areaStyle: { color: "rgba(25,95,160,0.12)" } }],
});

const corDestaque = (tipo: TipoDestaque) => ({ info: "primary", success: "success", warning: "warning" })[tipo];
const iconeDestaque = (tipo: TipoDestaque) =>
  ({ info: "mdi-lightbulb-on-outline", success: "mdi-check-decagram-outline", warning: "mdi-alert-circle-outline" })[tipo];

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

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
    produtoId: f.produtoId,
    unidadeEntregaId: f.unidadeEntregaId,
    localDescargaId: f.localDescargaId,
    ...extra,
  };
  drill.aberto = true;
};

const cliqueDia = (p: any) => {
  const dia = dados.value?.serieDiaria[p.dataIndex];
  if (!dia) return;
  abrirDrill(`Caminhões de ${descreverPeriodo(dia.data, dia.data)}`, { dataInicio: dia.data, dataFim: dia.data });
};

const abrirDoca = (doca: CapacidadeDoca) => abrirDrill(`Caminhões da ${doca.nome}`, { localDescargaId: doca.id });

const cliqueComposicao = (p: any) => {
  const lista = [...(dados.value?.docas.filter((d) => d.vagasOfertadas > 0) ?? [])].reverse();
  const doca = lista[p.dataIndex];
  if (doca) abrirDoca(doca);
};

const exportarCsv = () => {
  const d = dados.value;
  if (!d) return;
  const i = d.indicadores;
  const linhas: (string | number | null)[][] = [
    ["Relatório", "Capacidade e utilização das docas"],
    ["Período", descreverPeriodo(d.periodo.inicio, d.periodo.fim)],
    ["Comparado com", descreverPeriodo(d.periodo.inicioAnterior, d.periodo.fimAnterior)],
    [],
    ["Indicador", "Período", "Período anterior", "Variação %"],
    ["Vagas reservadas %", i.taxaReservaPct.valor, i.taxaReservaPct.anterior, i.taxaReservaPct.variacaoPct],
    ["Utilização real %", i.utilizacaoRealPct.valor, i.utilizacaoRealPct.anterior, i.utilizacaoRealPct.variacaoPct],
    ["Capacidade ofertada (h)", i.horasOfertadas.valor, i.horasOfertadas.anterior, i.horasOfertadas.variacaoPct],
    ["Horas ociosas", i.horasOciosas.valor, i.horasOciosas.anterior, i.horasOciosas.variacaoPct],
    ["Horas perdidas por não comparecimento", i.horasNaoComparecimento.valor, i.horasNaoComparecimento.anterior, i.horasNaoComparecimento.variacaoPct],
    ["Fora da grade", i.foraDaGrade.valor, i.foraDaGrade.anterior, i.foraDaGrade.variacaoPct],
    ["Janelas esgotadas", i.janelasEsgotadas, null, null],
    ["Janelas com oferta", i.janelasComOferta, null, null],
    ["Descarga média (min)", i.descargaMediaMin, null, null],
    ["Duração média da vaga (min)", i.vagaMediaMin, null, null],
    [],
    ["Doca", "Unidade", "Vagas ofertadas", "Vagas reservadas", "Reservado %", "Utilização real %", "Horas ofertadas", "Horas utilizadas", "Horas ociosas", "Descargas", "Não compareceu", "Fora da grade", "Descarga média (min)", "Hora de pico"],
    ...d.docas.map((x) => [x.nome, x.unidade, x.vagasOfertadas, x.vagasReservadas, x.taxaReservaPct, x.utilizacaoRealPct, x.horasOfertadas, x.horasUtilizadas, x.horasOciosas, x.descargas, x.naoCompareceu, x.foraDaGrade, x.descargaMediaMin, x.horaPico]),
    [],
    ["Data", "Horas ofertadas", "Horas reservadas", "Horas utilizadas", "Horas não comparecimento", "Reservado %", "Utilização real %"],
    ...d.serieDiaria.map((x) => [x.data, x.horasOfertadas, x.horasReservadas, x.horasUtilizadas, x.horasNaoComparecimento, x.taxaReservaPct, x.utilizacaoRealPct]),
    [],
    ["Janelas com excesso de demanda", "Vagas", "Reservadas", "Reservado %", "Dias esgotados", "Dias com oferta", "Fora da grade"],
    ...d.excessoDemanda.map((j) => [j.rotulo, j.ofertadas, j.reservadas, j.taxaReservaPct, j.diasEsgotados, j.diasComOferta, j.foraDaGrade]),
    [],
    ["Janelas ociosas", "Vagas", "Reservadas", "Reservado %", "Vagas livres"],
    ...d.ociosas.map((j) => [j.rotulo, j.ofertadas, j.reservadas, j.taxaReservaPct, j.vagasLivres]),
  ];

  const csv = linhas
    .map((linha) => linha.map((c) => `"${(c === null ? "" : typeof c === "number" ? String(c).replace(".", ",") : String(c)).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `capacidade-docas-${d.periodo.inicio}-a-${d.periodo.fim}.csv`;
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
.item-janela + .item-janela {
  border-top: 1px solid #f1f5f9;
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
.tabela-docas :deep(th) {
  font-weight: 700 !important;
  color: #475569 !important;
}
.tabela-docas :deep(tbody tr) {
  cursor: pointer;
}
.mini-tendencia {
  width: 96px;
  height: 28px;
  display: inline-block;
}
@media print {
  .nao-imprimir {
    display: none !important;
  }
}
</style>
