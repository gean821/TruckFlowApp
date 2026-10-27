import { describe, expect, it } from "vitest";
import type { RecebimentosBalde } from "@/entities/relatorioBi.types";
import { corDoProduto, fluxoOption, mediaMovel, planejamentoOption, volumeOption } from "../charts/recebimentosOptions";

const balde = (rotulo: string, porProduto: Record<string, number>, metaKg: number | null = null): RecebimentosBalde => ({
  inicio: "2026-10-01",
  fim: "2026-10-01",
  rotulo,
  totalKg: Object.values(porProduto).reduce((a, b) => a + b, 0),
  descargas: 1,
  porProduto,
  metaKg,
});

describe("mediaMovel", () => {
  it("só começa quando a janela está completa", () => {
    expect(mediaMovel([10, 20, 30, 40], 3)).toEqual([null, null, 20, 30]);
  });
});

describe("corDoProduto", () => {
  it("mantém a cor pela ordem e deixa Outros em cinza", () => {
    const produtos = ["Soja", "Milho", "Outros"];
    expect(corDoProduto("Soja", produtos)).not.toBe(corDoProduto("Milho", produtos));
    expect(corDoProduto("Outros", produtos)).toBe("#94A3B8");
  });
});

describe("volumeOption", () => {
  it("empilha os produtos em toneladas e só desenha meta quando existe", () => {
    const serie = [balde("01/10", { Soja: 30000, Milho: 10000 }, 50000), balde("02/10", { Soja: 20000 }, 50000)];

    const option = volumeOption(serie, ["Soja", "Milho"], "dia") as any;
    const soja = option.series.find((s: any) => s.name === "Soja");

    expect(soja.stack).toBe("volume");
    expect(soja.data).toEqual([30, 20]);
    expect(option.series.find((s: any) => s.name === "Milho").data).toEqual([10, 0]);
    expect(option.series.find((s: any) => s.name === "Meta").data).toEqual([50, 50]);

    const semMeta = volumeOption([balde("01/10", { Soja: 1000 })], ["Soja"], "semana") as any;
    expect(semMeta.series.some((s: any) => s.name === "Meta")).toBe(false);
    expect(semMeta.series.at(-1).name).toBe("Média móvel (3 semanas)");
  });
});

describe("fluxoOption", () => {
  it("usa o id como chave e mostra o nome amigável", () => {
    const option = fluxoOption({
      nos: [
        { id: "f:Soja", nome: "Soja", tipo: "fornecedor" },
        { id: "p:Soja", nome: "Soja", tipo: "produto" },
      ],
      ligacoes: [{ origem: "f:Soja", destino: "p:Soja", kg: 1000 }],
    }) as any;

    const serie = option.series[0];
    expect(serie.data.map((n: any) => n.name)).toEqual(["f:Soja", "p:Soja"]);
    expect(serie.links[0]).toEqual({ source: "f:Soja", target: "p:Soja", value: 1000 });
    expect(serie.label.formatter({ name: "p:Soja" })).toBe("Soja");
  });
});

describe("planejamentoOption", () => {
  it("pinta o recebido pela situação", () => {
    const option = planejamentoOption([
      { itemId: "1", produto: "Soja", fornecedor: "A", planejadoKg: 1000, recebidoKg: 500, cumprimentoPct: 50, situacao: "Atrasado" },
      { itemId: "2", produto: "Milho", fornecedor: "B", planejadoKg: 1000, recebidoKg: 1200, cumprimentoPct: 120, situacao: "Adiantado" },
    ]) as any;

    const recebido = option.series[1].data;
    expect(recebido[0].itemStyle.color).not.toBe(recebido[1].itemStyle.color);
    expect(option.yAxis.data.at(-1)).toBe("A • Soja");
  });
});
