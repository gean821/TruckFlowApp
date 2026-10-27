import type { RelatorioBiFiltro } from "@/entities/relatorioBi.types";
import { paraIso } from "@/utils/relatorioFormat";
import { computed, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export type PresetPeriodo = "hoje" | "7d" | "30d" | "mes" | "mesPassado" | "trimestre" | "12m" | "personalizado";

export const PRESETS_PERIODO: { valor: PresetPeriodo; rotulo: string }[] = [
  { valor: "hoje", rotulo: "Hoje" },
  { valor: "7d", rotulo: "7 dias" },
  { valor: "30d", rotulo: "30 dias" },
  { valor: "mes", rotulo: "Este mês" },
  { valor: "mesPassado", rotulo: "Mês passado" },
  { valor: "trimestre", rotulo: "3 meses" },
  { valor: "12m", rotulo: "12 meses" },
  { valor: "personalizado", rotulo: "Personalizado" },
];

export function intervaloDoPreset(preset: PresetPeriodo, hoje = new Date()) {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const dia = hoje.getDate();

  switch (preset) {
    case "hoje":
      return { inicio: paraIso(hoje), fim: paraIso(hoje) };
    case "7d":
      return { inicio: paraIso(new Date(ano, mes, dia - 6)), fim: paraIso(hoje) };
    case "30d":
      return { inicio: paraIso(new Date(ano, mes, dia - 29)), fim: paraIso(hoje) };
    case "mesPassado":
      return { inicio: paraIso(new Date(ano, mes - 1, 1)), fim: paraIso(new Date(ano, mes, 0)) };
    case "trimestre":
      return { inicio: paraIso(new Date(ano, mes - 2, 1)), fim: paraIso(hoje) };
    case "12m":
      return { inicio: paraIso(new Date(ano, mes - 11, 1)), fim: paraIso(hoje) };
    default:
      return { inicio: paraIso(new Date(ano, mes, 1)), fim: paraIso(hoje) };
  }
}

const textoDaQuery = (valor: unknown) => (typeof valor === "string" && valor ? valor : null);

export function useFiltrosRelatorio() {
  const route = useRoute();
  const router = useRouter();

  const aplicado = computed<RelatorioBiFiltro & { preset: PresetPeriodo }>(() => {
    const preset = (textoDaQuery(route.query.periodo) as PresetPeriodo | null) ?? "mes";
    const padrao = intervaloDoPreset(preset === "personalizado" ? "mes" : preset);

    return {
      preset,
      inicio: preset === "personalizado" ? textoDaQuery(route.query.inicio) ?? padrao.inicio : padrao.inicio,
      fim: preset === "personalizado" ? textoDaQuery(route.query.fim) ?? padrao.fim : padrao.fim,
      unidadeEntregaId: textoDaQuery(route.query.unidade),
      localDescargaId: textoDaQuery(route.query.doca),
      fornecedorId: textoDaQuery(route.query.fornecedor),
      produtoId: textoDaQuery(route.query.produto),
    };
  });

  const rascunho = reactive({ ...aplicado.value });

  watch(aplicado, (valor) => Object.assign(rascunho, valor));

  watch(
    () => rascunho.preset,
    (preset) => {
      if (preset !== "personalizado") {
        Object.assign(rascunho, intervaloDoPreset(preset));
      }
    },
  );

  const alterado = computed(() =>
    (Object.keys(aplicado.value) as (keyof typeof aplicado.value)[]).some((k) => (rascunho[k] ?? null) !== (aplicado.value[k] ?? null)),
  );

  const quantidadeFiltros = computed(
    () => [aplicado.value.unidadeEntregaId, aplicado.value.localDescargaId, aplicado.value.fornecedorId, aplicado.value.produtoId].filter(Boolean).length,
  );

  const aplicar = () =>
    router.replace({
      query: {
        ...route.query,
        periodo: rascunho.preset,
        inicio: rascunho.preset === "personalizado" ? rascunho.inicio : undefined,
        fim: rascunho.preset === "personalizado" ? rascunho.fim : undefined,
        unidade: rascunho.unidadeEntregaId || undefined,
        doca: rascunho.localDescargaId || undefined,
        fornecedor: rascunho.fornecedorId || undefined,
        produto: rascunho.produtoId || undefined,
      },
    });

  const limpar = () => {
    Object.assign(rascunho, { unidadeEntregaId: null, localDescargaId: null, fornecedorId: null, produtoId: null });
    return aplicar();
  };

  const filtroApi = computed<RelatorioBiFiltro>(() => ({
    inicio: aplicado.value.inicio,
    fim: aplicado.value.fim,
    unidadeEntregaId: aplicado.value.unidadeEntregaId,
    localDescargaId: aplicado.value.localDescargaId,
    fornecedorId: aplicado.value.fornecedorId,
    produtoId: aplicado.value.produtoId,
  }));

  return { aplicado, rascunho, alterado, quantidadeFiltros, aplicar, limpar, filtroApi };
}
