import { BarChart, FunnelChart, GaugeChart, HeatmapChart, LineChart, PieChart, SankeyChart, ScatterChart } from "echarts/charts";
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { registerTheme, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

export const CORES = {
  primaria: "#195FA0",
  primariaClara: "#5B9BD5",
  sucesso: "#16A34A",
  alerta: "#F59E0B",
  perigo: "#EF4444",
  roxo: "#8B5CF6",
  ciano: "#06B6D4",
  cinza: "#94A3B8",
  trilho: "#EEF2F7",
  texto: "#0F172A",
  textoSuave: "#64748B",
};

export const PALETA = [CORES.primaria, CORES.sucesso, CORES.alerta, CORES.roxo, CORES.ciano, CORES.perigo, CORES.cinza];

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  HeatmapChart,
  FunnelChart,
  GaugeChart,
  SankeyChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  MarkLineComponent,
]);

registerTheme("truckflow", {
  color: PALETA,
  backgroundColor: "transparent",
  textStyle: { fontFamily: "Roboto, sans-serif", color: CORES.textoSuave },
  tooltip: {
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    borderWidth: 0,
    padding: [10, 14],
    textStyle: { color: "#fff", fontSize: 12 },
    extraCssText: "border-radius: 12px; box-shadow: 0 12px 32px rgba(15,23,42,.25);",
  },
  legend: { textStyle: { color: CORES.textoSuave }, icon: "roundRect", itemWidth: 12, itemHeight: 8 },
  categoryAxis: {
    axisLine: { lineStyle: { color: "#E2E8F0" } },
    axisTick: { show: false },
    axisLabel: { color: CORES.textoSuave },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: CORES.textoSuave },
    splitLine: { lineStyle: { color: "#F1F5F9", type: "dashed" } },
  },
});

export const TEMA = "truckflow";
