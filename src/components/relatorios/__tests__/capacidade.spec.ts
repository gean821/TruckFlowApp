import { describe, expect, it } from "vitest";
import type { CapacidadeCelula, CapacidadeDoca } from "@/entities/relatorioBi.types";
import {
  aproveitamentoOption,
  composicaoDocasOption,
  faixaHoras,
  heatmapDocasOption,
  heatmapSemanaOption,
  perfilHoraOption,
  valorMetrica,
} from "../charts/capacidadeOptions";

const celula = (diaSemana: number, hora: number, extra: Partial<CapacidadeCelula> = {}): CapacidadeCelula => ({
  diaSemana,
  hora,
  ofertadas: 4,
  reservadas: 3,
  realizadas: 2,
  naoCompareceu: 1,
  foraDaGrade: 0,
  taxaReservaPct: 75,
  utilizacaoRealPct: 40,
  diasComOferta: 4,
  diasEsgotados: 1,
  ...extra,
});

const doca = (id: string, nome: string, extra: Partial<CapacidadeDoca> = {}): CapacidadeDoca => ({
  id,
  nome,
  unidade: "Unidade Norte",
  vagasOfertadas: 10,
  vagasReservadas: 8,
  descargas: 6,
  naoCompareceu: 1,
  foraDaGrade: 0,
  horasOfertadas: 10,
  horasReservadas: 8,
  horasUtilizadas: 5,
  horasOciosas: 2,
  taxaReservaPct: 80,
  utilizacaoRealPct: 50,
  descargaMediaMin: 40,
  horaPico: 8,
  serieTaxaReserva: [80],
  ...extra,
});

describe("faixaHoras", () => {
  it("cobre do primeiro ao último horário com vaga e usa 6h–18h sem dados", () => {
    expect(faixaHoras([10, 8, 12])).toEqual([8, 9, 10, 11, 12]);
    expect(faixaHoras([])).toHaveLength(13);
  });
});

describe("valorMetrica", () => {
  it("traduz cada métrica do seletor", () => {
    const c = celula(0, 8);
    expect(valorMetrica(c, "reserva")).toBe(75);
    expect(valorMetrica(c, "utilizacao")).toBe(40);
    expect(valorMetrica(c, "ofertadas")).toBe(4);
    expect(valorMetrica(c, "esgotadas")).toBe(25);
  });
});

describe("heatmapSemanaOption", () => {
  it("marca horário sem vaga como vazio e usa escala 0–100 nas porcentagens", () => {
    const option = heatmapSemanaOption([celula(0, 8), celula(2, 10, { taxaReservaPct: 100 })], "reserva") as any;
    const dados = option.series[0].data;

    expect(option.xAxis.data).toEqual(["08h", "09h", "10h"]);
    expect(dados).toContainEqual([0, 0, 75]);
    expect(dados).toContainEqual([2, 2, 100]);
    expect(dados).toContainEqual([1, 0, "-"]);
    expect(option.visualMap.max).toBe(100);

    const tooltip = option.tooltip.formatter({ value: [0, 0, 75] });
    expect(tooltip).toContain("Segunda, 08h");
    expect(tooltip).toContain("Esgotou em <b>1 de 4</b> dias");

    const comEncaixe = heatmapSemanaOption([celula(0, 8), celula(6, 9, { ofertadas: 0, reservadas: 0, foraDaGrade: 3, taxaReservaPct: null })], "reserva") as any;
    expect(comEncaixe.series[0].data).toContainEqual([1, 6, "-"]);
    expect(comEncaixe.series[1].data).toEqual([[1, 6, 3]]);

    const vagas = heatmapSemanaOption([celula(0, 8, { ofertadas: 12 })], "ofertadas") as any;
    expect(vagas.visualMap.max).toBe(12);
  });
});

describe("heatmapDocasOption", () => {
  it("só mostra docas que tiveram vaga", () => {
    const option = heatmapDocasOption(
      [{ docaId: "a", hora: 8, ofertadas: 2, reservadas: 2, taxaReservaPct: 100, utilizacaoRealPct: 60 }],
      [doca("a", "Doca A"), doca("b", "Doca parada", { vagasOfertadas: 0 })],
      "utilizacao",
    ) as any;

    expect(option.yAxis.data).toEqual(["Doca A"]);
    expect(option.series[0].data).toEqual([[0, 0, 60]]);
  });
});

describe("composicaoDocasOption", () => {
  it("divide a capacidade em usado, reservado sem uso e ocioso", () => {
    const option = composicaoDocasOption([doca("a", "Doca A"), doca("b", "Doca B", { horasReservadas: 3, horasUtilizadas: 4, horasOciosas: 7 })]) as any;

    expect(option.yAxis.data).toEqual(["Doca B", "Doca A"]);
    expect(option.series[0].data).toEqual([3, 5]);
    expect(option.series[1].data).toEqual([0, 3]);
    expect(option.series[2].data).toEqual([7, 2]);
  });
});

describe("perfilHoraOption", () => {
  it("recorta as horas sem capacidade", () => {
    const horas = Array.from({ length: 24 }, (_, h) => ({
      hora: h,
      horasOfertadas: h >= 7 && h <= 9 ? 3 : 0,
      horasReservadas: h === 8 ? 3 : 0,
      horasUtilizadas: 0,
      taxaReservaPct: null,
      utilizacaoRealPct: null,
    }));

    const option = perfilHoraOption(horas) as any;
    expect(option.xAxis.data).toEqual(["07h", "08h", "09h"]);
    expect(option.series[1].data).toEqual([0, 3, 0]);
  });
});

describe("aproveitamentoOption", () => {
  it("pinta de vermelho quando a descarga passa da vaga", () => {
    const folga = aproveitamentoOption(60, 30) as any;
    const estouro = aproveitamentoOption(60, 75) as any;

    expect(folga.series[0].data[0].value).toBe(50);
    expect(estouro.series[0].data[0].value).toBe(125);
    expect(estouro.series[0].progress.itemStyle.color).toBe("#EF4444");
  });
});
