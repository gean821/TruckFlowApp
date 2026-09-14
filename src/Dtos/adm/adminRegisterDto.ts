export default interface AdminRegisterDto {
    id?: string | null;
    email: string;
    password: string;
    username: string;
    nomeReal: string;
    telefone: string;
    createdAt?: string;
}