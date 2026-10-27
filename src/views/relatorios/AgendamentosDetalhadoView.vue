<template>
  <div>
    <Teleport to="#relatorio-acoes" defer>
      <v-menu location="bottom end">
        <template #activator="{ props: menu }">
          <v-btn v-bind="menu" color="primary" variant="tonal" prepend-icon="mdi-download" append-icon="mdi-chevron-down" rounded="lg" :loading="exportando" :disabled="!total">
            Exportar
          </v-btn>
        </template>
        <v-list density="compact" min-width="260" class="rounded-lg">
          <v-list-subheader>{{ formatarNumero(total) }} agendamento{{ total === 1 ? "" : "s" }} com os filtros atuais</v-list-subheader>
          <v-list-item prepend-icon="mdi-microsoft-excel" title="Excel (.xlsx)" subtitle="Planilha com filtros e colunas formatadas" @click="exportar('xlsx')" />
          <v-list-item prepend-icon="mdi-file-delimited-outline" title="CSV (.csv)" subtitle="Até 100 mil linhas" @click="exportar('csv')" />
          <v-list-item
            prepend-icon="mdi-file-pdf-box"
            title="PDF (.pdf)"
            :subtitle="total > LIMITE_PDF ? `Refine os filtros: o PDF vai até ${formatarNumero(LIMITE_PDF)}` : 'Pronto para imprimir'"
            :disabled="total > LIMITE_PDF"
            @click="exportar('pdf')"
          />
        </v-list>
      </v-menu>
    </Teleport>

    <FiltrosRelatorio :filtros="filtros" class="mb-3" />

    <v-card elevation="0" class="rounded-xl pa-4 mb-5 filtros-extra">
      <v-row dense align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="busca"
            label="Buscar placa, motorista, fornecedor ou nota"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="6" md="2">
          <v-select
            :model-value="origem"
            :items="ORIGENS"
            item-title="rotulo"
            item-value="valor"
            label="Origem"
            density="compact"
            variant="outlined"
            clearable
            hide-details
            @update:model-value="atualizarQuery({ origem: $event || undefined })"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            :model-value="chegada"
            :items="SITUACOES_CHEGADA"
            item-title="rotulo"
            item-value="valor"
            label="Chegada"
            density="compact"
            variant="outlined"
            clearable
            hide-details
            @update:model-value="atualizarQuery({ chegada: $event || undefined })"
          >
            <template #item="{ props: item, item: opcao }">
              <v-list-item v-bind="item" :prepend-icon="opcao.raw.icone" :base-color="opcao.raw.cor" />
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-end" style="gap: 8px">
          <v-btn v-if="temFiltroExtra" variant="text" size="small" prepend-icon="mdi-filter-remove-outline" class="text-none" @click="limparExtras">
            Limpar
          </v-btn>
          <v-menu :close-on-content-click="false" location="bottom end">
            <template #activator="{ props: menu }">
              <v-btn v-bind="menu" variant="outlined" size="small" prepend-icon="mdi-table-column" rounded="lg" class="text-none">
                Colunas ({{ colunasVisiveis.length }})
              </v-btn>
            </template>
            <v-card min-width="240" class="rounded-lg pa-2">
              <v-checkbox
                v-for="coluna in COLUNAS_DETALHADO"
                :key="coluna.key"
                v-model="colunasVisiveis"
                :value="coluna.key"
                :label="coluna.title"
                density="compact"
                hide-details
              />
              <v-divider class="my-1" />
              <v-btn variant="text" size="small" block class="text-none" @click="colunasVisiveis = [...COLUNAS_PADRAO]">Restaurar padrão</v-btn>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
      <div class="d-flex flex-wrap align-center mt-3" style="gap: 6px">
        <span class="text-caption text-grey-darken-1 mr-1">Status:</span>
        <v-chip
          v-for="s in STATUS_AGENDAMENTO"
          :key="s.valor"
          :color="s.cor"
          :variant="statusSelecionados.includes(s.valor) ? 'flat' : 'outlined'"
          size="small"
          :prepend-icon="s.icone"
          class="font-weight-medium"
          @click="alternarStatus(s.valor)"
        >
          {{ s.rotulo }}
          <span v-if="quantidadePorStatus[s.valor] !== undefined" class="ml-1 contagem">{{ formatarNumero(quantidadePorStatus[s.valor]!) }}</span>
        </v-chip>
      </div>
    </v-card>

    <v-alert v-if="isError" type="error" variant="tonal" rounded="xl" class="mb-5">
      {{ mensagemErro }}
      <template #append><v-btn variant="text" @click="refetch()">Tentar de novo</v-btn></template>
    </v-alert>

    <template v-if="resumo">
      <v-row dense class="mb-2">
        <v-col v-for="{ acao, ...kpi } in kpis" :key="kpi.titulo" cols="12" sm="6" lg="3">
          <KpiCard v-bind="kpi" @clique="acao?.()" />
        </v-col>
      </v-row>

      <v-card v-if="resumo.total" elevation="0" class="rounded-xl pa-4 mb-5 painel">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">Distribuição por status</div>
          <div class="text-caption text-grey-darken-1">Clique para filtrar</div>
        </div>
        <div class="barra-status d-flex rounded-lg overflow-hidden">
          <v-tooltip v-for="s in resumo.porStatus" :key="s.status" location="top">
            <template #activator="{ props: tip }">
              <div
                v-bind="tip"
                class="segmento"
                :class="`bg-${metaStatus(s.status).cor}`"
                :style="{ width: `${(s.quantidade * 100) / resumo.total}%`, opacity: statusSelecionados.length && !statusSelecionados.includes(s.status) ? 0.35 : 1 }"
                @click="alternarStatus(s.status)"
              />
            </template>
            {{ s.rotulo }}: {{ formatarNumero(s.quantidade) }} ({{ formatarPct((s.quantidade * 100) / resumo.total) }})
          </v-tooltip>
        </div>
        <div class="d-flex flex-wrap mt-2" style="gap: 16px">
          <div v-for="s in resumo.porStatus" :key="s.status" class="text-caption d-flex align-center">
            <span class="ponto mr-1" :class="`bg-${metaStatus(s.status).cor}`" />
            {{ s.rotulo }} <strong class="ml-1">{{ formatarPct((s.quantidade * 100) / resumo.total, 0) }}</strong>
          </div>
        </div>
      </v-card>
    </template>

    <v-card elevation="0" class="rounded-xl painel">
      <v-data-table-server
        v-model:items-per-page="porPagina"
        v-model:page="pagina"
        v-model:sort-by="ordenacao"
        :headers="cabecalhos"
        :items="itens"
        :items-length="total"
        :loading="isFetching"
        :items-per-page-options="[10, 25, 50, 100]"
        must-sort
        hover
        density="comfortable"
        loading-text="Carregando agendamentos..."
        no-data-text="Nenhum agendamento com esses filtros"
        items-per-page-text="Por página"
        class="tabela"
        @click:row="(_: unknown, linha: { item: AgendamentoDetalhado }) => abrir(linha.item)"
      >
        <template #item.janela="{ item }">
          <div class="text-body-2 font-weight-medium text-no-wrap">{{ formatarDia(item.dataInicio) }}</div>
          <div class="text-caption text-grey-darken-1 text-no-wrap">{{ formatarHora(item.dataInicio) }} – {{ formatarHora(item.dataFim) }}</div>
        </template>
        <template #item.status="{ item }">
          <v-chip size="x-small" :color="metaStatus(item.status).cor" variant="tonal" class="font-weight-medium">{{ item.statusRotulo }}</v-chip>
        </template>
        <template #item.motorista="{ item }">
          <div class="text-body-2">{{ item.motoristaNome || "—" }}</div>
          <div v-if="item.motoristaTelefone" class="text-caption text-grey-darken-1">{{ item.motoristaTelefone }}</div>
        </template>
        <template #item.placa="{ item }">
          <div class="text-body-2 font-weight-bold placa text-no-wrap">{{ item.placaVeiculo || "—" }}</div>
          <div v-if="item.tipoVeiculo" class="text-caption text-grey-darken-1">{{ item.tipoVeiculo }}</div>
        </template>
        <template #item.fornecedor="{ item }">{{ item.fornecedorNome || "—" }}</template>
        <template #item.produto="{ item }"><span class="text-no-wrap">{{ item.produto }}</span></template>
        <template #item.notaFiscal="{ item }">{{ item.notaFiscalNumero ?? "—" }}</template>
        <template #item.unidade="{ item }">{{ item.unidadeEntrega || "—" }}</template>
        <template #item.doca="{ item }">{{ item.localDescarga || "—" }}</template>
        <template #item.origem="{ item }">
          <v-chip size="x-small" variant="outlined">{{ item.origem === "Grade" ? "Grade" : "Avulso" }}</v-chip>
        </template>
        <template #item.peso="{ item }">
          <span class="text-no-wrap">{{ item.pesoKg ? `${formatarNumero(item.pesoKg)} kg` : "—" }}</span>
        </template>
        <template #item.chegada="{ item }">
          <template v-if="item.chegouEm">
            <div class="text-body-2 text-no-wrap">{{ formatarHora(item.chegouEm) }}</div>
            <v-chip v-if="metaSituacao(item.situacaoChegada)" size="x-small" variant="tonal" :color="metaSituacao(item.situacaoChegada)!.cor">
              {{ metaSituacao(item.situacaoChegada)!.rotulo }}
              <template v-if="item.situacaoChegada === 'Atrasado' && item.atrasoChegadaMin !== null"> +{{ formatarDuracao(item.atrasoChegadaMin) }}</template>
            </v-chip>
          </template>
          <v-chip v-else-if="item.situacaoChegada === 'NaoCompareceu'" size="x-small" variant="tonal" color="error">Não veio</v-chip>
          <span v-else class="text-grey">—</span>
        </template>
        <template #item.inicioDescarga="{ item }">
          <span class="text-no-wrap">{{ item.inicioDescarga ? formatarHora(item.inicioDescarga) : "—" }}</span>
          <span v-if="item.inicioDescarga && item.inicioEstimado" class="estimado" title="Estimado">*</span>
        </template>
        <template #item.fimDescarga="{ item }">{{ item.fimDescargaEm ? formatarHora(item.fimDescargaEm) : "—" }}</template>
        <template #item.saida="{ item }">
          <span class="text-no-wrap">{{ item.saida ? formatarHora(item.saida) : "—" }}</span>
          <span v-if="item.saida && item.saidaEstimada" class="estimado" title="Estimada">*</span>
        </template>
        <template #item.espera="{ item }">
          <span class="text-no-wrap" :class="corTempo(item.esperaMin, resumo?.esperaP90Min ?? null)">{{ item.esperaMin !== null ? formatarDuracao(item.esperaMin) : "—" }}</span>
        </template>
        <template #item.descarga="{ item }">
          <span class="text-no-wrap">{{ item.descargaMin !== null ? formatarDuracao(item.descargaMin) : "—" }}<span v-if="item.descargaMin !== null && item.inicioEstimado" class="estimado">*</span></span>
        </template>
        <template #item.permanencia="{ item }"><span class="text-no-wrap">{{ item.permanenciaMin !== null ? formatarDuracao(item.permanenciaMin) : "—" }}</span></template>
      </v-data-table-server>
      <div v-if="resumo?.temposEstimados" class="text-caption text-grey-darken-1 px-4 pb-3">
        * Estimado: sem a captura do início da descarga, ele é calculado pela chegada e pelo fim do caminhão anterior na mesma doca.
      </div>
    </v-card>

    <AgendamentoDetalheDialog v-model="detalheAberto" :agendamento="selecionado" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import FiltrosRelatorio from "@/components/relatorios/FiltrosRelatorio.vue";
import KpiCard from "@/components/relatorios/KpiCard.vue";
import AgendamentoDetalheDialog from "@/components/relatorios/AgendamentoDetalheDialog.vue";
import {
  COLUNAS_DETALHADO,
  COLUNAS_PADRAO,
  ORIGENS,
  SITUACOES_CHEGADA,
  STATUS_AGENDAMENTO,
  lerLista,
  lerOpcao,
  metaSituacao,
  metaStatus,
  ordenacaoValida,
} from "@/components/relatorios/agendamentosDetalhado";
import { useFiltrosRelatorio } from "@/composables/useFiltrosRelatorio";
import type IRelatorioAgendamentoFilterDto from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";
import type { FormatoRelatorio } from "@/Dtos/relatorio/relatorioAgendamentoFilter.dto";
import type { AgendamentoDetalhado } from "@/entities/relatorioAgendamentos.types";
import { useRelatorio } from "@/hooks/useRelatorio";
import { useAgendamentosDetalhadoQuery, useAgendamentosResumoQuery } from "@/queries/relatorioAgendamentos.queries";
import { formatarDuracao, formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";

const LIMITE_PDF = 5000;
const CHAVE_COLUNAS = "tf.relatorio.agendamentos.colunas";
const CHAVE_POR_PAGINA = "tf.relatorio.agendamentos.porPagina";

const route = useRoute();
const router = useRouter();
const filtros = useFiltrosRelatorio();
const { gerarRelatorio } = useRelatorio();

const lerArmazenado = <T,>(chave: string, padrao: T): T => {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? (JSON.parse(valor) as T) : padrao;
  } catch {
    return padrao;
  }
};

const gravarArmazenado = (chave: string, valor: unknown) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    return;
  }
};

const statusSelecionados = computed(() => lerLista(route.query.status, STATUS_AGENDAMENTO.map((s) => s.valor)));
const origem = computed(() => lerOpcao(route.query.origem, ORIGENS.map((o) => o.valor)));
const chegada = computed(() => lerOpcao(route.query.chegada, SITUACOES_CHEGADA.map((s) => s.valor)));
const buscaAplicada = computed(() => (typeof route.query.busca === "string" ? route.query.busca : ""));
const ordenarPor = computed(() => ordenacaoValida(route.query.ordenar) ?? "janela");
const desc = computed(() => (route.query.ordenar ? route.query.desc === "1" : true));

const atualizarQuery = (valores: Record<string, string | undefined>) =>
  router.replace({ query: { ...route.query, ...valores } });

const busca = ref(buscaAplicada.value);
let temporizador: ReturnType<typeof setTimeout> | undefined;
watch(busca, (valor) => {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => atualizarQuery({ busca: valor?.trim() || undefined }), 400);
});
watch(buscaAplicada, (valor) => {
  if ((busca.value ?? "").trim() !== valor) busca.value = valor;
});

const alternarStatus = (status: string) => {
  const atual = statusSelecionados.value;
  const proximo = atual.includes(status) ? atual.filter((s) => s !== status) : [...atual, status];
  atualizarQuery({ status: proximo.length ? proximo.join(",") : undefined });
};

const temFiltroExtra = computed(() => !!(statusSelecionados.value.length || origem.value || chegada.value || buscaAplicada.value));
const limparExtras = () => {
  busca.value = "";
  atualizarQuery({ status: undefined, origem: undefined, chegada: undefined, busca: undefined });
};

const ordenacao = computed({
  get: () => [{ key: ordenarPor.value, order: desc.value ? ("desc" as const) : ("asc" as const) }],
  set: (valor: { key: string; order?: boolean | "asc" | "desc" }[]) => {
    const item = valor[0];
    if (!item) return;
    atualizarQuery({ ordenar: item.key, desc: item.order === "desc" ? "1" : undefined });
  },
});

const filtrosApi = computed<IRelatorioAgendamentoFilterDto>(() => {
  const f = filtros.filtroApi.value;
  return {
    dataInicio: f.inicio,
    dataFim: f.fim,
    unidadeEntregaId: f.unidadeEntregaId ?? undefined,
    localDescargaId: f.localDescargaId ?? undefined,
    fornecedorId: f.fornecedorId ?? undefined,
    produtoId: f.produtoId ?? undefined,
    status: statusSelecionados.value.length ? statusSelecionados.value : undefined,
    origem: origem.value ?? undefined,
    chegada: chegada.value ?? undefined,
    busca: buscaAplicada.value || undefined,
    ordenarPor: ordenarPor.value,
    desc: desc.value,
  };
});

const pagina = ref(1);
const porPagina = ref<number>(lerArmazenado(CHAVE_POR_PAGINA, 25));
watch(porPagina, (valor) => gravarArmazenado(CHAVE_POR_PAGINA, valor));
watch(filtrosApi, () => (pagina.value = 1), { deep: true });

const colunasVisiveis = ref<string[]>(
  lerArmazenado<string[]>(CHAVE_COLUNAS, COLUNAS_PADRAO).filter((k) => COLUNAS_DETALHADO.some((c) => c.key === k)),
);
watch(colunasVisiveis, (valor) => gravarArmazenado(CHAVE_COLUNAS, valor), { deep: true });

const cabecalhos = computed(() =>
  COLUNAS_DETALHADO.filter((c) => colunasVisiveis.value.includes(c.key)).map((c) => ({
    title: c.title,
    key: c.key,
    sortable: c.sortable,
    align: c.align,
  })),
);

const { data, isFetching, isError, error, refetch } = useAgendamentosDetalhadoQuery(filtrosApi, pagina, porPagina);
const { data: resumo } = useAgendamentosResumoQuery(filtrosApi);
const filtrosSemStatus = computed<IRelatorioAgendamentoFilterDto>(() => ({ ...filtrosApi.value, status: undefined }));
const { data: resumoSemStatus } = useAgendamentosResumoQuery(filtrosSemStatus);

const itens = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.totalCount ?? 0);
const mensagemErro = computed(
  () => (error.value as { response?: { data?: { message?: string } } } | null)?.response?.data?.message ?? "Não foi possível carregar os agendamentos.",
);

const quantidadePorStatus = computed<Record<string, number>>(() =>
  Object.fromEntries((resumoSemStatus.value?.porStatus ?? []).map((s) => [s.status, s.quantidade])),
);

const kpis = computed(() => {
  const r = resumo.value!;
  return [
    {
      titulo: "Agendamentos",
      valor: formatarNumero(r.total),
      icone: "mdi-calendar-multiple-check",
      cor: "primary",
      detalhe: `${formatarToneladas(r.pesoTotalKg)} agendadas`,
    },
    {
      titulo: "Pontualidade",
      valor: formatarPct(r.pontualidadePct),
      icone: "mdi-clock-check-outline",
      cor: "success",
      detalhe: r.chegaram ? `${formatarNumero(r.adiantados + r.noHorario)} de ${formatarNumero(r.chegaram)} chegaram até o fim da janela` : "Nenhuma chegada registrada",
    },
    {
      titulo: "Chegaram atrasados",
      valor: formatarNumero(r.atrasados),
      icone: "mdi-clock-alert-outline",
      cor: "warning",
      detalhe: r.atrasoMedioMin !== null ? `Em média ${formatarDuracao(r.atrasoMedioMin)} após o início da janela` : "Nenhum caminhão chegou depois da janela",
      clicavel: r.atrasados > 0 || chegada.value === "Atrasado",
      acao: () => atualizarQuery({ chegada: chegada.value === "Atrasado" ? undefined : "Atrasado" }),
    },
    {
      titulo: "Não compareceram",
      valor: formatarNumero(r.naoCompareceram),
      icone: "mdi-account-cancel-outline",
      cor: "error",
      detalhe: r.total ? `${formatarPct((r.naoCompareceram * 100) / r.total)} dos agendamentos` : "—",
      clicavel: true,
      acao: () => atualizarQuery({ chegada: chegada.value === "NaoCompareceu" ? undefined : "NaoCompareceu" }),
    },
    {
      titulo: "Espera média no pátio",
      valor: formatarDuracao(r.esperaMediaMin),
      icone: "mdi-timer-sand",
      cor: "deep-orange",
      detalhe: r.esperaP90Min !== null ? `9 em cada 10 esperaram até ${formatarDuracao(r.esperaP90Min)}` : "Sem descargas concluídas",
    },
    {
      titulo: "Descarga média",
      valor: formatarDuracao(r.descargaMediaMin),
      icone: "mdi-tray-arrow-down",
      cor: "blue",
      detalhe: r.temposEstimados ? "Início da descarga estimado" : "Do início ao fim da descarga",
    },
    {
      titulo: "Permanência média",
      valor: formatarDuracao(r.permanenciaMediaMin),
      icone: "mdi-map-marker-path",
      cor: "indigo",
      detalhe: "Da chegada à saída",
    },
    {
      titulo: "Chegadas registradas",
      valor: formatarNumero(r.chegaram),
      icone: "mdi-gate",
      cor: "teal",
      detalhe: r.total ? `${formatarPct((r.chegaram * 100) / r.total)} dos agendamentos` : "—",
    },
  ];
});

const corTempo = (minutos: number | null, p90: number | null) =>
  minutos !== null && p90 !== null && p90 > 0 && minutos >= p90 ? "text-deep-orange font-weight-bold" : "";

const detalheAberto = ref(false);
const selecionado = ref<AgendamentoDetalhado | null>(null);
const abrir = (item: AgendamentoDetalhado) => {
  selecionado.value = item;
  detalheAberto.value = true;
};

const exportando = ref(false);
const exportar = async (formato: FormatoRelatorio) => {
  exportando.value = true;
  try {
    await gerarRelatorio({ filtros: filtrosApi.value, formato });
  } catch {
    return;
  } finally {
    exportando.value = false;
  }
};

const formatarDia = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });
const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
</script>

<style scoped>
.filtros-extra,
.painel {
  border: 1px solid rgba(15, 23, 42, 0.08);
}
.barra-status {
  height: 14px;
  background: rgba(15, 23, 42, 0.05);
}
.segmento {
  cursor: pointer;
  transition: opacity 0.2s;
}
.ponto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.contagem {
  opacity: 0.75;
  font-weight: 600;
}
.placa {
  letter-spacing: 0.04em;
}
.estimado {
  color: #b45309;
  font-weight: 700;
  margin-left: 2px;
}
.tabela :deep(tbody tr) {
  cursor: pointer;
}
</style>
