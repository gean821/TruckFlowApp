export default interface IRelatorioAgendamentoFilterDto {
    dataInicio?: string;
    dataFim?: string;
    horaInicio?: string;
    horaFim?: string;
    fornecedorId?: string;
    produtoId?: string;
    placaVeiculo?: string;
    motorista?: string;
}

export type FormatoRelatorio = "csv" | "pdf";