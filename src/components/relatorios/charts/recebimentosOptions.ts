import type { EChartsOption } from "echarts";
import type { Agrupamento, RecebimentosBalde, RecebimentosFluxo, RecebimentosPlanejamento } from "@/entities/relatorioBi.types";
import { formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";
import { CORES, PALETA } from "./echarts";

const toneladas = (kg: number) => Math.round(kg / 100) / 10;

export const corDoProduto = (produto: string, produtos: string[]) =>
  produto === "Outros" ? CORES.cinza : PALETA[produtos.indexOf(produto) % PALETA.length]!;

export function mediaMovel(valores: number[], janela: number) {
  return valores.map((_, i) => {
    if (i < janela - 1) return null;
    const trecho = valores.slice(i - janela + 1, i + 1);
    return Math.round((trecho.reduce((a, b) => a + b, 0) / janela) * 10) / 10;
  });
}

export function volumeOption(serie: RecebimentosBalde[], produtos: string[], agrupamento: Agrupamento): EChartsOption {
  const totais = serie.map((b) => toneladas(b.totalKg));
  const janela = agrupamento === "dia" ? 7 : 3;
  const temMeta = serie.some((b) => b.metaKg);

  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const balde = serie[params[0].dataIndex]!;
        const linhas = params
          .filter((p: any) => p.value !== null && p.value !== undefined && p.value !== 0)
          .map((p: any) => `${p.marker} ${p.seriesName}: <b>${formatarNumero(Number(p.value), 1)} t</b>`)
          .join("<br/>");
        return `<b>${balde.rotulo}</b> • ${balde.descargas} descargas • ${formatarToneladas(balde.totalKg)}<br/>${linhas}`;
      },
    },
    legend: { top: 0, type: "scroll" },
    grid: { left: 8, right: 12, top: 40, bottom: serie.length > 40 ? 52 : 8, containLabel: true },
    xAxis: { type: "category", data: serie.map((b) => b.rotulo) },
    yAxis: { type: "value", axisLabel: { formatter: (v: number) => `${formatarNumero(v)} t` } },
    dataZoom: serie.length > 40 ? [{ type: "inside" }, { type: "slider", height: 18, bottom: 8 }] : undefined,
    series: [
      ...produtos.map((produto, i) => ({
        name: produto,
        type: "bar" as const,
        stack: "volume",
        barMaxWidth: 34,
        emphasis: { focus: "series" as const },
        itemStyle: { color: corDoProduto(produto, produtos), borderRadius: i === produtos.length - 1 ? [6, 6, 0, 0] : 0 },
        data: serie.map((b) => toneladas(b.porProduto[produto] ?? 0)),
      })),
      {
        name: `Média móvel (${janela} ${agrupamento === "dia" ? "dias" : agrupamento === "semana" ? "semanas" : "meses"})`,
        type: "line",
        smooth: true,
        symbol: "none",
        data: mediaMovel(totais, janela),
        lineStyle: { width: 3, color: CORES.texto },
        itemStyle: { color: CORES.texto },
        z: 10,
      },
      ...(temMeta
        ? [
            {
              name: "Meta",
              type: "line" as const,
              step: "middle" as const,
              symbol: "none",
              data: serie.map((b) => (b.metaKg ? toneladas(b.metaKg) : null)),
              lineStyle: { width: 2, type: "dashed" as const, color: CORES.alerta },
              itemStyle: { color: CORES.alerta },
              z: 9,
            },
          ]
        : []),
    ],
  };
}

const COR_TIPO = { fornecedor: CORES.primaria, produto: CORES.sucesso, unidade: CORES.roxo };

export function fluxoOption(fluxo: RecebimentosFluxo): EChartsOption {
  const nomes = Object.fromEntries(fluxo.nos.map((n) => [n.id, n.nome]));
  const produtos = fluxo.nos.filter((n) => n.tipo === "produto").map((n) => n.id);

  return {
    animationDuration: 900,
    tooltip: {
      trigger: "item",
      formatter: (p: any) =>
        p.dataType === "edge"
          ? `${nomes[p.data.source]} → ${nomes[p.data.target]}<br/><b>${formatarToneladas(p.data.value)}</b>`
          : `<b>${nomes[p.name]}</b><br/>${formatarToneladas(p.value)}`,
    },
    series: [
      {
        type: "sankey",
        left: 8,
        right: 140,
        top: 8,
        bottom: 8,
        nodeGap: 14,
        nodeWidth: 14,
        layoutIterations: 64,
        emphasis: { focus: "adjacency" },
        label: { color: CORES.texto, fontSize: 12, formatter: (p: any) => nomes[p.name] ?? p.name },
        lineStyle: { color: "gradient", curveness: 0.5, opacity: 0.35 },
        itemStyle: { borderWidth: 0, borderRadius: 3 },
        data: fluxo.nos.map((n) => ({
          name: n.id,
          itemStyle: { color: n.tipo === "produto" ? PALETA[produtos.indexOf(n.id) % PALETA.length] : COR_TIPO[n.tipo] },
        })),
        links: fluxo.ligacoes.map((l) => ({ source: l.origem, target: l.destino, value: l.kg })),
      },
    ],
  };
}

export const COR_SITUACAO: Record<string, string> = {
  Adiantado: CORES.sucesso,
  "No ritmo": CORES.primaria,
  Atrasado: CORES.perigo,
  "Sem previsão no período": CORES.cinza,
};

export function planejamentoOption(itens: RecebimentosPlanejamento[]): EChartsOption {
  const ordenados = [...itens].reverse();
  const rotulo = (p: RecebimentosPlanejamento) => {
    const texto = `${p.fornecedor} • ${p.produto}`;
    return texto.length > 34 ? `${texto.slice(0, 33)}…` : texto;
  };

  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = ordenados[params[0].dataIndex]!;
        return `<b>${p.fornecedor}</b> • ${p.produto}<br/>Planejado: ${formatarToneladas(p.planejadoKg)}<br/>Recebido: ${formatarToneladas(p.recebidoKg)}<br/>${p.situacao} (${formatarPct(p.cumprimentoPct)})`;
      },
    },
    legend: { top: 0, right: 0 },
    grid: { left: 8, right: 64, top: 32, bottom: 4, containLabel: true },
    xAxis: { type: "value", axisLabel: { formatter: (v: number) => `${formatarNumero(v / 1000)} t` } },
    yAxis: { type: "category", data: ordenados.map(rotulo), axisLabel: { color: CORES.texto } },
    series: [
      {
        name: "Planejado",
        type: "bar",
        barGap: "-100%",
        barWidth: 18,
        itemStyle: { color: CORES.trilho, borderRadius: 6 },
        data: ordenados.map((p) => p.planejadoKg),
        z: 1,
      },
      {
        name: "Recebido",
        type: "bar",
        barWidth: 18,
        label: { show: true, position: "right", color: CORES.textoSuave, formatter: (p: any) => formatarPct(ordenados[p.dataIndex]!.cumprimentoPct, 0) },
        data: ordenados.map((p) => ({ value: p.recebidoKg, itemStyle: { color: COR_SITUACAO[p.situacao] ?? CORES.primaria, borderRadius: 6 } })),
        z: 2,
      },
    ],
  };
}
