export default interface ItemPlanejamentoUpdate {
    produtoId: string;
    planejamentoRecebimentoId: string;
    cadenciaDiariaPlanejada: number;
    diasSemana: string;
    toleranciaExtra?: number;
}
