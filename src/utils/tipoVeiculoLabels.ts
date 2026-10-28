import { TipoVeiculo } from "@/enums/TipoVeiculo";
export const TipoVeiculoLabels: Record<number, string> = {
    [TipoVeiculo.CarretaDoisEixos]: "Carreta 2 Eixos",
    [TipoVeiculo.Ls]: "LS (Cavalo Mecânico)",
    [TipoVeiculo.CarretaCavaloTrucado]: "Carreta Cavalo Trucado",
    [TipoVeiculo.BiTrem]: "Bitrem",
    [TipoVeiculo.TriTrem]: "Tritrem",
    [TipoVeiculo.RodoTrem]: "Rodotrem",
    [TipoVeiculo.CarretaBau]: "Carreta Baú",
    [TipoVeiculo.CarretaSider]: "Carreta Sider",
    [TipoVeiculo.Vanderleia]: "Vanderléia",
    [TipoVeiculo.BauFrigorifico]: "Baú Frigorífico"
};

export function formatarTipoVeiculo(valor: string | number | null | undefined): string {
    if (valor === null || valor === undefined || valor === "") return "-";
    const numero = Number(valor);
    if (!Number.isNaN(numero)) return TipoVeiculoLabels[numero] ?? String(valor);
    const porNome = TipoVeiculo[valor as keyof typeof TipoVeiculo];
    return porNome !== undefined ? TipoVeiculoLabels[porNome] ?? String(valor) : String(valor);
}
