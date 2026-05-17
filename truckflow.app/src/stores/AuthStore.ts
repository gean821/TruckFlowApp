import { defineStore } from "pinia";
import { AuthService } from "@/services/AuthService";
import type AdminLoginDto from "@/Dtos/adm/adminLoginDto";
import type RefreshResponseDto from "@/Dtos/auth/RefreshResponseDto";
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import type JwtPayload from "@/entities/JwtPayload";
import http from "@/http/http";

interface AuthState {
    user: JwtPayload | null;
    token: string | null;
    tokenExpiresAt: string | null;
    loading: boolean;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: null,
        tokenExpiresAt: null,
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role,
        userId: (state) => state.user?.UserId,
        empresaId: (state) => state.user?.EmpresaId
    },

    actions: {
        setSession(token: string, tokenExpiresAt?: string) {
            const decoded = jwtDecode<JwtPayload>(token);

            this.token = token;
            this.user = decoded;
            this.tokenExpiresAt = tokenExpiresAt ?? null;
        },

        clearSession() {
            this.user = null;
            this.token = null;
            this.tokenExpiresAt = null;
        },

        async restoreSession() {
            try {
                const { data } = await http.post<RefreshResponseDto>("/Auth/refresh");
                this.setSession(data.token, data.tokenExpiresAt);
            } catch {
                this.clearSession();
            }
        },

        async login(dto: AdminLoginDto) {
            this.loading = true;

            try {
                const response = await AuthService.login(dto);

                this.setSession(response.token, response.tokenExpiresAt);
                router.push('/');
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await http.post("/Auth/logout");
            } catch { }
            this.clearSession();
            router.push("/login");
        },

        updateUser(data: Partial<JwtPayload>) {
            if (!this.user) {
                return;
            }

            this.user = { ...this.user, ...data };
        }
    }
});
