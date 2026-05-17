# TruckFlowApp — Frontend Web (Admin)

Painel admin web do TruckFlowApp. Cliente-alvo: **Aurora Alimentos**.

## Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript 5.8**
- **Vite 7**
- **Pinia 3** (estado de UI / sessão — NUNCA HTTP)
- **TanStack Vue Query 5.92** (estado de servidor / cache HTTP — padrão para módulos novos)
- **Axios 1.12** (HTTP client)
- **Vuetify 3.10** (UI components)
- **Vue Router 4** (com lazy loading já configurado)

## Padrão arquitetural (importante)

- **vue-query + hooks** para qualquer chamada HTTP. Ver `src/hooks/*` e `src/queries/*`.
- **Pinia** somente para estado de UI/sessão (auth, toast). Nunca pra dados de servidor.
- Componentes consomem hooks (`useUsuario()`, `useProdutos()`...), não chamam axios direto.

## Estrutura

```
src/
├── views/         # Páginas (LoginView, Dashboard, etc)
├── components/    # Componentes reutilizáveis
├── stores/        # Pinia (AuthStore, ToastStore) — UI/sessão apenas
├── hooks/         # useUsuario, useProdutos... (vue-query)
├── queries/       # *.queries.ts — definições de queryKey + fetcher
├── services/      # AuthService (chamadas axios puras quando necessário)
├── http/          # http.ts — instância axios + interceptors
├── router/        # index.ts (beforeEach), routeMeta.ts
├── shared/auth/   # roles.ts (hasRole, etc)
├── Dtos/          # DTOs espelhando backend
└── entities/      # Types
```

## Autenticação atual

- Login UI: `src/views/LoginView.vue`
- Serviço: `src/services/AuthService.ts` → `POST /AuthAdmin/login`
- Token: **localStorage** hoje (vulnerável a XSS — em migração para httpOnly cookie)
- Axios interceptor: `src/http/http.ts` — anexa `Authorization: Bearer ${token}`, no 401 limpa e redireciona `/login`
- Router guard: `src/router/index.ts` — `beforeEach` checa `meta.requiresAuth` + `meta.roles` via `hasRole()`
- Logout: `AuthStore.logout()`

**Em implementação (refresh token rotation):** httpOnly cookie pro refresh, access em memória, interceptor com retry no 401, `withCredentials: true`.

## Variáveis de ambiente

`.env`:
```
VITE_API_URL=http://localhost:8080/v1/
```

Tem `.env.example` (manter sincronizado quando adicionar vars).

## Backend

API .NET em `C:\ESTUDO\TruckFlow`. Endpoints versionados sob `/v1/`. Multi-tenant via claim `EmpresaId` no JWT.

## Convenções

- `<script setup lang="ts">` em todos os componentes.
- Tipos compartilhados em `src/Dtos/` espelham DTOs do backend.
- queryKey segue padrão `['recurso', filtros]` (ver `src/queries/`).
- Mutations invalidam queryKeys relevantes via `queryClient.invalidateQueries`.
- Não criar `*.md` (docs) sem pedido explícito.

## Comandos

```bash
npm run dev      # Vite dev server (porta 5173)
npm run build    # build produção
npm run preview  # preview do build
```
