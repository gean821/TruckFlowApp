import type { ExcluirContaMotoristaDto } from "@/entities/contaMotorista.types";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const ContaMotoristaService = () => {
  const excluir = async (dto: ExcluirContaMotoristaDto): Promise<void> => {
    const { data } = await api.post<{ token: string }>("/AuthMotorista/login", dto);
    await api.delete("/AuthMotorista/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });
  };

  return { excluir };
};
