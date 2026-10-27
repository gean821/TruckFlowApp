import type { EChartsOption } from "echarts";
import type { DashboardHojeHora } from "@/entities/dashboardHoje.types";
import { formatarNumero } from "@/utils/relatorioFormat";
import { CORES } from "./echarts";

export function diaHoraAHoraOption(horas: DashboardHojeHora[], horaAtual: number, diaSemana: string): EChartsOption {
  const comMovimento = horas.filter((h) => h.agendados + h.chegadas + h.concluidos + h.mediaAgendados > 0).map((h) => h.hora);
  const primeira = comMovimento.length ? Math.min(Math.max(0, comMovimento[0]! - 1), horaAtual) : 6;
  const ultima = comMovimento.length ? Math.max(Math.min(23, comMovimento[comMovimento.length - 1]! + 1), horaAtual) : 20;
  const visiveis = horas.filter((h) => h.hora >= primeira && h.hora <= ultima);
  const rotulos = visiveis.map((h) => `${String(h.hora).padStart(2, "0")}h`);
  const rotuloAgora = `${String(horaAtual).padStart(2, "0")}h`;

  return {
    animationDuration: 700,
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { top: 0, right: 0 },
    grid: { left: 8, right: 12, top: 40, bottom: 8, containLabel: true },
    xAxis: { type: "category", data: rotulos },
    yAxis: { type: "value", minInterval: 1 },
    series: [
      {
        name: "Agendados",
        type: "bar",
        barMaxWidth: 22,
        data: visiveis.map((h) => ({
          value: h.agendados,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: h.hora < horaAtual ? "#BFDBFE" : h.hora === horaAtual ? CORES.primaria : CORES.primariaClara,
          },
        })),
        markLine: {
          symbol: "none",
          silent: true,
          lineStyle: { color: CORES.perigo, type: "solid", width: 2 },
          label: { formatter: "agora", color: CORES.perigo, fontWeight: "bold", position: "end" },
          data: [{ xAxis: rotuloAgora }],
        },
      },
      {
        name: "Chegadas",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        data: visiveis.map((h) => (h.hora <= horaAtual ? h.chegadas : null)),
        lineStyle: { width: 3, color: CORES.roxo },
        itemStyle: { color: CORES.roxo },
      },
      {
        name: "Concluídos",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        data: visiveis.map((h) => (h.hora <= horaAtual ? h.concluidos : null)),
        lineStyle: { width: 3, color: CORES.sucesso },
        itemStyle: { color: CORES.sucesso },
      },
      {
        name: `Média das ${diaSemana.replace("-feira", "s")}`,
        type: "line",
        smooth: true,
        symbol: "none",
        data: visiveis.map((h) => h.mediaAgendados),
        lineStyle: { width: 2, type: "dashed", color: CORES.cinza },
        itemStyle: { color: CORES.cinza },
        tooltip: { valueFormatter: (v) => formatarNumero(Number(v), 1) },
      },
    ],
  };
}

export function metaGaugeOption(atingimentoPct: number): EChartsOption {
  const valor = Math.round(atingimentoPct * 10) / 10;
  const cor = valor >= 100 ? CORES.sucesso : valor >= 70 ? CORES.primaria : CORES.alerta;

  return {
    series: [
      {
        type: "gauge",
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: Math.max(100, Math.ceil(valor / 10) * 10),
        radius: "95%",
        center: ["50%", "58%"],
        progress: { show: true, roundCap: true, width: 16, itemStyle: { color: cor } },
        axisLine: { roundCap: true, lineStyle: { width: 16, color: [[1, CORES.trilho]] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: { show: true, offsetCenter: [0, "28%"], fontSize: 12, color: CORES.textoSuave },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, "-4%"],
          fontSize: 30,
          fontWeight: "bold",
          color: CORES.texto,
          formatter: (v: number) => `${formatarNumero(v, 1)}%`,
        },
        data: [{ value: valor, name: "da meta do dia" }],
        animationDuration: 1000,
      },
    ],
  };
}
