export default interface gradeCreateDto {
    fornecedorId: string;
    produtoId: string;
    dataInicio: string; 
    dataFim: string;
    horaInicial: string;
    horaFinal: string;
    intervaloMinutos: number;
    unidadeEntregaId: string;
    diasSemana: string; 
}