export type UsuarioStatusFiltro = 'all' | 'active' | 'inactive';

export type UsuarioResponseDto = {
  id: string;
  email: string;
  username: string;
  nomeReal?: string | null;
  role: string;
  photoUrl?: string | null;
  empresa?: string | null;
  empresaId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type UsuarioListQueryDto = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: UsuarioStatusFiltro | null;
};

export type UsuarioCreateDto = {
  email: string;
  password: string;
  username: string;
  nomeReal: string;
  telefone: string;
  role: string;
  photoUrl?: string;
};

export type UsuarioUpdateDto = {
  email?: string;
  password?: string;
  username?: string;
  telefone?: string;
  photoUrl?: string;
};
