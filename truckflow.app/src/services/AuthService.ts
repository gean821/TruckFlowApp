import type AdminLoginDto from "@/Dtos/adm/adminLoginDto";
import type AdminRegisterDto from "@/Dtos/adm/adminRegisterDto";
import type AdminResponseDto from "@/Dtos/adm/adminResponseDto";
import type AdminUpdateDto from "@/Dtos/adm/adminUpdateDto";
import type LoginAdminResponseDto from "@/Dtos/adm/LoginAdminResponseDto";
import http from "@/http/http";

export class AuthService {
    static async register(dto: AdminRegisterDto): Promise<AdminResponseDto> {
        const admin = await http.post('/AuthAdmin/register', dto);
        return admin.data;
    }

    static async login(dto: AdminLoginDto): Promise<LoginAdminResponseDto> {
        const { data } = await http.post('/AuthAdmin/login', dto);
        localStorage.setItem("token", data.token);
        return data;
    }

    static async update(id: string, dto: AdminUpdateDto): Promise<AdminResponseDto> {
        const adminAtualizado = await http.put(`/AuthAdmin/update/${id}`, dto);
        return adminAtualizado.data;
    }

    static async delete(id: string): Promise<void> {
        await http.delete(`/delete/${id}`);
    }
}