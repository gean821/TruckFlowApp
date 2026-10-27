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
- **Relatórios/BI: Apache ECharts via `vue-echarts`** (mesma lib do app do motorista, decisão da TRUCK-303/304). Registro de módulos e tema `truckflow` em `src/components/relatorios/charts/echarts.ts` (renderer Canvas, para exportar PNG); gráficos novos usam `ChartCard`/`KpiCard` e montam a `option` em funções puras em `charts/*Options.ts`. ApexCharts segue só onde já existia (dashboard/grade) — não usar em tela nova.
- Dashboard (`/dashboard`) = "o dia de hoje" ao vivo: consome `GET /v1/Dashboard/hoje` (refetch a cada 30s) e reaproveita `KpiCard`/`ChartCard`; componentes em `components/dashboard/` (`DocasAgora`, `PatioAgora`, `ListaCaminhoes`, `AtalhosRelatorios`). Análise histórica fica em `/relatorios`, não no dashboard.
- Área `/relatorios` = rota pai com abas (`views/relatorios/RelatoriosView.vue`); cada relatório é uma rota filha e um subitem do grupo "Relatórios" no menu (`relatoriosMenu` no `Navbar.vue`). Filtros globais via `useFiltrosRelatorio` (estado na query string, botão Aplicar; `FiltrosRelatorio sem-fornecedor` esconde o fornecedor onde ele não se aplica, como em Capacidade das docas) e drill-down via `DrillDownDialog` (aceita unidade, produto, fornecedor e doca). A aba Agendamentos (`/relatorios/agendamentos`, `AgendamentosDetalhadoView`) é a tabela detalhada server-side (`GET /v1/Relatorio/agendamentos/detalhado` + `/resumo`): filtros extras (busca, status, origem, chegada) e ordenação na query string, colunas visíveis e "por página" em `localStorage`, detalhe em modal (`AgendamentoDetalheDialog`) e exportação Excel/CSV/PDF com os mesmos filtros (`RelatorioService.paramsRelatorio` repete `status=` por item, como o ASP.NET espera); `/relatorios/exportar` redireciona para ela. A aba Produtividade (`ProdutividadeView`, opções em `charts/produtividadeOptions.ts`) tem o Gantt do pátio feito com série `custom` do ECharts (`ganttOption`/`distribuirFaixas`: caminhões sobrepostos na mesma doca ganham faixas separadas) e boxplot por doca/produto/unidade/fornecedor; `BoxplotChart` e `CustomChart` estão registrados em `echarts.ts`. Limite de espera, dia do pátio, métrica e agrupamento ficam na query string; clique no Gantt ou na tabela abre o detalhado de agendamentos já filtrado. Links do menu sempre com caminho absoluto (`/produtos`), por causa das rotas aninhadas.
- Vitest (jsdom, config no `vite.config.ts`) + @vue/test-utils — testes em `src/**/__tests__/*.spec.ts` (fora do type-check do build). Playwright instalado, sem testes e2e ainda

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
├── composables/   # useRealtimeNotifications (SSE), useIdleLogout (logout por inatividade)
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
- Logout: `AuthStore.logout(motivo?)` (`POST /Auth/logout`) → `/login?motivo=<motivo>`; `encerrarSessaoLocal()` limpa a sessão sem chamar a API
- Inatividade (SAD 30): `src/composables/useIdleLogout.ts` (chamado no `App.vue`) — após `VITE_IDLE_TIMEOUT_MIN` (padrão 20) sem interação, aviso 60s antes (`IdleWarningDialog.vue`) e `logout('inatividade')`. Último acesso em `localStorage` (`tf_last_activity`, compartilhado entre abas, throttle de 5s) e logout propagado via `BroadcastChannel('tf-auth')`. Expiração é só client-side (backend não valida inatividade)

## Variáveis de ambiente

`.env` (git-ignored) — modelo em `.env.example` (commitado; mantenha sincronizado):
```
VITE_API_URL=http://localhost:8080/v1/
VITE_IDLE_TIMEOUT_MIN=20
```

- `VITE_API_URL`: a barra final é obrigatória (a URL do SSE é concatenada).
- `VITE_IDLE_TIMEOUT_MIN`: opcional, padrão 20. Valor baixo pra teste manual vai em `.env.development.local` (só o `pnpm dev` lê), nunca no `.env` — o `vite build` lê o `.env` e embute o valor no bundle.

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
pnpm test:unit    # Vitest em watch (uma vez só: pnpm exec vitest run)
```
