export default interface ItemPlanejamentoResponse {
    id: string;
    produto: string;
    fornecedor: string;
    quantidadeTotalPlanejada: number;
    cadenciaDiariaPlanejada: number;
    quantidadeTotalRecebida: number;
    quantidadeReservada: number;
    faltaReceber: number;
    diasSemana: string;
    toleranciaExtra: number;
    createdAt: string;
}
