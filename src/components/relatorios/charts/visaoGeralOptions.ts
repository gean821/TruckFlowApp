import type { EChartsOption } from "echarts";
import type {
  RelatorioBiRanking,
  VisaoGeralDia,
  VisaoGeralFunil,
  VisaoGeralOcupacaoHora,
  VisaoGeralStatus,
} from "@/entities/relatorioBi.types";
import { formatarDiaCurto, formatarNumero, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";
import { CORES, PALETA } from "./echarts";

const gradiente = (cor: string, opacidade = "55") => ({
  type: "linear" as const,
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: `${cor}${opacidade}` },
    { offset: 1, color: `${cor}00` },
  ],
});

export type MetricaEvolucao = "agendamentos" | "concluidos" | "pesoKg";

const ROTULO_METRICA: Record<MetricaEvolucao, string> = {
  agendamentos: "Agendamentos",
  concluidos: "Descargas concluídas",
  pesoKg: "Toneladas recebidas",
};

const valorMetrica = (dia: VisaoGeralDia, metrica: MetricaEvolucao) =>
  metrica === "pesoKg" ? Math.round(dia.pesoKg / 100) / 10 : dia[metrica];

export function evolucaoOption(serie: VisaoGeralDia[], anterior: VisaoGeralDia[], metrica: MetricaEvolucao): EChartsOption {
  const sufixo = metrica === "pesoKg" ? " t" : "";
  const mostrarZoom = serie.length > 45;

  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      valueFormatter: (v) => `${formatarNumero(Number(v), metrica === "pesoKg" ? 1 : 0)}${sufixo}`,
    },
    legend: { top: 0, right: 0 },
    grid: { left: 8, right: 12, top: 36, bottom: mostrarZoom ? 52 : 8, containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: serie.map((d) => formatarDiaCurto(d.data)) },
    yAxis: { type: "value", minInterval: metrica === "pesoKg" ? undefined : 1 },
    dataZoom: mostrarZoom
      ? [
          { type: "inside", start: 0, end: 100 },
          { type: "slider", height: 18, bottom: 8, borderColor: "transparent", fillerColor: "rgba(25,95,160,0.12)" },
        ]
      : undefined,
    series: [
      {
        name: ROTULO_METRICA[metrica],
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        showSymbol: serie.length <= 31,
        data: serie.map((d) => valorMetrica(d, metrica)),
        lineStyle: { width: 3, color: CORES.primaria },
        itemStyle: { color: CORES.primaria },
        areaStyle: { color: gradiente(CORES.primaria) },
        emphasis: { focus: "series" },
      },
      {
        name: "Período anterior",
        type: "line",
        smooth: true,
        symbol: "none",
        data: anterior.map((d) => valorMetrica(d, metrica)),
        lineStyle: { width: 2, type: "dashed", color: CORES.cinza },
        itemStyle: { color: CORES.cinza },
      },
    ],
  };
}

export function volumeMetaOption(serie: VisaoGeralDia[], metaDiariaKg: number | null): EChartsOption {
  const meta = metaDiariaKg ? Math.round(metaDiariaKg / 100) / 10 : null;

  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (v) => `${formatarNumero(Number(v), 1)} t`,
    },
    grid: { left: 8, right: 12, top: 24, bottom: 8, containLabel: true },
    xAxis: { type: "category", data: serie.map((d) => formatarDiaCurto(d.data)) },
    yAxis: { type: "value", axisLabel: { formatter: (v: number) => `${formatarNumero(v)} t` } },
    series: [
      {
        name: "Recebido",
        type: "bar",
        barMaxWidth: 26,
        data: serie.map((d) => {
          const toneladas = Math.round(d.pesoKg / 100) / 10;
          const bateu = meta !== null && toneladas >= meta;
          return {
            value: toneladas,
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: meta === null ? CORES.primaria : bateu ? CORES.sucesso : CORES.primariaClara,
            },
          };
        }),
        markLine:
          meta === null
            ? undefined
            : {
                symbol: "none",
                silent: true,
                lineStyle: { color: CORES.alerta, type: "dashed", width: 2 },
                label: { formatter: `Meta ${formatarNumero(meta, 1)} t`, color: CORES.alerta, fontWeight: "bold", position: "insideEndTop" },
                data: [{ yAxis: meta }],
              },
      },
    ],
  };
}

export const STATUS_CONFIG = [
  { chave: "finalizado", api: "Finalizado", rotulo: "Concluídos", cor: CORES.sucesso },
  { chave: "agendado", api: "Agendado", rotulo: "Agendados", cor: CORES.primaria },
  { chave: "emAndamento", api: "EmAndamento", rotulo: "No pátio", cor: CORES.ciano },
  { chave: "expirado", api: "Expirado", rotulo: "Não compareceu", cor: CORES.perigo },
  { chave: "cancelado", api: "Cancelado", rotulo: "Cancelados", cor: CORES.cinza },
] as const;

export function statusOption(status: VisaoGeralStatus): EChartsOption {
  const total = STATUS_CONFIG.reduce((soma, s) => soma + status[s.chave], 0);

  return {
    animationDuration: 800,
    tooltip: { trigger: "item", formatter: (p: any) => `${p.marker} ${p.name}<br/><b>${p.value}</b> (${formatarPct(p.percent)})` },
    legend: { orient: "vertical", right: 0, top: "middle", itemGap: 12 },
    series: [
      {
        type: "pie",
        radius: ["58%", "82%"],
        center: ["36%", "50%"],
        padAngle: 2,
        itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
        label: {
          show: true,
          position: "center",
          formatter: () => `{total|${formatarNumero(total)}}\n{rotulo|agendamentos}`,
          rich: {
            total: { fontSize: 26, fontWeight: "bold", color: CORES.texto, lineHeight: 32 },
            rotulo: { fontSize: 12, color: CORES.textoSuave },
          },
        },
        labelLine: { show: false },
        emphasis: { scale: true, scaleSize: 6 },
        data: STATUS_CONFIG.map((s) => ({ name: s.rotulo, value: status[s.chave], itemStyle: { color: s.cor }, status: s.api })),
      },
    ],
  };
}

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function heatmapOption(matriz: number[][]): EChartsOption {
  const comDados = Array.from({ length: 24 }, (_, h) => h).filter((h) => matriz.some((linha) => (linha[h] ?? 0) > 0));
  const primeira = comDados.length ? Math.max(0, comDados[0]! - 1) : 6;
  const ultima = comDados.length ? Math.min(23, comDados[comDados.length - 1]! + 1) : 20;
  const faixa = Array.from({ length: ultima - primeira + 1 }, (_, i) => primeira + i);

  const horas = faixa.map((h) => `${String(h).padStart(2, "0")}h`);
  const dados = matriz.flatMap((linha, dia) => faixa.map((hora, i) => [i, dia, linha[hora] ?? 0]));
  const maximo = Math.max(1, ...dados.map((d) => d[2]!));

  return {
    animationDuration: 700,
    tooltip: {
      position: "top",
      formatter: (p: any) => `<b>${DIAS[p.value[1]]}, ${horas[p.value[0]]}</b><br/>${p.value[2]} agendamento${p.value[2] === 1 ? "" : "s"}`,
    },
    grid: { left: 8, right: 8, top: 8, bottom: 56, containLabel: true },
    xAxis: { type: "category", data: horas, splitArea: { show: true } },
    yAxis: { type: "category", data: DIAS, inverse: true, splitArea: { show: true } },
    visualMap: {
      min: 0,
      max: maximo,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      itemHeight: 140,
      inRange: { color: ["#F1F5F9", "#BFDBFE", "#5B9BD5", "#195FA0", "#0B3A66"] },
      textStyle: { color: CORES.textoSuave },
    },
    series: [
      {
        type: "heatmap",
        data: dados,
        label: { show: true, color: "#fff", fontSize: 10, formatter: (p: any) => (p.value[2] > 0 ? p.value[2] : "") },
        itemStyle: { borderColor: "#fff", borderWidth: 2, borderRadius: 4 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(15,23,42,0.3)" } },
      },
    ],
  };
}

export function funilOption(funil: VisaoGeralFunil): EChartsOption {
  const base = Math.max(1, funil.reservados);
  const etapas = [
    { name: "Reservados", value: funil.reservados, cor: CORES.primaria },
    { name: "Chegaram", value: funil.chegaram, cor: CORES.ciano },
    { name: "Concluídos", value: funil.concluidos, cor: CORES.sucesso },
  ];

  return {
    animationDuration: 800,
    tooltip: { trigger: "item", formatter: (p: any) => `${p.name}: <b>${p.value}</b> (${formatarPct((p.value * 100) / base)})` },
    series: [
      {
        type: "funnel",
        left: "8%",
        right: "8%",
        top: 8,
        bottom: 8,
        minSize: "30%",
        sort: "none",
        gap: 6,
        label: {
          show: true,
          position: "inside",
          formatter: (p: any) => `{nome|${p.name}}\n{valor|${p.value}} {pct|${formatarPct((p.value * 100) / base, 0)}}`,
          rich: {
            nome: { color: "#fff", fontSize: 12, lineHeight: 18 },
            valor: { color: "#fff", fontSize: 18, fontWeight: "bold" },
            pct: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
          },
        },
        itemStyle: { borderColor: "#fff", borderWidth: 0, borderRadius: 6 },
        data: etapas.map((e) => ({ name: e.name, value: e.value, itemStyle: { color: e.cor } })),
      },
    ],
  };
}

export function ocupacaoOption(horas: VisaoGeralOcupacaoHora[]): EChartsOption {
  const visiveis = horas.filter((h, i, todas) => {
    const primeiro = todas.findIndex((x) => x.ocupacaoPct > 0 || x.agendamentos > 0);
    const ultimo = todas.length - 1 - [...todas].reverse().findIndex((x) => x.ocupacaoPct > 0 || x.agendamentos > 0);
    return primeiro === -1 ? i >= 6 && i <= 20 : i >= Math.max(0, primeiro - 1) && i <= Math.min(23, ultimo + 1);
  });

  return {
    animationDuration: 700,
    tooltip: { trigger: "axis" },
    legend: { top: 0, right: 0 },
    grid: { left: 8, right: 8, top: 36, bottom: 8, containLabel: true },
    xAxis: { type: "category", data: visiveis.map((h) => `${String(h.hora).padStart(2, "0")}h`) },
    yAxis: [
      { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
      { type: "value", splitLine: { show: false }, axisLabel: { formatter: (v: number) => formatarNumero(v, 1) } },
    ],
    series: [
      {
        name: "Ocupação das docas",
        type: "bar",
        barMaxWidth: 22,
        data: visiveis.map((h) => ({
          value: h.ocupacaoPct,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: h.ocupacaoPct >= 85 ? CORES.perigo : h.ocupacaoPct >= 60 ? CORES.alerta : CORES.primariaClara,
          },
        })),
        tooltip: { valueFormatter: (v) => formatarPct(Number(v)) },
      },
      {
        name: "Chegadas por dia",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        data: visiveis.map((h) => h.agendamentos),
        lineStyle: { width: 2, color: CORES.roxo },
        itemStyle: { color: CORES.roxo },
        tooltip: { valueFormatter: (v) => `${formatarNumero(Number(v), 1)} em média` },
      },
    ],
  };
}

export function rankingOption(ranking: RelatorioBiRanking[]): EChartsOption {
  const ordenado = [...ranking].reverse();

  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const item = ordenado[params[0].dataIndex]!;
        return `<b>${item.nome}</b><br/>${formatarToneladas(item.pesoKg)} • ${item.concluidos} descargas<br/>${formatarPct(item.percentual)} do volume`;
      },
    },
    grid: { left: 8, right: 56, top: 4, bottom: 4, containLabel: true },
    xAxis: { type: "value", show: false },
    yAxis: {
      type: "category",
      data: ordenado.map((r) => (r.nome.length > 22 ? `${r.nome.slice(0, 21)}…` : r.nome)),
      axisLine: { show: false },
      axisLabel: { color: CORES.texto, fontWeight: 500 },
    },
    series: [
      {
        type: "bar",
        barWidth: 16,
        showBackground: true,
        backgroundStyle: { color: CORES.trilho, borderRadius: 8 },
        label: { show: true, position: "right", color: CORES.textoSuave, formatter: (p: any) => formatarPct(ordenado[p.dataIndex]!.percentual) },
        data: ordenado.map((r, i) => ({
          value: r.pesoKg,
          itemStyle: { borderRadius: 8, color: PALETA[(ordenado.length - 1 - i) % PALETA.length] },
        })),
      },
    ],
  };
}
