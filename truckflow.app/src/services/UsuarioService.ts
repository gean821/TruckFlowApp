import type {
  UsuarioCreateDto,
  UsuarioListQueryDto,
  UsuarioResponseDto,
  UsuarioUpdateDto
} from "@/entities/usuario.types";
import type { PaginatedResponse } from "@/entities/paginatedResponse";
import http from "@/http/http";

export const UsuarioService = () => {
  const getPaged = async (
    query: UsuarioListQueryDto
  ): Promise<PaginatedResponse<UsuarioResponseDto>> => {
    const { data } = await http.get('/usuarios', { params: query });
    return data;
  };

  const getById = async (id: string): Promise<UsuarioResponseDto> => {
    const { data } = await http.get<UsuarioResponseDto>(`/usuarios/${id}`);
    return data;
  };

  const create = async (payload: UsuarioCreateDto): Promise<UsuarioResponseDto> => {
    const { data } = await http.post<UsuarioResponseDto>('/usuarios', payload);
    return data;
  };

  const update = async (
    id: string,
    payload: UsuarioUpdateDto
  ): Promise<UsuarioResponseDto> => {
    const { data } = await http.patch<UsuarioResponseDto>(`/usuarios/${id}`, payload);
    return data;
  };

  const setStatus = async (
    id: string,
    ativo: boolean
  ): Promise<UsuarioResponseDto> => {
    const { data } = await http.patch<UsuarioResponseDto>(
      `/usuarios/${id}/status`,
      { ativo }
    );
    return data;
  };

  const getRoles = async (): Promise<string[]> => {
    const { data } = await http.get<string[]>('/usuarios/roles');
    return data;
  };

  return { getPaged, getById, create, update, setStatus, getRoles };
};
