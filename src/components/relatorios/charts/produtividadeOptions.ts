import type { EChartsOption } from "echarts";
import { graphic } from "echarts/core";
import type {
  PatioCaminhao,
  PatioResponse,
  ProdutividadeCelula,
  ProdutividadeDia,
  ProdutividadeFaixa,
  ProdutividadeGrupo,
  ProdutividadeHora,
} from "@/entities/relatorioBi.types";
import { formatarDiaCurto, formatarDuracao, formatarNumero } from "@/utils/relatorioFormat";
import { DIAS_SEMANA, faixaHoras } from "./capacidadeOptions";
import { CORES } from "./echarts";

export type MetricaHeatmapEspera = "espera" | "p90" | "chegadas";
export type MetricaTempo = "espera" | "descarga";

const DIAS_EXTENSO = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const ESCALA_ESPERA = ["#DCFCE7", "#86EFAC", "#FDE68A", "#F59E0B", "#EF4444", "#991B1B"];
const ESCALA_VOLUME = ["#F1F5F9", "#BFDBFE", "#5B9BD5", "#195FA0", "#0B3A66"];
const COR_ESPERA = "#F59E0B";
const COR_DESCARGA = CORES.primaria;
const COR_NO_PATIO = "#F97316";

const hora = (h: number) => `${String(h).padStart(2, "0")}h`;
const minutos = (v: number | null | undefined) => (v === null || v === undefined ? "—" : formatarDuracao(v));

export const horaSaoPaulo = (valor: string | number) =>
  new Date(valor).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

export function tendenciaOption(serie: ProdutividadeDia[], limite: number): EChartsOption {
  const comDados = serie.filter((d) => d.ciclos > 0);
  const linha = (valores: (number | null)[]) => valores.map((v) => (v === null ? "-" : v));

  return {
    grid: { left: 8, right: 8, top: 40, bottom: 8, containLabel: true },
    legend: { top: 0, left: 0 },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const lista = Array.isArray(params) ? params : [params];
        const d = serie[lista[0]?.dataIndex ?? 0];
        if (!d) return "";
        return [
          `<b>${formatarDiaCurto(d.dia)}</b>`,
          `${formatarNumero(d.ciclos)} descarga${d.ciclos === 1 ? "" : "s"}`,
          `Espera média: <b>${minutos(d.esperaMediaMin)}</b>`,
          `9 em 10 esperaram até: <b>${minutos(d.esperaP90Min)}</b>`,
          `Descarga média: <b>${minutos(d.descargaMediaMin)}</b>`,
          `Permanência média: <b>${minutos(d.permanenciaMediaMin)}</b>`,
        ].join("<br/>");
      },
    },
    xAxis: { type: "category", data: serie.map((d) => formatarDiaCurto(d.dia)), boundaryGap: true },
    yAxis: [
      { type: "value", name: "min", nameTextStyle: { color: CORES.textoSuave }, axisLabel: { formatter: (v: number) => `${v}` } },
      { type: "value", name: "descargas", position: "right", splitLine: { show: false }, nameTextStyle: { color: CORES.textoSuave } },
    ],
    series: [
      {
        name: "Descargas",
        type: "bar",
        yAxisIndex: 1,
        data: serie.map((d) => d.ciclos),
        itemStyle: { color: "#E2E8F0", borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 18,
        cursor: "pointer",
      },
      {
        name: "Espera média",
        type: "line",
        smooth: true,
        symbolSize: 6,
        connectNulls: true,
        data: linha(serie.map((d) => d.esperaMediaMin)),
        itemStyle: { color: COR_ESPERA },
        lineStyle: { width: 3 },
        areaStyle: { color: "rgba(245, 158, 11, 0.08)" },
        markLine: comDados.length
          ? {
            symbol: "none",
            silent: true,
            lineStyle: { color: CORES.perigo, type: "dashed" },
            label: { formatter: `limite ${limite} min`, color: CORES.perigo, position: "insideEndTop" },
            data: [{ yAxis: limite }],
          }
          : undefined,
      },
      {
        name: "Espera (9 em 10)",
        type: "line",
        smooth: true,
        symbol: "none",
        connectNulls: true,
        data: linha(serie.map((d) => d.esperaP90Min)),
        itemStyle: { color: "#B45309" },
        lineStyle: { type: "dashed", width: 1.5 },
      },
      {
        name: "Descarga média",
        type: "line",
        smooth: true,
        symbolSize: 6,
        connectNulls: true,
        data: linha(serie.map((d) => d.descargaMediaMin)),
        itemStyle: { color: COR_DESCARGA },
        lineStyle: { width: 3 },
      },
      {
        name: "Permanência média",
        type: "line",
        smooth: true,
        symbol: "none",
        connectNulls: true,
        data: linha(serie.map((d) => d.permanenciaMediaMin)),
        itemStyle: { color: CORES.roxo },
        lineStyle: { width: 1.5 },
      },
    ],
  };
}

export function distribuicaoOption(faixas: ProdutividadeFaixa[], limite: number): EChartsOption {
  const total = (campo: "espera" | "descarga") => faixas.reduce((s, f) => s + f[campo], 0) || 1;
  const totalEspera = total("espera");
  const totalDescarga = total("descarga");

  return {
    grid: { left: 8, right: 8, top: 40, bottom: 8, containLabel: true },
    legend: { top: 0, left: 0 },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const lista = Array.isArray(params) ? params : [params];
        const f = faixas[lista[0]?.dataIndex ?? 0];
        if (!f) return "";
        return [
          `<b>${f.rotulo}</b>`,
          `Espera: <b>${formatarNumero(f.espera)}</b> caminhões (${formatarNumero((f.espera * 100) / totalEspera, 0)}%)`,
          `Descarga: <b>${formatarNumero(f.descarga)}</b> caminhões (${formatarNumero((f.descarga * 100) / totalDescarga, 0)}%)`,
        ].join("<br/>");
      },
    },
    xAxis: { type: "category", data: faixas.map((f) => f.rotulo), axisLabel: { interval: 0, rotate: faixas.length > 6 ? 30 : 0 } },
    yAxis: { type: "value", minInterval: 1 },
    series: [
      {
        name: "Espera",
        type: "bar",
        data: faixas.map((f) => ({
          value: f.espera,
          itemStyle: { color: f.deMin >= limite ? CORES.perigo : COR_ESPERA, borderRadius: [4, 4, 0, 0] },
        })),
        barGap: "10%",
      },
      {
        name: "Descarga",
        type: "bar",
        data: faixas.map((f) => f.descarga),
        itemStyle: { color: COR_DESCARGA, borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
}

export function heatmapEsperaOption(celulas: ProdutividadeCelula[], metrica: MetricaHeatmapEspera, limite: number): EChartsOption {
  const faixa = faixaHoras(celulas.map((c) => c.hora));
  const mapa = new Map(celulas.map((c) => [`${c.diaSemana}-${c.hora}`, c]));
  const valor = (c: ProdutividadeCelula) => (metrica === "chegadas" ? c.chegadas : metrica === "p90" ? c.esperaP90Min ?? 0 : c.esperaMediaMin ?? 0);

  const dados = DIAS_SEMANA.flatMap((_, dia) =>
    faixa.map((h, i) => {
      const c = mapa.get(`${dia}-${h}`);
      return [i, dia, c ? valor(c) : "-"];
    }),
  );

  const maximo = Math.max(1, ...celulas.map(valor));
  const ehVolume = metrica === "chegadas";

  return {
    grid: { left: 8, right: 8, top: 8, bottom: 72, containLabel: true },
    tooltip: {
      formatter: (p: any) => {
        const [i, dia] = p.value as [number, number];
        const h = faixa[i]!;
        const c = mapa.get(`${dia}-${h}`);
        if (!c) return `<b>${DIAS_EXTENSO[dia]}, ${hora(h)}</b><br/>Nenhuma chegada`;
        return [
          `<b>${DIAS_EXTENSO[dia]}, ${hora(h)}</b>`,
          `${formatarNumero(c.chegadas)} chegada${c.chegadas === 1 ? "" : "s"}`,
          `Espera média: <b>${minutos(c.esperaMediaMin)}</b>`,
          `9 em 10 esperaram até: <b>${minutos(c.esperaP90Min)}</b>`,
        ].join("<br/>");
      },
    },
    xAxis: { type: "category", data: faixa.map(hora), splitArea: { show: false } },
    yAxis: { type: "category", data: DIAS_SEMANA, inverse: true },
    visualMap: {
      min: 0,
      max: ehVolume ? maximo : Math.max(limite * 2, maximo),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      itemHeight: 160,
      formatter: (v: any) => (ehVolume ? formatarNumero(Number(v)) : `${Math.round(Number(v))} min`),
      inRange: { color: ehVolume ? ESCALA_VOLUME : ESCALA_ESPERA },
      textStyle: { color: CORES.textoSuave },
    },
    series: [
      {
        type: "heatmap",
        data: dados,
        label: {
          show: true,
          fontSize: 10,
          formatter: (p: any) => (p.value[2] === "-" ? "" : ehVolume ? formatarNumero(p.value[2]) : `${Math.round(p.value[2])}`),
        },
        itemStyle: { borderColor: "#fff", borderWidth: 2, borderRadius: 4 },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: "rgba(15,23,42,.25)" } },
      },
    ],
  };
}

export function porHoraOption(horas: ProdutividadeHora[]): EChartsOption {
  const comChegada = horas.filter((h) => h.chegadas > 0).map((h) => h.hora);
  const faixa = faixaHoras(comChegada);
  const visiveis = faixa.map((h) => horas.find((x) => x.hora === h) ?? { hora: h, chegadas: 0, esperaMediaMin: null, descargaMediaMin: null });

  return {
    grid: { left: 8, right: 8, top: 40, bottom: 8, containLabel: true },
    legend: { top: 0, left: 0 },
    tooltip: { trigger: "axis", valueFormatter: (v: any) => (typeof v === "number" ? formatarNumero(v, 0) : "—") },
    xAxis: { type: "category", data: visiveis.map((h) => hora(h.hora)) },
    yAxis: [
      { type: "value", name: "chegadas", minInterval: 1, nameTextStyle: { color: CORES.textoSuave } },
      { type: "value", name: "min", position: "right", splitLine: { show: false }, nameTextStyle: { color: CORES.textoSuave } },
    ],
    series: [
      { name: "Chegadas", type: "bar", data: visiveis.map((h) => h.chegadas), itemStyle: { color: "#BFDBFE", borderRadius: [4, 4, 0, 0] }, barMaxWidth: 28 },
      { name: "Espera média (min)", type: "line", yAxisIndex: 1, smooth: true, connectNulls: true, data: visiveis.map((h) => h.esperaMediaMin ?? "-"), itemStyle: { color: COR_ESPERA }, lineStyle: { width: 3 } },
      { name: "Descarga média (min)", type: "line", yAxisIndex: 1, smooth: true, connectNulls: true, data: visiveis.map((h) => h.descargaMediaMin ?? "-"), itemStyle: { color: COR_DESCARGA }, lineStyle: { width: 2 } },
    ],
  };
}

export function boxplotOption(grupos: ProdutividadeGrupo[], metrica: MetricaTempo, limite: number): EChartsOption {
  const comCaixa = grupos.filter((g) => (metrica === "espera" ? g.caixaEspera : g.caixaDescarga) !== null).slice(0, 15);
  const caixa = (g: ProdutividadeGrupo) => (metrica === "espera" ? g.caixaEspera : g.caixaDescarga)!;
  const media = (g: ProdutividadeGrupo) => (metrica === "espera" ? g.esperaMediaMin : g.descargaMediaMin);
  const cor = metrica === "espera" ? COR_ESPERA : COR_DESCARGA;

  return {
    grid: { left: 8, right: 24, top: 16, bottom: 8, containLabel: true },
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const g = comCaixa[p.dataIndex];
        if (!g) return "";
        const c = caixa(g);
        return [
          `<b>${g.nome}</b> • ${formatarNumero(g.ciclos)} descarga${g.ciclos === 1 ? "" : "s"}`,
          `Média: <b>${minutos(media(g))}</b>`,
          `Mais rápido: ${minutos(c.min)}`,
          `1 em 4 até: ${minutos(c.q1)}`,
          `Metade até: <b>${minutos(c.mediana)}</b>`,
          `3 em 4 até: ${minutos(c.q3)}`,
          `Mais demorado: ${minutos(c.max)}`,
        ].join("<br/>");
      },
    },
    xAxis: { type: "value", name: "min", nameTextStyle: { color: CORES.textoSuave } },
    yAxis: { type: "category", data: comCaixa.map((g) => g.nome), inverse: true, axisLabel: { width: 140, overflow: "truncate" } },
    series: [
      {
        type: "boxplot",
        data: comCaixa.map((g) => {
          const c = caixa(g);
          return [c.min, c.q1, c.mediana, c.q3, c.max];
        }),
        itemStyle: { color: `${cor}33`, borderColor: cor, borderWidth: 1.5 },
        boxWidth: [8, 22],
        markLine:
          metrica === "espera"
            ? {
              symbol: "none",
              silent: true,
              lineStyle: { color: CORES.perigo, type: "dashed" },
              label: { formatter: `${limite} min`, color: CORES.perigo },
              data: [{ xAxis: limite }],
            }
            : undefined,
      },
      {
        type: "scatter",
        name: "Média",
        data: comCaixa.map((g, i) => [media(g) ?? 0, i]),
        symbol: "diamond",
        symbolSize: 10,
        itemStyle: { color: CORES.texto },
        tooltip: { show: false },
      },
    ],
  };
}

export interface FaixaGantt {
  caminhao: PatioCaminhao;
  doca: number;
  faixa: number;
  faixas: number;
  fimNoPatio: number;
}

export function distribuirFaixas(patio: PatioResponse): FaixaGantt[] {
  const agora = patio.agoraUtc ? Date.parse(patio.agoraUtc) : null;

  return patio.docas.flatMap((doca, iDoca) => {
    const fins: number[] = [];
    const itens = doca.caminhoes.map((c) => {
      const inicio = Date.parse(c.chegouEm);
      const fimNoPatio = c.saida ? Date.parse(c.saida) : c.fimDescarga ? Date.parse(c.fimDescarga) : Math.max(agora ?? Date.parse(c.janelaFim), inicio + 60_000);
      let faixa = fins.findIndex((f) => f <= inicio);
      if (faixa === -1) {
        faixa = fins.length;
        fins.push(fimNoPatio);
      } else {
        fins[faixa] = fimNoPatio;
      }
      return { caminhao: c, doca: iDoca, faixa, faixas: 0, fimNoPatio };
    });
    return itens.map((i) => ({ ...i, faixas: fins.length }));
  });
}

export function ganttOption(patio: PatioResponse): EChartsOption {
  const faixas = distribuirFaixas(patio);
  const segmentos: (number | string)[][] = [];

  faixas.forEach((f, i) => {
    const c = f.caminhao;
    const chegada = Date.parse(c.chegouEm);
    const inicio = c.inicioDescarga ? Date.parse(c.inicioDescarga) : null;
    const fim = c.fimDescarga ? Date.parse(c.fimDescarga) : null;

    segmentos.push([f.doca, Date.parse(c.janelaInicio), Date.parse(c.janelaFim), f.faixa, f.faixas, 3, i]);
    if (inicio !== null && fim !== null) {
      if (inicio > chegada) segmentos.push([f.doca, chegada, inicio, f.faixa, f.faixas, 0, i]);
      segmentos.push([f.doca, inicio, fim, f.faixa, f.faixas, 1, i]);
    } else {
      segmentos.push([f.doca, chegada, f.fimNoPatio, f.faixa, f.faixas, 2, i]);
    }
  });

  const cores = [COR_ESPERA, COR_DESCARGA, COR_NO_PATIO];

  return {
    grid: { left: 8, right: 16, top: 30, bottom: 50, containLabel: true },
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const f = faixas[p.value[6]];
        if (!f) return "";
        const c = f.caminhao;
        return [
          `<b>${c.placa ?? "Sem placa"}</b>${c.motorista ? ` • ${c.motorista}` : ""}`,
          [c.fornecedor, c.produto].filter(Boolean).join(" • "),
          `Janela: ${horaSaoPaulo(c.janelaInicio)} – ${horaSaoPaulo(c.janelaFim)}`,
          `Chegada: <b>${horaSaoPaulo(c.chegouEm)}</b>`,
          c.inicioDescarga ? `Início da descarga: <b>${horaSaoPaulo(c.inicioDescarga)}</b>${c.inicioEstimado ? " (estimado)" : ""}` : "Ainda aguardando ou descarregando",
          c.fimDescarga ? `Fim da descarga: <b>${horaSaoPaulo(c.fimDescarga)}</b>` : "",
          c.esperaMin !== null ? `Espera: <b>${minutos(c.esperaMin)}</b> • Descarga: <b>${minutos(c.descargaMin)}</b>` : "",
        ]
          .filter(Boolean)
          .join("<br/>");
      },
    },
    dataZoom: [
      { type: "inside", xAxisIndex: 0, filterMode: "weakFilter" },
      { type: "slider", xAxisIndex: 0, height: 18, bottom: 8, filterMode: "weakFilter", labelFormatter: (v: number) => horaSaoPaulo(v) },
    ],
    xAxis: {
      type: "time",
      min: patio.inicioEixo ? Date.parse(patio.inicioEixo) : undefined,
      max: patio.fimEixo ? Date.parse(patio.fimEixo) : undefined,
      position: "top",
      splitLine: { show: true, lineStyle: { color: "#F1F5F9" } },
      axisLabel: { formatter: (v: number) => horaSaoPaulo(v), color: CORES.textoSuave },
    },
    yAxis: {
      type: "category",
      data: patio.docas.map((d) => d.nome),
      inverse: true,
      axisLabel: { fontWeight: "bold", color: CORES.texto },
      splitLine: { show: true, lineStyle: { color: "#E2E8F0" } },
    },
    series: [
      {
        type: "custom",
        encode: { x: [1, 2], y: 0 },
        data: segmentos,
        renderItem: (params: any, api: any) => {
          const doca = api.value(0);
          const inicio = api.coord([api.value(1), doca]);
          const fim = api.coord([api.value(2), doca]);
          const faixa = api.value(3);
          const total = Math.max(1, api.value(4));
          const tipo = api.value(5);
          const banda = api.size([0, 1])[1] * 0.84;
          const altura = banda / total;
          const topo = inicio[1] - banda / 2 + faixa * altura;
          const janela = tipo === 3;
          const forma = {
            x: inicio[0],
            y: janela ? topo + altura - 3 : topo + 2,
            width: Math.max(2, fim[0] - inicio[0]),
            height: janela ? 2 : Math.max(4, altura - 6),
          };
          const recortado = graphic.clipRectByRect(forma, params.coordSys);
          if (!recortado) return null;
          return {
            type: "rect",
            shape: { ...recortado, r: janela ? 0 : 3 },
            style: janela
              ? { fill: "rgba(100,116,139,.55)" }
              : { fill: cores[tipo], opacity: tipo === 2 ? 0.85 : 1, stroke: "#fff", lineWidth: 1 },
          };
        },
        markLine: patio.agoraUtc
          ? {
            symbol: "none",
            silent: true,
            lineStyle: { color: CORES.perigo, width: 1.5 },
            label: { formatter: "agora", color: CORES.perigo, position: "start" },
            data: [{ xAxis: Date.parse(patio.agoraUtc) }],
          }
          : undefined,
      },
    ],
  };
}
