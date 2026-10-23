# TruckFlowApp — Frontend Web (Admin)

Painel admin web do TruckFlowApp. Cliente-alvo: **Aurora Alimentos**. Usuários: Admin, Gerente, Monitor, Portaria.

## Stack

- **Vue 3.5** (Composition API, `<script setup>`) + **TypeScript 5.8**
- **Vite 7** — gerenciador de pacotes **pnpm**
- **Pinia 3** (estado de UI / sessão — NUNCA HTTP)
- **TanStack Vue Query 5.92** (estado de servidor / cache HTTP — padrão para módulos novos)
- **Axios 1.20** (HTTP client)
- **Vuetify 3.10** (UI components) + `@mdi/font` (ícones)
- **Vue Router 4** (com lazy loading já configurado)
- `@microsoft/fetch-event-source` (SSE), ApexCharts, date-fns, jwt-decode
- Vitest / @vue/test-utils / Playwright instalados — **ainda sem testes**

## Padrão arquitetural (importante)

- **vue-query + hooks** para qualquer chamada HTTP. Ver `src/hooks/*` e `src/queries/*`.
- **Pinia** somente para estado de UI/sessão (`AuthStore`, `ToastStore`, `ComunicacaoDialogStore`). Nunca pra dados de servidor.
- Componentes consomem hooks (`useUsuario()`, `useProdutos()`...), não chamam axios nem services direto.
- Cadeia por entidade: `entities/<x>.types.ts` → `services/<X>Service.ts` → `queries/<x>.queries.ts` → `hooks/use<X>.ts` → `components/Forms/<X>FormModal.vue` → `views/<X>View.vue`. Referência: a cadeia de **Usuario** (`ManageUserView.vue`).

## Estrutura

```
src/
├── views/         # Páginas (LoginView, Dashboard, etc)
├── components/    # Componentes reutilizáveis (Forms/, modals/, dashboard/, notifications/, audit/, common/)
├── stores/        # Pinia (AuthStore, ToastStore, ComunicacaoDialogStore) — UI/sessão apenas
├── hooks/         # useUsuario, useProdutos... (mutations vue-query) + usePermissions
├── queries/       # *.queries.ts — definições de queryKey + fetcher
├── services/      # <X>Service.ts — factory com chamadas axios puras
├── composables/   # useRealtimeNotifications (SSE)
├── http/          # http.ts — instância axios + interceptors
├── router/        # index.ts (beforeEach), routeMeta.ts
├── shared/auth/   # roles.ts (Roles, RoleGroups, hasRole)
├── entities/      # Tipos (<x>.types.ts para código novo) + paginatedResponse.ts, JwtPayload.ts
├── Dtos/          # DTOs legados espelhando backend
├── enums/         # StatusAgendamento, TipoCarga, TipoVeiculo...
└── utils/         # date-format, resolveEmpresaId, audit...
```

## Autenticação atual

- Login UI: `src/views/LoginView.vue`
- Serviço: `src/services/AuthService.ts` → `POST /AuthAdmin/login`
- SSO Entra ID: botão redireciona para `${VITE_API_URL}AuthAdmin/entra/login`; backend volta em `/login?ssoOk=1` (ou `?ssoErro=<código>`) e o front chama `restoreSession()`
- Access token: **só em memória** (Pinia `AuthStore`). Refresh token: cookie **httpOnly** `tf_refresh` emitido pelo backend
- Bootstrap: `main.ts` aguarda `authStore.restoreSession()` (`POST /Auth/refresh`) antes de montar o router
- Axios interceptor: `src/http/http.ts` — `withCredentials: true`, anexa `Authorization: Bearer ${token}`; no 401 faz **refresh single-flight** e repete a request; se o refresh falhar, limpa a sessão e vai para `/login`
- Router guard: `src/router/index.ts` — `beforeEach` checa `meta.requiresAuth` + `meta.roles` via `hasRole()`
- Permissões em componente: `src/hooks/usePermissions.ts`
- Logout: `AuthStore.logout()` (`POST /Auth/logout`)

## Variáveis de ambiente

`.env` (git-ignored):
```
VITE_API_URL=http://localhost:8080/v1/
```

A barra final é obrigatória (a URL do SSE é concatenada). Ainda não existe `.env.example` — crie ao adicionar a próxima variável e mantenha sincronizado.

## Backend

API .NET em `C:\ESTUDO\TruckFlow`. Endpoints versionados sob `/v1/`. Multi-tenant via claim `EmpresaId` no JWT. Erros vêm no envelope `{ success: false, code, message }` (ou `errors[]` em `VALIDATION_ERROR`).

## Convenções

- `<script setup lang="ts">` em todos os componentes; `defineProps`/`defineEmits` tipados.
- Tipos novos em `src/entities/<x>.types.ts` espelhando os DTOs do backend (camelCase).
- queryKey segue padrão `['recurso', filtros]` (ver `src/queries/`); refs reativas direto na key, `enabled` como getter, `keepPreviousData` em listas paginadas.
- Mutations invalidam queryKeys relevantes (lista **e** detalhe) via `queryClient.invalidateQueries`.
- Listagens paginadas server-side com filtros em `route.query` e search com debounce.
- `Content-Type` já é global no `http.ts` — não passar header manual.
- Toast: `toast.notify(msg, tipo, duracaoEmMs)`.
- Não criar `*.md` (docs) sem pedido explícito.
- Agentes e skills do projeto ficam no repo da API: `C:\ESTUDO\TruckFlow\.claude\` (`vue-specialist`, `frontend-developer`, skills `vue-best-practices`, `senior-frontend`...). Para valerem aqui, rodar uma vez `.claude\setup-agents.ps1` do repo da API (junções em `~/.claude`).

## Manter este arquivo vivo

Quando algo descrito aqui for implementado, mudado ou deixar de ser verdade, **atualize este CLAUDE.md na mesma entrega**.

## Comandos

```bash
pnpm dev          # Vite dev server (porta 5173)
pnpm run build    # type-check (vue-tsc --build) + build produção — é o que o CI roda
pnpm preview      # preview do build
```
