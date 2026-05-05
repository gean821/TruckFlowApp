import type { EmpresaResponseDto, EmpresaUpdateDto } from "@/Dtos/empresa/empresaDto";
import http from "@/http/http";

export const EmpresaService = () => {
  const get = async (empresaId: string): Promise<EmpresaResponseDto> => {
    const { data } = await http.get<EmpresaResponseDto>(`/empresa/${empresaId}`);
    return data;
  };

  const update = async (empresaId: string, payload: EmpresaUpdateDto): Promise<EmpresaResponseDto> => {
    const { data } = await http.patch<EmpresaResponseDto>(`/empresa/${empresaId}`, payload);
    return data;
  };

  return { get, update };
};
