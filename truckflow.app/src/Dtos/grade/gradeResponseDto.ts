export default interface GradeResponseDto {
    id: string;
    fornecedorId: string;
    fornecedor: string;
    produto: string;
    produtoId: string;
    dataInicio: string;
    dataFim: string;
    horaInicial: string;
    horaFinal: string;
    unidadeEntrega: string;
    diasSemana: string;
    createdAt: string;
    UpdatedAt?: string | null;
    intervaloMinutos: number;
}