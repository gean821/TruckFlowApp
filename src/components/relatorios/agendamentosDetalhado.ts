import type { AgendamentoDetalhado, SituacaoChegada } from "@/entities/relatorioAgendamentos.types";
import { formatarDuracao } from "@/utils/relatorioFormat";

export interface OpcaoMeta {
  valor: string;
  rotulo: string;
  cor: string;
  icone: string;
}

export const STATUS_AGENDAMENTO: OpcaoMeta[] = [
  { valor: "Agendado", rotulo: "Agendado", cor: "purple", icone: "mdi-calendar-check-outline" },
  { valor: "EmAndamento", rotulo: "No pátio", cor: "blue", icone: "mdi-truck-fast-outline" },
  { valor: "Finalizado", rotulo: "Concluído", cor: "success", icone: "mdi-check-circle-outline" },
  { valor: "Expirado", rotulo: "Não compareceu", cor: "error", icone: "mdi-account-cancel-outline" },
  { valor: "Cancelado", rotulo: "Cancelado", cor: "grey", icone: "mdi-cancel" },
];

export const SITUACOES_CHEGADA: OpcaoMeta[] = [
  { valor: "Adiantado", rotulo: "Adiantado", cor: "teal", icone: "mdi-clock-fast" },
  { valor: "NoHorario", rotulo: "No horário", cor: "success", icone: "mdi-clock-check-outline" },
  { valor: "Atrasado", rotulo: "Atrasado", cor: "warning", icone: "mdi-clock-alert-outline" },
  { valor: "NaoCompareceu", rotulo: "Não compareceu", cor: "error", icone: "mdi-clock-remove-outline" },
];

export const ORIGENS: { valor: string; rotulo: string }[] = [
  { valor: "Grade", rotulo: "Pela grade" },
  { valor: "Avulso", rotulo: "Avulso / encaixe" },
];

export interface ColunaDetalhado {
  key: string;
  title: string;
  sortable: boolean;
  align?: "start" | "end" | "center";
  padrao: boolean;
}

export const COLUNAS_DETALHADO: ColunaDetalhado[] = [
  { key: "janela", title: "Janela", sortable: true, padrao: true },
  { key: "status", title: "Status", sortable: true, padrao: true },
  { key: "motorista", title: "Motorista", sortable: true, padrao: true },
  { key: "placa", title: "Placa", sortable: true, padrao: true },
  { key: "fornecedor", title: "Fornecedor", sortable: true, padrao: true },
  { key: "produto", title: "Produto", sortable: true, padrao: true },
  { key: "notaFiscal", title: "Nota fiscal", sortable: false, padrao: false },
  { key: "unidade", title: "Unidade", sortable: true, padrao: false },
  { key: "doca", title: "Doca", sortable: true, padrao: true },
  { key: "origem", title: "Origem", sortable: false, padrao: false },
  { key: "peso", title: "Carga", sortable: true, align: "end", padrao: true },
  { key: "chegada", title: "Chegada", sortable: true, padrao: true },
  { key: "inicioDescarga", title: "Início descarga", sortable: false, padrao: false },
  { key: "fimDescarga", title: "Fim descarga", sortable: true, padrao: false },
  { key: "saida", title: "Saída", sortable: false, padrao: false },
  { key: "espera", title: "Espera", sortable: false, align: "end", padrao: true },
  { key: "descarga", title: "Descarga", sortable: false, align: "end", padrao: true },
  { key: "permanencia", title: "Permanência", sortable: false, align: "end", padrao: false },
];

export const COLUNAS_PADRAO = COLUNAS_DETALHADO.filter((c) => c.padrao).map((c) => c.key);

const ORDENAVEIS = new Set(COLUNAS_DETALHADO.filter((c) => c.sortable).map((c) => c.key));

export const ordenacaoValida = (chave: unknown): string | null =>
  typeof chave === "string" && ORDENAVEIS.has(chave) ? chave : null;

export const metaStatus = (status: string) =>
  STATUS_AGENDAMENTO.find((s) => s.valor === status) ?? { valor: status, rotulo: status, cor: "grey", icone: "mdi-help-circle-outline" };

export const metaSituacao = (situacao: SituacaoChegada | string | null) =>
  situacao ? SITUACOES_CHEGADA.find((s) => s.valor === situacao) ?? null : null;

export function lerLista(valor: unknown, permitidos: string[]): string[] {
  if (typeof valor !== "string" || !valor) return [];
  return [...new Set(valor.split(",").filter((v) => permitidos.includes(v)))];
}

export function lerOpcao(valor: unknown, permitidos: string[]): string | null {
  return typeof valor === "string" && permitidos.includes(valor) ? valor : null;
}

export function descreverAtraso(minutos: number | null): string | null {
  if (minutos === null) return null;
  const arredondado = Math.round(minutos);
  if (arredondado === 0) return "no início da janela";
  const texto = formatarDuracao(Math.abs(arredondado));
  return arredondado > 0 ? `${texto} após o início` : `${texto} antes`;
}

export interface PassoCiclo {
  titulo: string;
  horario: string | null;
  estimado: boolean;
  icone: string;
  cor: string;
  intervalo: string | null;
}

export function linhaDoTempo(a: AgendamentoDetalhado): PassoCiclo[] {
  const situacao = metaSituacao(a.situacaoChegada);

  return [
    {
      titulo: "Janela agendada",
      horario: a.dataInicio,
      estimado: false,
      icone: "mdi-calendar-clock",
      cor: "primary",
      intervalo: null,
    },
    {
      titulo: situacao && a.chegouEm ? `Chegada • ${situacao.rotulo.toLowerCase()}` : "Chegada",
      horario: a.chegouEm,
      estimado: false,
      icone: "mdi-gate",
      cor: situacao?.cor ?? "grey",
      intervalo: null,
    },
    {
      titulo: "Início da descarga",
      horario: a.inicioDescarga,
      estimado: a.inicioEstimado,
      icone: "mdi-tray-arrow-down",
      cor: "blue",
      intervalo: a.esperaMin !== null ? `${formatarDuracao(a.esperaMin)} de espera` : null,
    },
    {
      titulo: "Fim da descarga",
      horario: a.fimDescargaEm,
      estimado: false,
      icone: "mdi-check-circle-outline",
      cor: "success",
      intervalo: a.descargaMin !== null ? `${formatarDuracao(a.descargaMin)} descarregando` : null,
    },
    {
      titulo: "Saída",
      horario: a.saida,
      estimado: a.saidaEstimada,
      icone: "mdi-exit-run",
      cor: "blue-grey",
      intervalo: null,
    },
  ];
}

export const linkWhatsapp = (telefone: string | null) => {
  const digitos = telefone?.replace(/\D/g, "") ?? "";
  if (digitos.length < 10) return null;
  return `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}`;
};
