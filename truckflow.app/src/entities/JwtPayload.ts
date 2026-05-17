export default interface JwtPayload {
  UserId: string;
  EmpresaId?: string;
  role: string;
  email: string;
  unique_name: string;
  exp: number;
}
