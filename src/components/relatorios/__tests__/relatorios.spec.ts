import { describe, expect, it } from "vitest";
import { intervaloDoPreset } from "@/composables/useFiltrosRelatorio";
import { descreverPeriodo, formatarPct, formatarToneladas } from "@/utils/relatorioFormat";
import { heatmapOption, rankingOption, statusOption, volumeMetaOption } from "../charts/visaoGeralOptions";

const hoje = new Date(2026, 9, 27);

describe("intervaloDoPreset", () => {
  it("monta os períodos a partir de hoje", () => {
    expect(intervaloDoPreset("hoje", hoje)).toEqual({ inicio: "2026-10-27", fim: "2026-10-27" });
    expect(intervaloDoPreset("7d", hoje)).toEqual({ inicio: "2026-10-21", fim: "2026-10-27" });
    expect(intervaloDoPreset("mes", hoje)).toEqual({ inicio: "2026-10-01", fim: "2026-10-27" });
    expect(intervaloDoPreset("mesPassado", hoje)).toEqual({ inicio: "2026-09-01", fim: "2026-09-30" });
    expect(intervaloDoPreset("12m", hoje)).toEqual({ inicio: "2025-11-01", fim: "2026-10-27" });
  });

  it("vira o ano no mês passado de janeiro", () => {
    expect(intervaloDoPreset("mesPassado", new Date(2027, 0, 10))).toEqual({ inicio: "2026-12-01", fim: "2026-12-31" });
  });
});

describe("formatação", () => {
  it("formata toneladas, percentual e período em português", () => {
    expect(formatarToneladas(14636800)).toBe("14.637 t");
    expect(formatarToneladas(29000)).toBe("29,0 t");
    expect(formatarPct(92.7)).toBe("92,7%");
    expect(formatarPct(null)).toBe("—");
    expect(descreverPeriodo("2026-10-01", "2026-10-27")).toBe("1 a 27 de out 2026");
    expect(descreverPeriodo("2026-09-28", "2026-10-27")).toBe("28 set a 27 out 2026");
    expect(descreverPeriodo("2025-12-15", "2026-01-10")).toBe("15 dez 2025 a 10 jan 2026");
  });
});

describe("opções dos gráficos", () => {
  it("heatmap recorta as horas sem movimento, mantendo uma de margem", () => {
    const matriz = Array.from({ length: 7 }, () => Array(24).fill(0));
    matriz[1]![8] = 5;
    matriz[3]![15] = 2;

    const option = heatmapOption(matriz) as any;

    expect(option.xAxis.data[0]).toBe("07h");
    expect(option.xAxis.data.at(-1)).toBe("16h");
    expect(option.visualMap.max).toBe(5);
  });

  it("volume pinta de verde o dia que bateu a meta e desenha a linha da meta", () => {
    const serie = [
      { data: "2026-10-01", agendamentos: 1, concluidos: 1, cancelados: 0, naoCompareceu: 0, pesoKg: 600000 },
      { data: "2026-10-02", agendamentos: 1, concluidos: 1, cancelados: 0, naoCompareceu: 0, pesoKg: 100000 },
    ];

    const option = volumeMetaOption(serie, 500000) as any;
    const barras = option.series[0].data;

    expect(barras[0].value).toBe(600);
    expect(barras[0].itemStyle.color).not.toBe(barras[1].itemStyle.color);
    expect(option.series[0].markLine.data[0].yAxis).toBe(500);
    expect((volumeMetaOption(serie, null) as any).series[0].markLine).toBeUndefined();
  });

  it("status leva o código da API em cada fatia para o drill-down", () => {
    const option = statusOption({ agendado: 2, emAndamento: 1, finalizado: 10, cancelado: 1, expirado: 3 }) as any;
    const fatias = option.series[0].data;

    expect(fatias.find((f: any) => f.name === "Não compareceu").status).toBe("Expirado");
    expect(fatias.find((f: any) => f.name === "Concluídos").value).toBe(10);
  });

  it("ranking mostra o maior no topo", () => {
    const option = rankingOption([
      { id: "a", nome: "Fornecedor A", agendamentos: 5, concluidos: 5, pesoKg: 300, percentual: 75 },
      { id: "b", nome: "Fornecedor B", agendamentos: 2, concluidos: 2, pesoKg: 100, percentual: 25 },
    ]) as any;

    expect(option.yAxis.data.at(-1)).toBe("Fornecedor A");
  });
});
