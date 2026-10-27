<template>
  <div>
    <Teleport to="#relatorio-acoes" defer>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-file-delimited-outline" rounded="lg" :disabled="!dados" @click="exportarCsv">
        Exportar CSV
      </v-btn>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-printer-outline" rounded="lg" :disabled="!dados" @click="imprimir">
        Imprimir / PDF
      </v-btn>
    </Teleport>

    <FiltrosRelatorio :filtros="filtros" class="mb-5 nao-imprimir" />

    <v-alert v-if="isError" type="error" variant="tonal" rounded="xl" class="mb-5">
      Não foi possível carregar a visão geral. Tente novamente.
      <template #append>
        <v-btn variant="text" @click="refetch()">Tentar de novo</v-btn>
      </template>
    </v-alert>

    <template v-if="dados">
      <div class="d-flex align-center mb-3 text-body-2 text-grey-darken-1">
        <v-icon size="18" class="mr-1">mdi-calendar-blank-outline</v-icon>
        {{ descreverPeriodo(dados.periodo.inicio, dados.periodo.fim) }}
        <span class="mx-2">•</span>
        comparado com {{ descreverPeriodo(dados.periodo.inicioAnterior, dados.periodo.fimAnterior) }}
        <v-progress-circular v-if="isFetching" indeterminate size="16" width="2" color="primary" class="ml-3" />
      </div>

      <v-row v-if="dados.destaques.length" dense class="mb-2">
        <v-col v-for="(destaque, i) in dados.destaques" :key="i" cols="12" sm="6" lg="3">
          <div class="destaque pa-4 rounded-xl h-100 d-flex" :class="`destaque-${destaque.tipo}`">
            <v-icon :color="corDestaque(destaque.tipo)" class="mr-3 mt-1">{{ iconeDestaque(destaque.tipo) }}</v-icon>
            <div>
              <div class="text-body-2 font-weight-bold text-grey-darken-4">{{ destaque.titulo }}</div>
              <div class="text-caption text-grey-darken-1">{{ destaque.descricao }}</div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row dense class="mb-2">
        <v-col v-for="kpi in kpis" :key="kpi.titulo" cols="12" sm="6" lg="3">
          <KpiCard v-bind="kpi" @clique="kpi.drill && abrirDrill(kpi.drill.titulo, kpi.drill.status)" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" lg="8">
          <ChartCard
            titulo="Evolução no período"
            subtitulo="Linha tracejada = período anterior. Clique em um dia para ver os agendamentos."
            :option="opcoes.evolucao"
            :carregando="isFetching"
            :altura="320"
            @clique="cliqueDia"
          >
            <template #acoes>
              <v-btn-toggle v-model="metrica" mandatory density="compact" variant="outlined" divided rounded="lg" class="mr-2">
                <v-btn value="agendamentos" size="small" class="text-none">Agendamentos</v-btn>
                <v-btn value="concluidos" size="small" class="text-none">Concluídos</v-btn>
                <v-btn value="pesoKg" size="small" class="text-none">Toneladas</v-btn>
              </v-btn-toggle>
            </template>
          </ChartCard>
        </v-col>
        <v-col cols="12" lg="4">
          <ChartCard
            titulo="Distribuição por status"
            subtitulo="Clique em uma fatia para ver os agendamentos"
            :option="opcoes.status"
            :carregando="isFetching"
            :vazio="totalAgendamentos === 0"
            :altura="320"
            @clique="cliqueStatus"
          />
        </v-col>

        <v-col cols="12" lg="8">
          <ChartCard
            titulo="Volume recebido × meta diária"
            :subtitulo="subtituloVolume"
            ajuda="Toneladas das descargas concluídas em cada dia, pelo peso da nota fiscal."
            :option="opcoes.volume"
            :carregando="isFetching"
            :altura="300"
            @clique="cliqueVolume"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <ChartCard
            titulo="Funil da operação"
            subtitulo="Da reserva à descarga concluída"
            ajuda="Reservados: agendamentos não cancelados. Chegaram: tiveram check-in. Concluídos: descarga finalizada."
            :option="opcoes.funil"
            :carregando="isFetching"
            :vazio="dados.funil.reservados === 0"
            :altura="300"
          />
        </v-col>

        <v-col cols="12">
          <ChartCard
            titulo="Horários de pico"
            subtitulo="Quantos caminhões começam a descarregar em cada dia da semana e hora"
            ajuda="Use para redistribuir janelas da grade e escalar equipe nos horários mais cheios."
            :option="opcoes.heatmap"
            :carregando="isFetching"
            :vazio="totalAgendamentos === 0"
            :altura="340"
          />
        </v-col>

        <v-col cols="12">
          <ChartCard
            titulo="Ocupação planejada das docas por hora"
            :subtitulo="`${dados.docasAtivas} doca${dados.docasAtivas === 1 ? '' : 's'} ativa${dados.docasAtivas === 1 ? '' : 's'} • barras vermelhas acima de 85%, amarelas acima de 60%`"
            ajuda="Minutos agendados em cada hora divididos pela capacidade (docas ativas × 60 min × dias do período)."
            :option="opcoes.ocupacao"
            :carregando="isFetching"
            :vazio="totalAgendamentos === 0"
            :altura="300"
          />
        </v-col>

        <v-col cols="12" md="6">
          <ChartCard
            titulo="Fornecedores com mais volume"
            subtitulo="Clique para ver os agendamentos do fornecedor"
            :option="opcoes.fornecedores"
            :carregando="isFetching"
            :vazio="dados.topFornecedores.length === 0"
            :altura="260"
            @clique="(p: any) => cliqueRanking(p, 'fornecedor')"
          />
        </v-col>
        <v-col cols="12" md="6">
          <ChartCard
            titulo="Produtos com mais volume"
            subtitulo="Clique para ver os agendamentos do produto"
            :option="opcoes.produtos"
            :carregando="isFetching"
            :vazio="dados.topProdutos.length === 0"
            :altura="260"
            @clique="(p: any) => cliqueRanking(p, 'produto')"
          />
        </v-col>
      </v-row>
    </template>

    <v-row v-else-if="isLoading" dense>
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" lg="3">
        <v-skeleton-loader type="article" class="rounded-xl" />
      </v-col>
      <v-col cols="12"><v-skeleton-loader type="image" height="320" class="rounded-xl" /></v-col>
    </v-row>

    <DrillDownDialog v-model="drill.aberto" :titulo="drill.titulo" :filtro="drill.filtro" />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import ChartCard from "@/components/relatorios/ChartCard.vue";
import DrillDownDialog, { type FiltroDrillDown } from "@/components/relatorios/DrillDownDialog.vue";
import FiltrosRelatorio from "@/components/relatorios/FiltrosRelatorio.vue";
import KpiCard from "@/components/relatorios/KpiCard.vue";
import {
  evolucaoOption,
  funilOption,
  heatmapOption,
  type MetricaEvolucao,
  ocupacaoOption,
  rankingOption,
  STATUS_CONFIG,
  statusOption,
  volumeMetaOption,
} from "@/components/relatorios/charts/visaoGeralOptions";
import { useFiltrosRelatorio } from "@/composables/useFiltrosRelatorio";
import type { TipoDestaque } from "@/entities/relatorioBi.types";
import { useVisaoGeralQuery } from "@/queries/relatorioBi.queries";
import { descreverPeriodo, formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";

const filtros = useFiltrosRelatorio();
const { data: dados, isLoading, isFetching, isError, refetch } = useVisaoGeralQuery(filtros.filtroApi);

const metrica = ref<MetricaEvolucao>("agendamentos");

const totalAgendamentos = computed(() => dados.value?.indicadores.agendamentos.valor ?? 0);

const subtituloVolume = computed(() => {
  const meta = dados.value?.metaDiariaKg;
  if (meta) return `Meta de ${formatarToneladas(meta)} por dia (verde = meta batida)`;
  return filtros.quantidadeFiltros.value > 0
    ? "A meta é da empresa inteira: aparece só sem filtros de unidade, doca, fornecedor ou produto"
    : "Configure a meta diária em Empresa → Operação";
});

const opcoes = computed(() => {
  const d = dados.value!;
  return {
    evolucao: evolucaoOption(d.serieDiaria, d.serieDiariaAnterior, metrica.value),
    status: statusOption(d.porStatus),
    volume: volumeMetaOption(d.serieDiaria, d.metaDiariaKg),
    funil: funilOption(d.funil),
    heatmap: heatmapOption(d.heatmapDiaHora),
    ocupacao: ocupacaoOption(d.ocupacaoPorHora),
    fornecedores: rankingOption(d.topFornecedores),
    produtos: rankingOption(d.topProdutos),
  };
});

const kpis = computed(() => {
  const i = dados.value!.indicadores;
  const lista = [
    { titulo: "Agendamentos", valor: formatarNumero(i.agendamentos.valor), icone: "mdi-calendar-check", cor: "primary", variacao: i.agendamentos.variacaoPct, serie: i.agendamentos.serie, clicavel: true, drill: { titulo: "Agendamentos do período", status: undefined } },
    { titulo: "Descargas concluídas", valor: formatarNumero(i.concluidos.valor), icone: "mdi-truck-check", cor: "success", variacao: i.concluidos.variacaoPct, serie: i.concluidos.serie, clicavel: true, drill: { titulo: "Descargas concluídas", status: "Finalizado" } },
    { titulo: "Toneladas recebidas", valor: formatarToneladas(i.pesoRecebidoKg.valor), icone: "mdi-weight", cor: "indigo", variacao: i.pesoRecebidoKg.variacaoPct, serie: i.pesoRecebidoKg.serie, clicavel: true, drill: { titulo: "Descargas concluídas", status: "Finalizado" } },
    { titulo: "Comparecimento", valor: formatarPct(i.comparecimentoPct.valor), icone: "mdi-account-check-outline", cor: "teal", variacao: i.comparecimentoPct.variacaoPct, serie: i.comparecimentoPct.serie, detalhe: "compareceram ÷ esperados" },
    { titulo: "Peso médio por descarga", valor: formatarToneladas(i.pesoMedioKg.valor), icone: "mdi-scale-balance", cor: "deep-purple", variacao: i.pesoMedioKg.variacaoPct, serie: i.pesoMedioKg.serie },
    { titulo: "Meta do período", valor: formatarPct(i.atingimentoMetaPct), icone: "mdi-target", cor: "amber-darken-2", variacao: null, serie: [], detalhe: i.atingimentoMetaPct === null ? (filtros.quantidadeFiltros.value > 0 ? "disponível sem filtros" : "meta não configurada") : "atingido" },
    { titulo: "Não compareceu", valor: formatarNumero(i.naoCompareceu.valor), icone: "mdi-account-cancel-outline", cor: "error", variacao: i.naoCompareceu.variacaoPct, serie: i.naoCompareceu.serie, inverter: true, clicavel: true, drill: { titulo: "Não compareceram", status: "Expirado" } },
    { titulo: "Cancelados", valor: formatarNumero(i.cancelados.valor), icone: "mdi-cancel", cor: "grey", variacao: i.cancelados.variacaoPct, serie: i.cancelados.serie, inverter: true, clicavel: true, drill: { titulo: "Agendamentos cancelados", status: "Cancelado" } },
  ];
  return lista;
});

const drill = reactive<{ aberto: boolean; titulo: string; filtro: FiltroDrillDown }>({
  aberto: false,
  titulo: "",
  filtro: { dataInicio: "", dataFim: "" },
});

const abrirDrill = (titulo: string, status?: string, extra: Partial<FiltroDrillDown> = {}) => {
  const f = filtros.filtroApi.value;
  drill.titulo = titulo;
  drill.filtro = {
    dataInicio: f.inicio,
    dataFim: f.fim,
    status,
    fornecedorId: f.fornecedorId,
    produtoId: f.produtoId,
    unidadeEntregaId: f.unidadeEntregaId,
    ...extra,
  };
  drill.aberto = true;
};

const cliqueDia = (p: any) => {
  const dia = dados.value?.serieDiaria[p.dataIndex];
  if (!dia || p.seriesIndex !== 0) return;
  const status = metrica.value === "agendamentos" ? undefined : "Finalizado";
  abrirDrill(`Agendamentos de ${descreverPeriodo(dia.data, dia.data)}`, status, { dataInicio: dia.data, dataFim: dia.data });
};

const cliqueVolume = (p: any) => {
  const dia = dados.value?.serieDiaria[p.dataIndex];
  if (!dia) return;
  abrirDrill(`Descargas de ${descreverPeriodo(dia.data, dia.data)}`, "Finalizado", { dataInicio: dia.data, dataFim: dia.data });
};

const cliqueStatus = (p: any) => {
  const config = STATUS_CONFIG.find((s) => s.rotulo === p.name);
  if (config) abrirDrill(config.rotulo, config.api);
};

const cliqueRanking = (p: any, tipo: "fornecedor" | "produto") => {
  const lista = tipo === "fornecedor" ? dados.value?.topFornecedores : dados.value?.topProdutos;
  const item = lista ? [...lista].reverse()[p.dataIndex] : undefined;
  if (!item?.id) return;
  abrirDrill(item.nome, undefined, tipo === "fornecedor" ? { fornecedorId: item.id } : { produtoId: item.id });
};

const corDestaque = (tipo: TipoDestaque) => ({ info: "primary", success: "success", warning: "warning" })[tipo];
const iconeDestaque = (tipo: TipoDestaque) =>
  ({ info: "mdi-lightbulb-on-outline", success: "mdi-check-decagram-outline", warning: "mdi-alert-circle-outline" })[tipo];

const exportarCsv = () => {
  const d = dados.value;
  if (!d) return;
  const linhas: (string | number)[][] = [
    ["Relatório", "Visão geral da operação"],
    ["Período", descreverPeriodo(d.periodo.inicio, d.periodo.fim)],
    ["Comparado com", descreverPeriodo(d.periodo.inicioAnterior, d.periodo.fimAnterior)],
    [],
    ["Indicador", "Período", "Período anterior", "Variação %"],
    ...kpis.value.filter((k) => k.titulo !== "Meta do período").map((k) => {
      const chave = {
        Agendamentos: d.indicadores.agendamentos,
        "Descargas concluídas": d.indicadores.concluidos,
        "Toneladas recebidas": d.indicadores.pesoRecebidoKg,
        Comparecimento: d.indicadores.comparecimentoPct,
        "Peso médio por descarga": d.indicadores.pesoMedioKg,
        "Não compareceu": d.indicadores.naoCompareceu,
        Cancelados: d.indicadores.cancelados,
      }[k.titulo]!;
      return [k.titulo, chave.valor, chave.anterior, chave.variacaoPct ?? ""];
    }),
    ["Meta atingida %", d.indicadores.atingimentoMetaPct ?? ""],
    [],
    ["Data", "Agendamentos", "Concluídos", "Cancelados", "Não compareceu", "Peso recebido (kg)"],
    ...d.serieDiaria.map((dia) => [dia.data, dia.agendamentos, dia.concluidos, dia.cancelados, dia.naoCompareceu, dia.pesoKg]),
    [],
    ["Fornecedor", "Agendamentos", "Concluídos", "Peso (kg)", "% do volume"],
    ...d.topFornecedores.map((r) => [r.nome, r.agendamentos, r.concluidos, r.pesoKg, r.percentual]),
    [],
    ["Produto", "Agendamentos", "Concluídos", "Peso (kg)", "% do volume"],
    ...d.topProdutos.map((r) => [r.nome, r.agendamentos, r.concluidos, r.pesoKg, r.percentual]),
  ];

  const csv = linhas
    .map((linha) => linha.map((c) => `"${(typeof c === "number" ? String(c).replace(".", ",") : String(c)).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `visao-geral-${d.periodo.inicio}-a-${d.periodo.fim}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const imprimir = () => window.print();
</script>

<style scoped>
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
@media print {
  .nao-imprimir {
    display: none !important;
  }
}
</style>
