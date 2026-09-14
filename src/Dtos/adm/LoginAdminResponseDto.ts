import type AdminResponseDto from "./adminResponseDto";

export default interface LoginAdminResponseDto {
    token: string;
    tokenExpiresAt: string;
    usuario: AdminResponseDto;
}