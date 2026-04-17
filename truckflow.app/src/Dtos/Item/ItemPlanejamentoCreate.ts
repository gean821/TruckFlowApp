export default interface ItemPlanejamentoCreate {
    produtoId: string;
    planejamentoRecebimentoId?: string | null | undefined;
    cadenciaDiariaPlanejada: number;
    diasSemana: string;
    toleranciaExtra?: number;
}
