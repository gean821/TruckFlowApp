export default interface GradeUpdateDto {
    fornecedorId: string;
    produtoId: string;
    dataInicio: string;
    dataFim: string;
    horaInicial: string;
    horaFinal: string;
    intervaloMinutos: number;
    diasSemana: string;
}