export default interface IRelatorioAgendamentoFilterDto {
    dataInicio?: string;
    dataFim?: string;
    horaInicio?: string;
    horaFim?: string;
    fornecedorId?: string;
    produtoId?: string;
    placaVeiculo?: string;
    motorista?: string;
    unidadeEntregaId?: string;
    localDescargaId?: string;
    status?: string[];
    origem?: string;
    chegada?: string;
    busca?: string;
    ordenarPor?: string;
    desc?: boolean;
}

export type FormatoRelatorio = "csv" | "pdf" | "xlsx";
