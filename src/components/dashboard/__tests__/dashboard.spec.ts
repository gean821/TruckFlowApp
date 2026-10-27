import { describe, expect, it } from "vitest";
import { diaHoraAHoraOption, metaGaugeOption } from "@/components/relatorios/charts/dashboardOptions";
import type { DashboardHojeHora } from "@/entities/dashboardHoje.types";
import { formatarDuracao } from "@/utils/relatorioFormat";

const horas = (preencher: Partial<Record<number, Partial<DashboardHojeHora>>>): DashboardHojeHora[] =>
  Array.from({ length: 24 }, (_, hora) => ({ hora, agendados: 0, chegadas: 0, concluidos: 0, mediaAgendados: 0, ...preencher[hora] }));

describe("formatarDuracao", () => {
  it("mostra minutos e horas de forma curta", () => {
    expect(formatarDuracao(null)).toBe("—");
    expect(formatarDuracao(45)).toBe("45 min");
    expect(formatarDuracao(60)).toBe("1h");
    expect(formatarDuracao(397)).toBe("6h 37min");
    expect(formatarDuracao(65)).toBe("1h 05min");
  });
});

describe("diaHoraAHoraOption", () => {
  it("recorta as horas sem movimento, mas sempre mostra a hora atual", () => {
    const option = diaHoraAHoraOption(horas({ 9: { agendados: 3 }, 14: { agendados: 2 } }), 18, "terça-feira") as any;

    expect(option.xAxis.data[0]).toBe("08h");
    expect(option.xAxis.data.at(-1)).toBe("18h");
    expect(option.series[0].markLine.data[0].xAxis).toBe("18h");
    expect(option.series[3].name).toBe("Média das terças");
  });

  it("não desenha chegadas e concluídos no futuro", () => {
    const option = diaHoraAHoraOption(horas({ 8: { chegadas: 2, agendados: 2 }, 10: { agendados: 1 } }), 9, "quarta-feira") as any;
    const indice10 = option.xAxis.data.indexOf("10h");

    expect(option.series[1].data[option.xAxis.data.indexOf("08h")]).toBe(2);
    expect(option.series[1].data[indice10]).toBeNull();
  });
});

describe("metaGaugeOption", () => {
  it("passa de 100% sem cortar o ponteiro", () => {
    const option = metaGaugeOption(132.4) as any;

    expect(option.series[0].data[0].value).toBe(132.4);
    expect(option.series[0].max).toBe(140);
    expect((metaGaugeOption(40) as any).series[0].max).toBe(100);
  });
});
