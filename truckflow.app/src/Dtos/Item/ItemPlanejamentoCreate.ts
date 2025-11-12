export default interface ItemPlanejamentoCreate {
    produtoId: string;
    planejamentoRecebimentoId?: string | null | undefined;
    quantidadeTotalPlanejada: number;
    cadenciaDiariaPlanejada: number;
}