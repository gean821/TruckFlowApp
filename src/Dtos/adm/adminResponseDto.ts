export default interface AdminResponseDto {
    id: string;
    email: string;
    username: string;
    role: string;
    telefone: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}