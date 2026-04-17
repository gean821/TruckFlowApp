export default interface JwtPayload {
  UserId: string;
  empresaId: string;
  role: string;
  email: string;
  unique_name: string;
  exp: number;
}