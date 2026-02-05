import { defineStore } from "pinia";
import { AuthService } from "@/services/AuthService";
import type AdminLoginDto from "@/Dtos/adm/adminLoginDto";
import router from "@/router";
import { jwtDecode } from "jwt-decode";
import type JwtPayload from "@/Entities/JwtPayload";

interface AuthState {
    user: JwtPayload | null;
    token: string | null;
    loading: boolean;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem("token"),
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role,
        userId: (state) => state.user?.UserId
    },

    actions: {
        setSession(token: string) {
            const decoded = jwtDecode<JwtPayload>(token);

            this.token = token;
            this.user = decoded;

            localStorage.setItem("token", token);
        },

        async login(dto: AdminLoginDto) {
            this.loading = true;

            try {
                const { token } = await AuthService.login(dto);

                this.setSession(token);
                router.push('/');
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;

            localStorage.removeItem("token");

            router.push("/login");
        },

        restoreSession() {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const decoded = jwtDecode<JwtPayload>(token);

                if (decoded.exp * 1000 < Date.now()) {
                    this.logout();
                    return;
                }

                this.token = token;
                this.user = decoded;

            } catch {
                this.logout();
            }

        }
    }
});
