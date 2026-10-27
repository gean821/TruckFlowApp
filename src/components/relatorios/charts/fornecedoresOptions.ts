import type { EChartsOption } from "echarts";
import type { FornecedorDesempenho, FornecedorFaixaChegada, FornecedorGrupo, FornecedoresBalde } from "@/entities/relatorioBi.types";
import { formatarDuracao, formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";
import { CORES } from "./echarts";

export const COR_CLASSIFICACAO: Record<string, string> = {
  Excelente: CORES.sucesso,
  Bom: CORES.primaria,
  Atenção: CORES.alerta,
  Crítico: CORES.perigo,
  "Poucos dados": CORES.cinza,
  "Sem cadastro": "#CBD5E1",
};

export const corClassificacao = (classificacao: string) => COR_CLASSIFICACAO[classificacao] ?? CORES.cinza;

const pct = (v: number | null | undefined) => (v === null || v === undefined ? "—" : formatarPct(v));

export function matrizOption(ranking: FornecedorDesempenho[]): EChartsOption {
  const avaliados = ranking.filter((f) => f.id && f.pontualidadePct !== null && f.pesoKg > 0);
  const volumes = avaliados.map((f) => f.pesoKg / 1000).sort((a, b) => a - b);
  const mediana = volumes.length ? volumes[Math.floor(volumes.length / 2)]! : 0;
  const maxAgendamentos = Math.max(1, ...avaliados.map((f) => f.agendamentos));
  const menorPontualidade = Math.min(100, ...avaliados.map((f) => f.pontualidadePct!));
  const xMin = Math.max(0, Math.min(80, Math.floor((menorPontualidade - 10) / 10) * 10));

  return {
    grid: { left: 8, right: 24, top: 24, bottom: 8, containLabel: true },
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const f = avaliados[p.dataIndex];
        if (!f) return "";
        return [
          `<b>${f.nome}</b>`,
          `Score: <b>${f.score ?? "—"}</b> (${f.classificacao})`,
          `Recebido: <b>${formatarToneladas(f.pesoKg)}</b> (${formatarPct(f.pctVolume)} do total)`,
          `Pontualidade: <b>${pct(f.pontualidadePct)}</b>`,
          `Faltas: ${pct(f.noShowPct)} • Cancelamentos: ${pct(f.cancelamentoPct)}`,
          `${formatarNumero(f.agendamentos)} agendamentos`,
        ].join("<br/>");
      },
    },
    xAxis: {
      type: "value",
      name: "pontualidade",
      nameLocation: "middle",
      nameGap: 28,
      min: xMin,
      max: 105,
      interval: xMin >= 60 ? 5 : 10,
      axisLabel: { formatter: (v: number) => (v > 100 ? "" : `${v}%`) },
      nameTextStyle: { color: CORES.textoSuave },
    },
    yAxis: { type: "value", name: "toneladas", nameTextStyle: { color: CORES.textoSuave }, axisLabel: { formatter: (v: number) => formatarNumero(v) } },
    series: [
      {
        type: "scatter",
        cursor: "pointer",
        labelLayout: { hideOverlap: true, moveOverlap: "shiftY" },
        data: avaliados.map((f) => ({
          value: [f.pontualidadePct, Math.round(f.pesoKg / 100) / 10],
          symbolSize: 14 + (f.agendamentos / maxAgendamentos) * 30,
          itemStyle: { color: corClassificacao(f.classificacao), opacity: 0.85, borderColor: "#fff", borderWidth: 2 },
          label: { show: true, formatter: f.nome.length > 18 ? `${f.nome.slice(0, 17)}…` : f.nome, position: "top", color: CORES.texto, fontSize: 11 },
        })),
        markLine: {
          symbol: "none",
          silent: true,
          lineStyle: { color: "#CBD5E1", type: "dashed" },
          label: { show: false },
          data: [{ xAxis: 85 }, ...(mediana > 0 ? [{ yAxis: mediana }] : [])],
        },
        markArea: {
          silent: true,
          itemStyle: { color: "rgba(239, 68, 68, 0.04)" },
          label: { show: true, position: "insideTopLeft", color: CORES.perigo, fontSize: 11 },
          data: mediana > 0 && xMin < 85 ? [[{ name: "Muito volume, pouca pontualidade", xAxis: xMin, yAxis: mediana }, { xAxis: 85, yAxis: "max" }]] : [],
        },
      },
    ],
  };
}

export function comparativoOption(ranking: FornecedorDesempenho[]): EChartsOption {
  const top = ranking.filter((f) => f.id).slice(0, 12);
  const pontuais = top.map((f) => f.adiantados + f.noHorario);
  const outros = top.map((f) => Math.max(0, f.agendamentos - f.adiantados - f.noHorario - f.atrasados - f.naoCompareceu - f.cancelados));

  const serie = (name: string, data: number[], color: string) => ({
    name,
    type: "bar" as const,
    stack: "total",
    data,
    itemStyle: { color },
    barMaxWidth: 22,
    emphasis: { focus: "series" as const },
  });

  return {
    grid: { left: 8, right: 16, top: 36, bottom: 8, containLabel: true },
    legend: { top: 0, left: 0, type: "scroll" },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: { type: "value", minInterval: 1 },
    yAxis: { type: "category", data: top.map((f) => f.nome), inverse: true, axisLabel: { width: 150, overflow: "truncate" } },
    series: [
      serie("Chegou na janela", pontuais, CORES.sucesso),
      serie("Chegou atrasado", top.map((f) => f.atrasados), CORES.alerta),
      serie("Não compareceu", top.map((f) => f.naoCompareceu), CORES.perigo),
      serie("Cancelado", top.map((f) => f.cancelados), CORES.cinza),
      serie("Ainda por vir / no pátio", outros, "#CBD5E1"),
    ],
  };
}

export function evolucaoOption(serie: FornecedoresBalde[], comparacao?: FornecedoresBalde[]): EChartsOption {
  const linha = (valores: (number | null)[]) => valores.map((v) => (v === null ? "-" : v));
  const series: any[] = [
    {
      name: "Agendamentos",
      type: "bar",
      yAxisIndex: 1,
      data: serie.map((b) => b.agendamentos),
      itemStyle: { color: "#E2E8F0", borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 18,
    },
    { name: "Pontualidade", type: "line", smooth: true, connectNulls: true, symbolSize: 6, data: linha(serie.map((b) => b.pontualidadePct)), itemStyle: { color: CORES.sucesso }, lineStyle: { width: 3 } },
    { name: "Faltas", type: "line", smooth: true, connectNulls: true, symbolSize: 6, data: linha(serie.map((b) => b.noShowPct)), itemStyle: { color: CORES.perigo }, lineStyle: { width: 2 } },
    { name: "Cancelamentos", type: "line", smooth: true, connectNulls: true, symbol: "none", data: linha(serie.map((b) => b.cancelamentoPct)), itemStyle: { color: CORES.cinza }, lineStyle: { width: 1.5, type: "dashed" } },
  ];

  if (comparacao) {
    series.push({
      name: "Pontualidade de todos",
      type: "line",
      smooth: true,
      connectNulls: true,
      symbol: "none",
      data: linha(comparacao.map((b) => b.pontualidadePct)),
      itemStyle: { color: CORES.primariaClara },
      lineStyle: { width: 1.5, type: "dotted" },
    });
  }

  return {
    grid: { left: 8, right: 8, top: 56, bottom: 8, containLabel: true },
    legend: { top: 0, left: 0, type: "scroll" },
    tooltip: {
      trigger: "axis",
      valueFormatter: (v: any) => (typeof v === "number" ? formatarNumero(v, 1) : "—"),
    },
    xAxis: { type: "category", data: serie.map((b) => b.rotulo) },
    yAxis: [
      { type: "value", min: 0, max: 100, axisLabel: { formatter: "{value}%" } },
      { type: "value", position: "right", splitLine: { show: false }, minInterval: 1, name: "agend.", nameTextStyle: { color: CORES.textoSuave } },
    ],
    series,
  };
}

export function chegadaOption(faixas: FornecedorFaixaChegada[]): EChartsOption {
  const total = faixas.reduce((s, f) => s + f.quantidade, 0) || 1;

  return {
    grid: { left: 8, right: 16, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const f = faixas[(Array.isArray(params) ? params[0] : params).dataIndex];
        return f ? `<b>${f.rotulo}</b><br/>${formatarNumero(f.quantidade)} chegada(s) • ${formatarPct((f.quantidade * 100) / total, 0)}` : "";
      },
    },
    xAxis: { type: "value", minInterval: 1 },
    yAxis: { type: "category", data: faixas.map((f) => f.rotulo), inverse: true },
    series: [
      {
        type: "bar",
        data: faixas.map((f) => ({
          value: f.quantidade,
          itemStyle: { color: f.atrasado ? CORES.perigo : f.rotulo === "Dentro da janela" ? CORES.sucesso : "#86EFAC", borderRadius: [0, 4, 4, 0] },
        })),
        barMaxWidth: 20,
        label: { show: true, position: "right", formatter: (p: any) => (p.value ? formatarNumero(p.value) : ""), color: CORES.textoSuave, fontSize: 11 },
      },
    ],
  };
}

export function diaSemanaOption(dias: FornecedorGrupo[]): EChartsOption {
  return {
    grid: { left: 8, right: 8, top: 56, bottom: 8, containLabel: true },
    legend: { top: 0, left: 0, type: "scroll" },
    tooltip: { trigger: "axis", valueFormatter: (v: any) => (typeof v === "number" ? formatarNumero(v, 1) : "—") },
    xAxis: { type: "category", data: dias.map((d) => d.nome) },
    yAxis: [
      { type: "value", minInterval: 1, name: "agend.", nameTextStyle: { color: CORES.textoSuave } },
      { type: "value", min: 0, max: 100, position: "right", splitLine: { show: false }, axisLabel: { formatter: "{value}%" } },
    ],
    series: [
      { name: "Agendamentos", type: "bar", data: dias.map((d) => d.agendamentos), itemStyle: { color: "#BFDBFE", borderRadius: [4, 4, 0, 0] }, barMaxWidth: 26 },
      { name: "Pontualidade", type: "line", yAxisIndex: 1, smooth: true, connectNulls: true, data: dias.map((d) => d.pontualidadePct ?? "-"), itemStyle: { color: CORES.sucesso }, lineStyle: { width: 3 } },
      { name: "Faltas", type: "line", yAxisIndex: 1, smooth: true, connectNulls: true, data: dias.map((d) => d.noShowPct ?? "-"), itemStyle: { color: CORES.perigo }, lineStyle: { width: 2 } },
    ],
  };
}

export function scoreOption(score: number | null, classificacao: string): EChartsOption {
  return {
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: "100%",
        center: ["50%", "58%"],
        progress: { show: true, width: 12, roundCap: true, itemStyle: { color: corClassificacao(classificacao) } },
        axisLine: { lineStyle: { width: 12, color: [[1, CORES.trilho]] }, roundCap: true },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: true, offsetCenter: [0, "38%"], fontSize: 11, color: CORES.textoSuave },
        detail: { valueAnimation: true, offsetCenter: [0, "-2%"], fontSize: 26, fontWeight: "bold", color: CORES.texto, formatter: () => (score === null ? "—" : String(score)) },
        data: [{ value: score ?? 0, name: classificacao }],
      },
    ],
  };
}

export const descreverMinutos = (v: number | null | undefined) => (v === null || v === undefined ? "—" : formatarDuracao(v));
