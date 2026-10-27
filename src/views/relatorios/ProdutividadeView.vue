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
      Não foi possível carregar a produtividade.
      <template #append><v-btn variant="text" @click="refetch()">Tentar de novo</v-btn></template>
    </v-alert>

    <template v-if="dados">
      <div class="d-flex align-center justify-space-between flex-wrap mb-3" style="gap: 8px">
        <div class="d-flex align-center flex-wrap text-body-2 text-grey-darken-1" style="gap: 8px">
          <v-icon size="18">mdi-calendar-blank-outline</v-icon>
          {{ descreverPeriodo(dados.periodo.inicio, dados.periodo.fim) }}
          <span>•</span>
          comparado com {{ descreverPeriodo(dados.periodo.inicioAnterior, dados.periodo.fimAnterior) }}
          <v-progress-circular v-if="isFetching" indeterminate size="16" width="2" color="primary" class="ml-2" />
        </div>
        <div class="d-flex align-center nao-imprimir" style="gap: 8px">
          <span class="text-caption text-grey-darken-1">Espera aceitável até</span>
          <v-btn-toggle v-model="limite" mandatory density="compact" variant="outlined" divided rounded="lg">
            <v-btn v-for="m in LIMITES" :key="m" :value="m" size="small" class="text-none">{{ m }} min</v-btn>
          </v-btn-toggle>
        </div>
      </div>

      <v-alert v-if="!dados.indicadores.ciclos.valor" type="info" variant="tonal" rounded="xl" class="mb-5" icon="mdi-timer-off-outline">
        Nenhuma descarga com chegada e fim registrados no período. Os tempos aparecem quando a portaria faz o check-in e o check-out dos caminhões.
      </v-alert>

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
        <v-col cols="12">
          <ChartCard
            titulo="Pátio do dia"
            :subtitulo="subtituloPatio"
            ajuda="Cada linha é uma doca. Laranja = esperando doca (da chegada ao início da descarga), azul = descarregando, laranja-escuro = ainda no pátio. O traço cinza embaixo é a janela agendada. Caminhões na mesma doca ao mesmo tempo ficam em faixas separadas. Arraste ou use a roda do mouse para dar zoom."
            :option="opcoesPatio"
            :carregando="carregandoPatio"
            :vazio="!patio || patio.caminhoes === 0"
            texto-vazio="Nenhum caminhão chegou nesse dia"
            :altura="alturaGantt"
            @clique="abrirCaminhao"
          >
            <template #acoes>
              <div class="d-flex align-center mr-2" style="gap: 4px">
                <v-btn icon="mdi-chevron-left" variant="text" size="small" density="comfortable" @click="mudarDia(-1)" />
                <v-text-field
                  :model-value="diaPatio"
                  type="date"
                  density="compact"
                  variant="outlined"
                  hide-details
                  style="width: 180px; min-width: 180px"
                  @update:model-value="(v: string) => v && (diaPatio = v)"
                />
                <v-btn icon="mdi-chevron-right" variant="text" size="small" density="comfortable" :disabled="diaPatio >= hojeIso" @click="mudarDia(1)" />
                <v-btn v-if="diaPatio !== hojeIso" variant="text" size="small" class="text-none" @click="diaPatio = hojeIso">Hoje</v-btn>
              </div>
            </template>
          </ChartCard>
          <div v-if="patio && patio.caminhoes" class="d-flex flex-wrap mt-2 px-1 legenda" style="gap: 16px">
            <span><i class="cor" style="background: #f59e0b" />Esperando doca</span>
            <span><i class="cor" style="background: #195fa0" />Descarregando</span>
            <span><i class="cor" style="background: #f97316" />No pátio agora</span>
            <span><i class="cor fina" />Janela agendada</span>
          </div>
        </v-col>

        <v-col cols="12">
          <ChartCard
            titulo="Evolução dos tempos"
            subtitulo="Espera, descarga e permanência média por dia. Clique num dia para ver o pátio."
            ajuda="Espera = da chegada ao início da descarga. Descarga = do início ao fim. Permanência = da chegada à saída. A linha tracejada marca o tempo em que 9 de cada 10 caminhões foram atendidos."
            :option="opcoes.tendencia"
            :carregando="isFetching"
            :vazio="!dados.indicadores.ciclos.valor"
            :altura="340"
            @clique="cliqueDia"
          />
        </v-col>
        <v-col cols="12" md="6">
          <ChartCard
            titulo="Quanto tempo cada caminhão levou"
            subtitulo="Quantidade de caminhões por faixa de tempo"
            ajuda="Barras vermelhas = esperas acima do limite escolhido."
            :option="opcoes.distribuicao"
            :carregando="isFetching"
            :vazio="!dados.indicadores.ciclos.valor"
            :altura="340"
          />
        </v-col>
        <v-col cols="12" md="6">
          <ChartCard
            titulo="Chegadas e espera por hora"
            subtitulo="Quando chegam mais caminhões e quanto eles esperam"
            :option="opcoes.porHora"
            :carregando="isFetching"
            :vazio="!dados.indicadores.ciclos.valor"
            :altura="340"
          />
        </v-col>

        <v-col cols="12">
          <ChartCard
            titulo="Horários mais congestionados"
            :subtitulo="subtituloHeatmap"
            ajuda="Agrupado pelo horário de chegada do caminhão. Use para ver em que dia e hora a fila se forma."
            :option="opcoes.heatmap"
            :carregando="isFetching"
            :vazio="dados.heatmap.length === 0"
            :altura="360"
          >
            <template #acoes>
              <v-btn-toggle v-model="metricaHeatmap" mandatory density="compact" variant="outlined" divided rounded="lg" class="mr-2">
                <v-btn value="espera" size="small" class="text-none">Espera média</v-btn>
                <v-btn value="p90" size="small" class="text-none">9 em 10</v-btn>
                <v-btn value="chegadas" size="small" class="text-none">Chegadas</v-btn>
              </v-btn-toggle>
            </template>
          </ChartCard>
        </v-col>

        <v-col cols="12">
          <v-card elevation="0" class="rounded-xl pa-5 painel">
            <div class="d-flex align-center justify-space-between flex-wrap mb-3" style="gap: 8px">
              <div>
                <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4">Tempo por {{ rotuloGrupo }}</h3>
                <div class="text-caption text-grey-darken-1">A caixa vai do 1º ao 3º quartil, o traço é a mediana e o losango é a média. Clique numa linha da tabela para ver os caminhões.</div>
              </div>
              <div class="d-flex flex-wrap nao-imprimir" style="gap: 8px">
                <v-btn-toggle v-model="grupo" mandatory density="compact" variant="outlined" divided rounded="lg">
                  <v-btn value="doca" size="small" class="text-none">Doca</v-btn>
                  <v-btn value="produto" size="small" class="text-none">Produto</v-btn>
                  <v-btn value="unidade" size="small" class="text-none">Unidade</v-btn>
                  <v-btn value="fornecedor" size="small" class="text-none">Fornecedor</v-btn>
                </v-btn-toggle>
                <v-btn-toggle v-model="metricaGrupo" mandatory density="compact" variant="outlined" divided rounded="lg">
                  <v-btn value="espera" size="small" class="text-none">Espera</v-btn>
                  <v-btn value="descarga" size="small" class="text-none">Descarga</v-btn>
                </v-btn-toggle>
              </div>
            </div>

            <v-row dense>
              <v-col cols="12" xl="5">
                <div v-if="!gruposAtuais.length" class="text-body-2 text-grey py-12 text-center">Sem descargas no período</div>
                <v-chart v-else :option="opcoes.boxplot" :theme="TEMA" autoresize :style="{ height: `${Math.max(220, Math.min(15, gruposAtuais.length) * 38 + 60)}px` }" />
              </v-col>
              <v-col cols="12" xl="7">
                <v-data-table
                  :headers="colunasGrupo"
                  :items="gruposAtuais"
                  :items-per-page="10"
                  density="compact"
                  hover
                  class="tabela-grupos"
                  :sort-by="[{ key: metricaGrupo === 'espera' ? 'esperaMediaMin' : 'descargaMediaMin', order: 'desc' }]"
                  items-per-page-text="Por página"
                  no-data-text="Sem descargas no período"
                  @click:row="(_: unknown, linha: { item: ProdutividadeGrupo }) => abrirGrupo(linha.item)"
                >
                  <template #item.nome="{ item }"><span class="font-weight-medium">{{ item.nome }}</span></template>
                  <template #item.esperaMediaMin="{ item }">
                    <span :class="item.esperaMediaMin !== null && item.esperaMediaMin > limite ? 'text-error font-weight-bold' : ''">{{ minutos(item.esperaMediaMin) }}</span>
                  </template>
                  <template #item.esperaP90Min="{ item }">{{ minutos(item.esperaP90Min) }}</template>
                  <template #item.descargaMediaMin="{ item }">{{ minutos(item.descargaMediaMin) }}</template>
                  <template #item.descargaMedianaMin="{ item }">{{ minutos(item.descargaMedianaMin) }}</template>
                  <template #item.permanenciaMediaMin="{ item }">{{ minutos(item.permanenciaMediaMin) }}</template>
                  <template #item.acimaDoLimite="{ item }">
                    <v-chip v-if="item.acimaDoLimite" size="x-small" color="error" variant="tonal">{{ item.acimaDoLimite }}</v-chip>
                    <span v-else class="text-grey">0</span>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import VChart from "vue-echarts";
import ChartCard from "@/components/relatorios/ChartCard.vue";
import FiltrosRelatorio from "@/components/relatorios/FiltrosRelatorio.vue";
import KpiCard from "@/components/relatorios/KpiCard.vue";
import { TEMA } from "@/components/relatorios/charts/echarts";
import {
  boxplotOption,
  distribuicaoOption,
  distribuirFaixas,
  ganttOption,
  heatmapEsperaOption,
  horaSaoPaulo,
  porHoraOption,
  tendenciaOption,
  type MetricaHeatmapEspera,
  type MetricaTempo,
} from "@/components/relatorios/charts/produtividadeOptions";
import { useFiltrosRelatorio } from "@/composables/useFiltrosRelatorio";
import type { ProdutividadeGrupo, TipoDestaque } from "@/entities/relatorioBi.types";
import { usePatioQuery, useProdutividadeQuery } from "@/queries/relatorioBi.queries";
import { deIso, descreverPeriodo, formatarDiaCurto, formatarDuracao, formatarNumero, formatarPct, paraIso } from "@/utils/relatorioFormat";

type Grupo = "doca" | "produto" | "unidade" | "fornecedor";

const LIMITES = [15, 30, 45, 60];

const route = useRoute();
const router = useRouter();
const filtros = useFiltrosRelatorio();

const daQuery = <T extends string | number>(chave: string, permitidos: T[], padrao: T) =>
  computed<T>({
    get: () => {
      const bruto = route.query[chave];
      const valor = (typeof padrao === "number" ? Number(bruto) : bruto) as T;
      return permitidos.includes(valor) ? valor : padrao;
    },
    set: (valor) => router.replace({ query: { ...route.query, [chave]: valor === padrao ? undefined : String(valor) } }),
  });

const limite = daQuery<number>("limite", LIMITES, 30);
const metricaHeatmap = daQuery<MetricaHeatmapEspera>("metrica", ["espera", "p90", "chegadas"], "espera");
const grupo = daQuery<Grupo>("grupo", ["doca", "produto", "unidade", "fornecedor"], "doca");
const metricaGrupo = daQuery<MetricaTempo>("tempo", ["espera", "descarga"], "espera");

const hojeIso = paraIso(new Date());
const diaPatio = computed<string>({
  get: () => {
    const valor = route.query.dia;
    if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
    const ultimoComDados = [...(dados.value?.serieDiaria ?? [])].reverse().find((d) => d.ciclos > 0)?.dia;
    if (ultimoComDados) return ultimoComDados;
    const fim = filtros.filtroApi.value.fim;
    return fim > hojeIso ? hojeIso : fim;
  },
  set: (valor) => router.replace({ query: { ...route.query, dia: valor } }),
});

const mudarDia = (delta: number) => {
  const d = deIso(diaPatio.value);
  d.setDate(d.getDate() + delta);
  diaPatio.value = paraIso(d);
};

const { data: dados, isFetching, isError, refetch } = useProdutividadeQuery(filtros.filtroApi, limite);
const { data: patio, isFetching: carregandoPatio } = usePatioQuery(filtros.filtroApi, diaPatio);

const minutos = (v: number | null | undefined) => formatarDuracao(v);

const opcoes = computed(() => {
  const d = dados.value!;
  return {
    tendencia: tendenciaOption(d.serieDiaria, d.limiteEsperaMin),
    distribuicao: distribuicaoOption(d.distribuicao, d.limiteEsperaMin),
    heatmap: heatmapEsperaOption(d.heatmap, metricaHeatmap.value, d.limiteEsperaMin),
    porHora: porHoraOption(d.porHora),
    boxplot: boxplotOption(gruposAtuais.value, metricaGrupo.value, d.limiteEsperaMin),
  };
});

const opcoesPatio = computed(() => (patio.value ? ganttOption(patio.value) : {}));

const alturaGantt = computed(() => {
  if (!patio.value?.caminhoes) return 260;
  const faixas = distribuirFaixas(patio.value);
  const linhas = patio.value.docas.reduce((soma, _, i) => soma + Math.max(1, ...faixas.filter((f) => f.doca === i).map((f) => f.faixas)), 0);
  return Math.min(900, Math.max(260, linhas * 34 + 110));
});

const subtituloPatio = computed(() => {
  const p = patio.value;
  const dia = formatarDiaCurto(diaPatio.value);
  if (!p || !p.caminhoes) return dia;
  const partes = [dia, `${p.caminhoes} ${p.caminhoes === 1 ? "caminhão" : "caminhões"}`];
  if (p.picoSimultaneos > 1 && p.picoEm) partes.push(`pico de ${p.picoSimultaneos} no pátio às ${horaSaoPaulo(p.picoEm)}`);
  if (p.esperaMediaMin !== null) partes.push(`espera média ${minutos(p.esperaMediaMin)}`);
  return partes.join(" • ");
});

const subtituloHeatmap = computed(
  () =>
    ({
      espera: "Espera média de quem chegou em cada dia e horário",
      p90: "Tempo em que 9 de cada 10 caminhões começaram a descarregar",
      chegadas: "Quantos caminhões chegaram em cada dia e horário",
    })[metricaHeatmap.value],
);

const gruposAtuais = computed<ProdutividadeGrupo[]>(() => {
  const d = dados.value;
  if (!d) return [];
  return { doca: d.porDoca, produto: d.porProduto, unidade: d.porUnidade, fornecedor: d.porFornecedor }[grupo.value];
});

const rotuloGrupo = computed(() => ({ doca: "doca", produto: "produto", unidade: "unidade", fornecedor: "fornecedor" })[grupo.value]);

const colunasGrupo = computed(() => [
  { title: rotuloGrupo.value.charAt(0).toUpperCase() + rotuloGrupo.value.slice(1), key: "nome", sortable: true },
  { title: "Descargas", key: "ciclos", sortable: true, align: "end" as const },
  { title: "Espera média", key: "esperaMediaMin", sortable: true, align: "end" as const },
  { title: "9 em 10 até", key: "esperaP90Min", sortable: true, align: "end" as const },
  { title: "Descarga média", key: "descargaMediaMin", sortable: true, align: "end" as const },
  { title: "Mediana", key: "descargaMedianaMin", sortable: true, align: "end" as const },
  { title: "Permanência", key: "permanenciaMediaMin", sortable: true, align: "end" as const },
  { title: `> ${limite.value} min`, key: "acimaDoLimite", sortable: true, align: "end" as const },
]);

const kpis = computed(() => {
  const i = dados.value!.indicadores;
  return [
    {
      titulo: "Espera média no pátio",
      valor: minutos(i.esperaMediaMin.valor),
      icone: "mdi-timer-sand",
      cor: "amber-darken-2",
      variacao: i.esperaMediaMin.variacaoPct,
      serie: i.esperaMediaMin.serie,
      inverter: true,
      detalhe: `metade esperou até ${minutos(i.esperaMedianaMin)}`,
    },
    {
      titulo: "Espera de 9 em cada 10",
      valor: minutos(i.esperaP90Min.valor),
      icone: "mdi-chart-bell-curve-cumulative",
      cor: "deep-orange",
      variacao: i.esperaP90Min.variacaoPct,
      serie: i.esperaP90Min.serie,
      inverter: true,
      detalhe: "o pior caso típico (percentil 90)",
    },
    {
      titulo: "Descarga média",
      valor: minutos(i.descargaMediaMin.valor),
      icone: "mdi-tray-arrow-down",
      cor: "primary",
      variacao: i.descargaMediaMin.variacaoPct,
      serie: i.descargaMediaMin.serie,
      inverter: true,
      detalhe: `9 em 10 até ${minutos(i.descargaP90Min)}`,
    },
    {
      titulo: "Permanência média",
      valor: minutos(i.permanenciaMediaMin.valor),
      icone: "mdi-map-marker-path",
      cor: "deep-purple",
      variacao: i.permanenciaMediaMin.variacaoPct,
      serie: i.permanenciaMediaMin.serie,
      inverter: true,
      detalhe: "da chegada à saída",
    },
    {
      titulo: "Descargas concluídas",
      valor: formatarNumero(i.ciclos.valor),
      icone: "mdi-truck-check-outline",
      cor: "success",
      variacao: i.ciclos.variacaoPct,
      serie: i.ciclos.serie,
      detalhe: `${formatarNumero(i.descargasPorDia, 1)} por dia`,
    },
    {
      titulo: "Horas paradas esperando",
      valor: `${formatarNumero(i.horasEspera.valor, 1)} h`,
      icone: "mdi-cash-clock",
      cor: "error",
      variacao: i.horasEspera.variacaoPct,
      serie: i.horasEspera.serie,
      inverter: true,
      detalhe: "soma de todas as esperas",
    },
    {
      titulo: `Esperaram mais de ${dados.value!.limiteEsperaMin} min`,
      valor: formatarPct(i.acimaDoLimitePct.valor),
      icone: "mdi-alarm-light-outline",
      cor: i.acimaDoLimite > 0 ? "error" : "success",
      variacao: i.acimaDoLimitePct.variacaoPct,
      inverter: true,
      detalhe: `${formatarNumero(i.acimaDoLimite)} ${i.acimaDoLimite === 1 ? "caminhão" : "caminhões"}`,
    },
    {
      titulo: "Tempos estimados",
      valor: formatarPct(i.estimadosPct, 0),
      icone: "mdi-calculator-variant-outline",
      cor: "blue-grey",
      detalhe: i.estimadosPct > 0 ? "início da descarga calculado pela fila da doca" : "todos os tempos foram registrados",
    },
  ];
});

const corDestaque = (tipo: TipoDestaque) => ({ info: "primary", success: "success", warning: "warning" })[tipo];
const iconeDestaque = (tipo: TipoDestaque) =>
  ({ info: "mdi-lightbulb-on-outline", success: "mdi-check-decagram-outline", warning: "mdi-alert-circle-outline" })[tipo];

const cliqueDia = (p: any) => {
  const dia = dados.value?.serieDiaria[p.dataIndex];
  if (dia) diaPatio.value = dia.dia;
};

const irParaDetalhado = (extra: Record<string, string | undefined>, inicio: string, fim: string) =>
  router.push({
    name: "relatorios-agendamentos",
    query: {
      periodo: "personalizado",
      inicio,
      fim,
      unidade: filtros.aplicado.value.unidadeEntregaId ?? undefined,
      doca: filtros.aplicado.value.localDescargaId ?? undefined,
      fornecedor: filtros.aplicado.value.fornecedorId ?? undefined,
      produto: filtros.aplicado.value.produtoId ?? undefined,
      ...extra,
    },
  });

const abrirCaminhao = (p: any) => {
  const f = patio.value ? distribuirFaixas(patio.value)[p?.value?.[6]] : undefined;
  if (!f?.caminhao.placa) return;
  irParaDetalhado({ busca: f.caminhao.placa }, diaPatio.value, diaPatio.value);
};

const abrirGrupo = (g: ProdutividadeGrupo) => {
  const chave = { doca: "doca", produto: "produto", unidade: "unidade", fornecedor: "fornecedor" }[grupo.value];
  irParaDetalhado({ [chave]: g.id ?? undefined, status: "Finalizado" }, filtros.filtroApi.value.inicio, filtros.filtroApi.value.fim);
};

const exportarCsv = () => {
  const d = dados.value;
  if (!d) return;
  const i = d.indicadores;
  const n = (v: number | null) => (v === null ? "" : String(v).replace(".", ","));
  const linhas: (string | number | null)[][] = [
    ["Produtividade e tempo de operação", `${d.periodo.inicio} a ${d.periodo.fim}`],
    [],
    ["Indicador", "Valor", "Período anterior"],
    ["Descargas concluídas", i.ciclos.valor, i.ciclos.anterior],
    ["Espera média (min)", n(i.esperaMediaMin.valor), n(i.esperaMediaMin.anterior)],
    ["Espera de 9 em 10 (min)", n(i.esperaP90Min.valor), n(i.esperaP90Min.anterior)],
    ["Descarga média (min)", n(i.descargaMediaMin.valor), n(i.descargaMediaMin.anterior)],
    ["Permanência média (min)", n(i.permanenciaMediaMin.valor), n(i.permanenciaMediaMin.anterior)],
    ["Horas paradas esperando", n(i.horasEspera.valor), n(i.horasEspera.anterior)],
    [`Esperaram mais de ${d.limiteEsperaMin} min (%)`, n(i.acimaDoLimitePct.valor), n(i.acimaDoLimitePct.anterior)],
    [],
    ["Dia", "Descargas", "Espera média (min)", "Espera 9 em 10 (min)", "Descarga média (min)", "Permanência média (min)"],
    ...d.serieDiaria.map((s) => [s.dia, s.ciclos, n(s.esperaMediaMin), n(s.esperaP90Min), n(s.descargaMediaMin), n(s.permanenciaMediaMin)]),
  ];

  for (const [titulo, lista] of [["Doca", d.porDoca], ["Produto", d.porProduto], ["Unidade", d.porUnidade], ["Fornecedor", d.porFornecedor]] as const) {
    linhas.push([], [titulo, "Descargas", "Espera média (min)", "Espera 9 em 10 (min)", "Descarga média (min)", "Descarga mediana (min)", "Permanência média (min)", `Acima de ${d.limiteEsperaMin} min`]);
    lista.forEach((g) => linhas.push([g.nome, g.ciclos, n(g.esperaMediaMin), n(g.esperaP90Min), n(g.descargaMediaMin), n(g.descargaMedianaMin), n(g.permanenciaMediaMin), g.acimaDoLimite]));
  }

  const csv = linhas
    .map((l) => l.map((c) => (c === null || c === undefined ? "" : `"${String(c).replace(/"/g, '""')}"`)).join(";"))
    .join("\r\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `produtividade-${d.periodo.inicio}-a-${d.periodo.fim}.csv`;
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
.legenda {
  font-size: 12px;
  color: #64748b;
}
.legenda .cor {
  display: inline-block;
  width: 14px;
  height: 8px;
  border-radius: 2px;
  margin-right: 6px;
  vertical-align: middle;
}
.legenda .cor.fina {
  height: 2px;
  background: rgba(100, 116, 139, 0.55);
}
.tabela-grupos :deep(th) {
  min-width: 84px;
  line-height: 1.25;
  padding: 8px 10px !important;
  font-weight: 700 !important;
  color: #475569 !important;
}
.tabela-grupos :deep(td) {
  padding: 0 10px !important;
  white-space: nowrap;
}
.tabela-grupos :deep(td:first-child) {
  white-space: normal;
  min-width: 140px;
}
.tabela-grupos :deep(tbody tr) {
  cursor: pointer;
}
@media print {
  .nao-imprimir {
    display: none !important;
  }
}
</style>
