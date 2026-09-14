# ADR-0001 — Notificações in-app via SSE

- **Status**: Aceito
- **Data**: 2026-05-14

## Contexto

Backend ADR-0002 (`TruckFlow/docs/adr/0002-design-notificacoes.md`) define SSE como canal real-time pro admin, com fan-out via Postgres `LISTEN/NOTIFY`. Admin precisa de:

1. Badge de notificações não lidas no topbar.
2. Painel lateral com lista das últimas notificações.
3. Snackbar imediato em eventos críticos (cancelamento pelo motorista, atraso informado).
4. Marcação como lida.
5. Som opcional pra Prioridade `Critica`.

Stack atual:
- Vue 3.5 + Vite 7 + Vuetify 3.10 + TanStack Query 5.9
- Axios em `src/http/http.ts` com interceptor de Bearer token
- Padrão services → queries → hooks ([[feedback-padrao-vue-query]] na memória do agente)

## Decisão

### Conexão SSE

**Composable `useNotificacoesStream()`** em `src/composables/useNotificacoesStream.ts`:

- `EventSource` nativo do browser conectado a `GET ${VITE_API_URL}/notifications/stream`.
- Autenticação: JWT em query string (`?token=...`) **OU** cookie httpOnly se [pré-requisito 11 do backend](../../../TruckFlow/docs/adr/0004-prerequisitos-rollout-aurora.md) já implementado. Decisão final: usar cookie httpOnly como padrão **assim que refresh token for entregue**; até lá, query string com token de acesso de vida curta.
- Reconexão automática (built-in do `EventSource`).
- Heartbeat do servidor a cada 25s — ignorado pelo cliente (só keepalive).
- Eventos:
  - `notificacao:nova` → recebe `notificacaoId`; chama `queryClient.invalidateQueries(['notificacoes'])`.
  - `notificacao:atualizada` → mesma invalidação (caso outro admin marque como lida).

**Lifecycle**: composable montado uma vez no `App.vue` ou no layout autenticado, **não** por rota. Conexão única persistente.

### Queries

`src/queries/notificacao.queries.ts`:
- `useNotificacoesQuery({ apenasNaoLidas?, page? })` → `GET /v1/notifications`
- `useNotificacoesNaoLidasCountQuery()` → `GET /v1/notifications/count?lida=false` (separado pra cache barato do badge)

`src/hooks/useNotificacoes.ts`:
- `useMarcarComoLidaMutation(id)` → `PATCH /v1/notifications/{id}/lida`
- `useMarcarTodasComoLidasMutation()` → `PATCH /v1/notifications/marcar-todas-lidas`

### Componentes

**`<NotificacoesBadge />`** no topbar:
- Ícone sino com badge numérico do `useNotificacoesNaoLidasCountQuery()`.
- Clique abre `<NotificacoesPanel />` em `<v-navigation-drawer>` lateral.

**`<NotificacoesPanel />`**:
- Lista paginada das notificações (mais recentes primeiro).
- Cada item: ícone por `Tipo`, título, corpo, timestamp relativo, indicador "não lida" (bolinha azul).
- Clique no item: marca como lida + navega via `router.push()` baseado em `Payload.agendamentoId` (mapa de roteamento centralizado em `src/services/NotificacaoRouter.ts`).
- Botão "Marcar todas como lidas" no topo.

**`<NotificacaoSnackbar />`** (Vuetify v-snackbar global):
- Aparece em evento SSE `notificacao:nova` se Prioridade ≥ `Alta`.
- Auto-dismiss 6s, com botão "Ver" que abre o painel.
- Som curto (`new Audio('/notif.mp3').play()`) se Prioridade = `Critica` e tab está oculta — `document.hidden` para detectar.

### Estilo / cores por tipo

Mapeamento em `src/services/NotificacaoStyle.ts`:
- `AgendamentoCancelado` (admin recebe quando motorista cancela) → vermelho, ícone `mdi-close-octagon`.
- `MotoristaAtrasoInformado` → laranja, ícone `mdi-clock-alert`.
- `AgendamentoConfirmado` → verde, ícone `mdi-check-circle`.
- (extensível conforme tipos novos do backend)

## Consequências

**Positivas**:
- Real-time real: latência <1s entre evento e admin ver.
- `EventSource` nativo, sem dependência nova.
- Reconexão automática gratuita.
- Single conexão por aba do navegador (não polling distribuído).
- Padrão services→queries→hooks da memória consistente com o resto do front.

**Negativas**:
- Conexão SSE consome 1 slot HTTP por admin online (nginx/Traefik precisa de keepalive longo e `worker_connections` ajustado).
- 80 admins simultâneos = 80 conexões persistentes — trivial mas precisa estar no dimensionamento da API.
- Som depende de motorista do browser; alguns bloqueiam autoplay até interação.

## Alternativas consideradas

**A1. Polling de 20s no `useNotificacoesQuery`.**
Rejeitada. Latência percebida ruim e desperdício de requests com 80 admins.

**A2. WebSocket via SignalR.**
Rejeitada. Bidirecional desnecessário, configuração mais complexa, SSE atende.

**A3. Service Worker + Push API (web push) em vez de SSE.**
Rejeitada para MVP. Web Push exige VAPID keys, registro do service worker, e permissão do navegador — mais complexo que SSE pra mesma feature de admin sentado em frente ao computador. Reavaliar se admins quiserem notificação fora da aba/janela.

## Referências

- Backend ADR-0002: `TruckFlow/docs/adr/0002-design-notificacoes.md`
- Mobile ADR-0004: canal motorista→admin que gera essas notificações via SSE.
