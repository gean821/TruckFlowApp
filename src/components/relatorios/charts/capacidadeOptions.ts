import type { EChartsOption } from "echarts";
import type { CapacidadeCelula, CapacidadeDia, CapacidadeDoca, CapacidadeDocaHora, CapacidadeHora } from "@/entities/relatorioBi.types";
import { formatarDiaCurto, formatarNumero, formatarPct } from "@/utils/relatorioFormat";
import { CORES } from "./echarts";

export type MetricaCapacidade = "reserva" | "utilizacao" | "ofertadas" | "esgotadas";

export const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const DIAS_EXTENSO = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export const ESCALA_OCUPACAO = ["#E2E8F0", "#BFDBFE", "#5B9BD5", "#195FA0", "#F59E0B", "#EF4444"];
const ESCALA_VOLUME = ["#F1F5F9", "#BFDBFE", "#5B9BD5", "#195FA0", "#0B3A66"];

const hora = (h: number) => `${String(h).padStart(2, "0")}h`;

export function faixaHoras(horas: number[]) {
  if (!horas.length) return Array.from({ length: 13 }, (_, i) => 6 + i);
  const primeira = Math.min(...horas);
  const ultima = Math.max(...horas);
  return Array.from({ length: ultima - primeira + 1 }, (_, i) => primeira + i);
}

export function valorMetrica(c: { ofertadas: number; taxaReservaPct: number | null; utilizacaoRealPct: number | null; diasEsgotados?: number; diasComOferta?: number }, metrica: MetricaCapacidade) {
  if (metrica === "ofertadas") return c.ofertadas;
  if (metrica === "esgotadas") return c.diasComOferta ? Math.round(((c.diasEsgotados ?? 0) * 1000) / c.diasComOferta) / 10 : 0;
  return (metrica === "reserva" ? c.taxaReservaPct : c.utilizacaoRealPct) ?? 0;
}

const rotuloMetrica: Record<MetricaCapacidade, string> = {
  reserva: "Reservado",
  utilizacao: "Utilização real",
  ofertadas: "Vagas ofertadas",
  esgotadas: "Dias esgotados",
};

const formatarMetrica = (valor: number, metrica: MetricaCapacidade) =>
  metrica === "ofertadas" ? formatarNumero(valor) : formatarPct(valor, 0);

function visualMap(metrica: MetricaCapacidade, maximo: number) {
  const porcentagem = metrica !== "ofertadas";
  return {
    min: 0,
    max: porcentagem ? 100 : Math.max(1, maximo),
    calculable: true,
    orient: "horizontal" as const,
    left: "center",
    bottom: 0,
    itemHeight: 160,
    formatter: (v: any) => (porcentagem ? `${Math.round(Number(v))}%` : formatarNumero(Number(v))),
    inRange: { color: porcentagem ? ESCALA_OCUPACAO : ESCALA_VOLUME },
    textStyle: { color: CORES.textoSuave },
  };
}

export function heatmapSemanaOption(celulas: CapacidadeCelula[], metrica: MetricaCapacidade): EChartsOption {
  const faixa = faixaHoras(celulas.map((c) => c.hora));
  const mapa = new Map(celulas.map((c) => [`${c.diaSemana}-${c.hora}`, c]));
  const dados = DIAS_SEMANA.flatMap((_, dia) =>
    faixa.map((h, i) => {
      const c = mapa.get(`${dia}-${h}`);
      return c && c.ofertadas > 0 ? [i, dia, valorMetrica(c, metrica)] : [i, dia, "-"];
    }),
  );
  const encaixes = celulas
    .filter((c) => c.ofertadas === 0 && c.foraDaGrade > 0)
    .map((c) => [faixa.indexOf(c.hora), c.diaSemana, c.foraDaGrade]);
  const maximo = Math.max(1, ...celulas.map((c) => valorMetrica(c, metrica)));

  return {
    animationDuration: 700,
    tooltip: {
      position: "top",
      formatter: (p: any) => {
        const c = mapa.get(`${p.value[1]}-${faixa[p.value[0]]}`);
        const titulo = `<b>${DIAS_EXTENSO[p.value[1]]}, ${hora(faixa[p.value[0]]!)}</b>`;
        if (!c) return `${titulo}<br/>Sem vagas na grade`;
        if (c.ofertadas === 0) return `${titulo}<br/>Sem vagas na grade<br/><b>${c.foraDaGrade}</b> caminhão(ões) encaixado(s) fora da grade`;
        return [
          titulo,
          `Vagas ofertadas: <b>${c.ofertadas}</b>`,
          `Reservadas: <b>${c.reservadas}</b> (${formatarPct(c.taxaReservaPct, 0)})`,
          `Descarregaram: <b>${c.realizadas}</b> • utilização real ${formatarPct(c.utilizacaoRealPct, 0)}`,
          c.naoCompareceu ? `Não compareceu: <b>${c.naoCompareceu}</b>` : "",
          c.foraDaGrade ? `Fora da grade: <b>${c.foraDaGrade}</b>` : "",
          c.diasComOferta ? `Esgotou em <b>${c.diasEsgotados} de ${c.diasComOferta}</b> dias` : "",
        ]
          .filter(Boolean)
          .join("<br/>");
      },
    },
    grid: { left: 8, right: 8, top: 8, bottom: 60, containLabel: true },
    xAxis: { type: "category", data: faixa.map(hora), splitArea: { show: true } },
    yAxis: { type: "category", data: DIAS_SEMANA, inverse: true, splitArea: { show: true } },
    visualMap: visualMap(metrica, maximo),
    series: [
      {
        name: rotuloMetrica[metrica],
        type: "heatmap",
        data: dados,
        label: {
          show: true,
          fontSize: 10,
          color: "#fff",
          formatter: (p: any) => (p.value[2] === "-" ? "" : metrica === "ofertadas" ? String(p.value[2]) : `${Math.round(p.value[2])}`),
        },
        itemStyle: { borderColor: "#fff", borderWidth: 2, borderRadius: 4 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(15,23,42,0.3)" } },
      },
      {
        name: "Fora da grade",
        type: "scatter",
        data: encaixes,
        symbol: "roundRect",
        symbolSize: 22,
        itemStyle: { color: "#EDE9FE", borderColor: CORES.roxo, borderWidth: 1 },
        label: { show: true, color: CORES.roxo, fontSize: 10, fontWeight: "bold", formatter: (p: any) => `+${p.value[2]}` },
        z: 5,
      },
    ],
  };
}

export function heatmapDocasOption(celulas: CapacidadeDocaHora[], docas: CapacidadeDoca[], metrica: Exclude<MetricaCapacidade, "esgotadas">): EChartsOption {
  const comVagas = docas.filter((d) => d.vagasOfertadas > 0);
  const faixa = faixaHoras(celulas.map((c) => c.hora));
  const mapa = new Map(celulas.map((c) => [`${c.docaId}-${c.hora}`, c]));
  const dados = comVagas.flatMap((doca, linha) =>
    faixa.map((h, i) => {
      const c = mapa.get(`${doca.id}-${h}`);
      return c ? [i, linha, valorMetrica(c, metrica)] : [i, linha, "-"];
    }),
  );
  const maximo = Math.max(1, ...celulas.map((c) => valorMetrica(c, metrica)));

  return {
    animationDuration: 700,
    tooltip: {
      position: "top",
      formatter: (p: any) => {
        const doca = comVagas[p.value[1]]!;
        const c = mapa.get(`${doca.id}-${faixa[p.value[0]]}`);
        const titulo = `<b>${doca.nome}, ${hora(faixa[p.value[0]]!)}</b>`;
        if (!c) return `${titulo}<br/>Sem vagas na grade`;
        return `${titulo}<br/>Vagas: <b>${c.ofertadas}</b> • reservadas <b>${c.reservadas}</b><br/>Reservado: <b>${formatarPct(c.taxaReservaPct, 0)}</b> • utilização real <b>${formatarPct(c.utilizacaoRealPct, 0)}</b>`;
      },
    },
    grid: { left: 8, right: 8, top: 8, bottom: 60, containLabel: true },
    xAxis: { type: "category", data: faixa.map(hora), splitArea: { show: true } },
    yAxis: { type: "category", data: comVagas.map((d) => d.nome), inverse: true, splitArea: { show: true }, axisLabel: { color: CORES.texto } },
    visualMap: visualMap(metrica, maximo),
    series: [
      {
        name: rotuloMetrica[metrica],
        type: "heatmap",
        data: dados,
        label: {
          show: true,
          fontSize: 10,
          color: "#fff",
          formatter: (p: any) => (p.value[2] === "-" ? "" : metrica === "ofertadas" ? String(p.value[2]) : `${Math.round(p.value[2])}`),
        },
        itemStyle: { borderColor: "#fff", borderWidth: 2, borderRadius: 4 },
      },
    ],
  };
}

export function serieCapacidadeOption(serie: CapacidadeDia[]): EChartsOption {
  const muitos = serie.length > 45;
  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const d = serie[params[0].dataIndex]!;
        if (!d.horasOfertadas) return `<b>${formatarDiaCurto(d.data)}</b><br/>Sem vagas na grade`;
        return [
          `<b>${formatarDiaCurto(d.data)}</b>`,
          `Capacidade: <b>${formatarNumero(d.horasOfertadas, 1)} h</b>`,
          `Reservado: <b>${formatarNumero(d.horasReservadas, 1)} h</b> (${formatarPct(d.taxaReservaPct, 0)})`,
          `Utilizado de fato: <b>${formatarNumero(d.horasUtilizadas, 1)} h</b> (${formatarPct(d.utilizacaoRealPct, 0)})`,
          d.horasNaoComparecimento ? `Perdido por não comparecimento: <b>${formatarNumero(d.horasNaoComparecimento, 1)} h</b>` : "",
        ]
          .filter(Boolean)
          .join("<br/>");
      },
    },
    legend: { top: 0, data: ["Capacidade ofertada", "Reservado", "Utilizado de fato", "% reservado"] },
    grid: { left: 8, right: 8, top: 40, bottom: muitos ? 52 : 8, containLabel: true },
    xAxis: { type: "category", data: serie.map((d) => formatarDiaCurto(d.data)) },
    yAxis: [
      { type: "value", axisLabel: { formatter: (v: number) => `${formatarNumero(v)} h` } },
      { type: "value", min: 0, max: 100, axisLabel: { formatter: "{value}%" }, splitLine: { show: false } },
    ],
    dataZoom: muitos ? [{ type: "inside" }, { type: "slider", height: 18, bottom: 8 }] : undefined,
    series: [
      {
        name: "Capacidade ofertada",
        type: "bar",
        barGap: "-100%",
        barMaxWidth: 28,
        itemStyle: { color: CORES.trilho, borderRadius: [6, 6, 0, 0] },
        data: serie.map((d) => d.horasOfertadas),
        z: 1,
      },
      {
        name: "Reservado",
        type: "bar",
        barGap: "-100%",
        barMaxWidth: 28,
        itemStyle: { color: CORES.primariaClara, borderRadius: [6, 6, 0, 0] },
        data: serie.map((d) => d.horasReservadas),
        z: 2,
      },
      {
        name: "Utilizado de fato",
        type: "bar",
        barMaxWidth: 28,
        itemStyle: { color: CORES.primaria, borderRadius: [6, 6, 0, 0] },
        data: serie.map((d) => d.horasUtilizadas),
        z: 3,
      },
      {
        name: "% reservado",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        connectNulls: false,
        symbolSize: 6,
        lineStyle: { width: 3, color: CORES.alerta },
        itemStyle: { color: CORES.alerta },
        data: serie.map((d) => d.taxaReservaPct),
        z: 10,
      },
    ],
  };
}

export function perfilHoraOption(horas: CapacidadeHora[]): EChartsOption {
  const faixa = faixaHoras(horas.filter((h) => h.horasOfertadas > 0).map((h) => h.hora));
  const porHora = new Map(horas.map((h) => [h.hora, h]));
  const linhas = faixa.map((h) => porHora.get(h) ?? { hora: h, horasOfertadas: 0, horasReservadas: 0, horasUtilizadas: 0, taxaReservaPct: null, utilizacaoRealPct: null });

  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const h = linhas[params[0].dataIndex]!;
        return `<b>${hora(h.hora)}</b><br/>Capacidade: <b>${formatarNumero(h.horasOfertadas, 1)} h</b><br/>Reservado: <b>${formatarNumero(h.horasReservadas, 1)} h</b> (${formatarPct(h.taxaReservaPct, 0)})<br/>Utilizado: <b>${formatarNumero(h.horasUtilizadas, 1)} h</b> (${formatarPct(h.utilizacaoRealPct, 0)})`;
      },
    },
    legend: { top: 0 },
    grid: { left: 8, right: 12, top: 40, bottom: 8, containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: linhas.map((h) => hora(h.hora)) },
    yAxis: { type: "value", axisLabel: { formatter: (v: number) => `${formatarNumero(v)} h` } },
    series: [
      {
        name: "Capacidade",
        type: "line",
        step: "middle",
        symbol: "none",
        lineStyle: { width: 2, type: "dashed", color: CORES.textoSuave },
        itemStyle: { color: CORES.textoSuave },
        areaStyle: { color: "rgba(148,163,184,0.12)" },
        data: linhas.map((h) => h.horasOfertadas),
      },
      {
        name: "Reservado",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 3, color: CORES.primariaClara },
        itemStyle: { color: CORES.primariaClara },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(91,155,213,0.35)" },
              { offset: 1, color: "rgba(91,155,213,0.02)" },
            ],
          },
        },
        data: linhas.map((h) => h.horasReservadas),
      },
      {
        name: "Utilizado de fato",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 3, color: CORES.primaria },
        itemStyle: { color: CORES.primaria },
        data: linhas.map((h) => h.horasUtilizadas),
      },
    ],
  };
}

export function composicaoDocasOption(docas: CapacidadeDoca[]): EChartsOption {
  const lista = [...docas.filter((d) => d.vagasOfertadas > 0)].reverse();
  const reservadoSemUso = (d: CapacidadeDoca) => Math.max(0, Math.round((d.horasReservadas - d.horasUtilizadas) * 10) / 10);

  return {
    animationDuration: 700,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const d = lista[params[0].dataIndex]!;
        return [
          `<b>${d.nome}</b>${d.unidade ? ` • ${d.unidade}` : ""}`,
          `Capacidade: <b>${formatarNumero(d.horasOfertadas, 1)} h</b> em ${d.vagasOfertadas} vagas`,
          `Utilizado de fato: <b>${formatarNumero(d.horasUtilizadas, 1)} h</b> (${formatarPct(d.utilizacaoRealPct, 0)})`,
          `Reservado: <b>${formatarNumero(d.horasReservadas, 1)} h</b> (${formatarPct(d.taxaReservaPct, 0)})`,
          `Ocioso: <b>${formatarNumero(d.horasOciosas, 1)} h</b>`,
        ].join("<br/>");
      },
    },
    legend: { top: 0, right: 0 },
    grid: { left: 8, right: 56, top: 32, bottom: 4, containLabel: true },
    xAxis: { type: "value", axisLabel: { formatter: (v: number) => `${formatarNumero(v)} h` } },
    yAxis: { type: "category", data: lista.map((d) => d.nome), axisLabel: { color: CORES.texto } },
    series: [
      {
        name: "Utilizado de fato",
        type: "bar",
        stack: "capacidade",
        barWidth: 20,
        itemStyle: { color: CORES.primaria, borderRadius: [6, 0, 0, 6] },
        data: lista.map((d) => Math.min(d.horasUtilizadas, d.horasReservadas)),
      },
      {
        name: "Reservado sem uso",
        type: "bar",
        stack: "capacidade",
        itemStyle: { color: CORES.primariaClara },
        data: lista.map(reservadoSemUso),
      },
      {
        name: "Ocioso",
        type: "bar",
        stack: "capacidade",
        itemStyle: { color: CORES.trilho, borderRadius: [0, 6, 6, 0] },
        label: { show: true, position: "right", color: CORES.textoSuave, formatter: (p: any) => formatarPct(lista[p.dataIndex]!.taxaReservaPct, 0) },
        data: lista.map((d) => d.horasOciosas),
      },
    ],
  };
}

export function aproveitamentoOption(vagaMediaMin: number | null, descargaMediaMin: number | null): EChartsOption {
  const pct = vagaMediaMin && descargaMediaMin !== null ? Math.round((descargaMediaMin * 1000) / vagaMediaMin) / 10 : 0;
  const cor = pct > 100 ? CORES.perigo : pct >= 70 ? CORES.sucesso : CORES.alerta;

  return {
    animationDuration: 900,
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 130,
        radius: "100%",
        center: ["50%", "58%"],
        progress: { show: true, width: 14, roundCap: true, itemStyle: { color: cor } },
        axisLine: { roundCap: true, lineStyle: { width: 14, color: [[1, CORES.trilho]] } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: true, offsetCenter: [0, "34%"], fontSize: 12, color: CORES.textoSuave },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, "-4%"],
          fontSize: 28,
          fontWeight: 700,
          color: CORES.texto,
          formatter: (v: number) => `${formatarNumero(v, 0)}%`,
        },
        data: [{ value: pct, name: "da vaga usada na descarga" }],
      },
    ],
  };
}
