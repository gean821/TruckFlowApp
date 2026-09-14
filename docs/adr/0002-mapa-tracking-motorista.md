# ADR-0002 — Tela de mapa: tracking de motoristas em tempo real

- **Status**: Aceito
- **Data**: 2026-05-14

## Contexto

Backend ADR-0003 (`TruckFlow/docs/adr/0003-design-tracking-motorista.md`) define endpoints e stream SSE de posições. Admin precisa de:

1. Visão única ("mapa da fábrica") com todos os motoristas a caminho.
2. Drill-down na posição de um motorista específico a partir do detalhe do agendamento.
3. Atualização em tempo real (markers se movem).
4. Filtros: status do agendamento, motorista específico.

Stack atual: Vue 3.5 + Vuetify 3.10. **Sem lib de mapas instalada hoje.**

## Decisão

### Lib

**`vue3-google-map`** (wrapper Vue 3 idiomático para Google Maps JavaScript API).

Razões:
- API key Maps já vai existir pra outras funcionalidades futuras (geocoding de novas unidades).
- Free tier US$200/mês do Maps JS cobre o uso esperado em 21 fábricas.
- Wrapper Vue 3 mais ergonômico que `@googlemaps/js-api-loader` direto.

### Configuração

`.env`:
```
VITE_API_URL=...
VITE_GOOGLE_MAPS_API_KEY=...
```

**Restrições da API key no GCP** (não negociáveis):
- Application restriction: HTTP referrers (sites apenas) — adicionar domínios de prod/staging.
- API restriction: apenas "Maps JavaScript API" e "Places API" se necessário. **Não habilitar Distance Matrix** server-side (ver ADR-0003 backend).
- Billing alert configurado no projeto GCP.

Em prod, a chave injetada via vault no build do Vite, não em `.env` versionado.

### Telas

**Tela `/mapa` (rota nova)**:
- Mapa Google ocupando 100% da viewport (descontando topbar e sidebar).
- Markers customizados por status do agendamento associado ao motorista:
  - `Agendado` (motorista a caminho) → marker azul.
  - `EmAndamento` (motorista chegou e está na operação) → marker verde (raramente em movimento; geofencing já parou a captura).
  - `Atrasado` (computed: motorista a >10min do horário sem `EmAndamento`) → marker laranja.
- Clique no marker → InfoWindow com: nome motorista, placa, agendamento (link), última atualização relativa.
- Filtros laterais: por status, por unidade de descarga, por janela de chegada esperada.
- Botão "Centralizar na fábrica" usa `Empresa.Latitude/Longitude` (do contexto do usuário).

**Painel embutido em `VisualizarAgendamentoView.vue`**:
- Quando admin abre detalhes de um agendamento individual, painel/aba "Localização do motorista" mostra:
  - Mapa pequeno (300px altura) centrado entre motorista e unidade de descarga.
  - Polyline do trajeto recente (últimos 30 min via `GET /agendamentos/{id}/localizacao/historico`).
  - Marker do motorista (atualizado via SSE).
  - Marker da `UnidadeEntrega`.
  - ETA estimado calculado **cliente-side** via Maps DirectionsService (free tier).

### Stream de posições

Composable `useTrackingStream(empresaId)`:
- `EventSource` em `GET /v1/empresas/{empresaId}/motoristas/localizacoes/stream`.
- Mesma estratégia de auth do [ADR-0001](./0001-notificacoes-in-app.md) (cookie httpOnly ou query string token).
- Eventos: `posicao:atualizada` → `{ motoristaId, lat, lng, capturadoEm }`.
- Update incremental no estado de markers (reactive Map por `motoristaId`).
- Backend já throttle 1×/5s por motorista — front não precisa throttle adicional.

### Queries

`src/queries/tracking.queries.ts`:
- `useMotoristasLocalizacoesQuery(empresaId)` → `GET /v1/empresas/{empresaId}/motoristas/localizacoes` — snapshot inicial usado pra popular mapa antes do primeiro evento SSE.
- `useTrajetoMotoristaQuery(agendamentoId, desde)` → `GET /v1/agendamentos/{id}/localizacao/historico` — só na tela de detalhe.

### Performance

- **Clustering** com `@googlemaps/markerclusterer` quando >20 markers visíveis simultaneamente — relevante na visão geral de fábrica em horário de pico.
- **Lazy load da rota `/mapa`**: importação dinâmica em `src/router/index.ts` (o router é eager hoje conforme memória do agente; pelo menos esta rota fica lazy por causa do tamanho da lib Google Maps).

## Consequências

**Positivas**:
- Admin tem visão imediata da operação ao vivo.
- ETA cliente-side evita custo proibitivo de Distance Matrix server-side.
- Implementação encaixa no padrão services→queries→hooks existente.
- Free tier Google Maps cobre uso esperado com folga.

**Negativas**:
- Adiciona ~150KB ao bundle (Maps JS API). Lazy load mitiga, mas tela `/mapa` tem first-load mais lento.
- Dependência de cartão de crédito no GCP — vai precisar ser na conta da Aurora ou intermediado.
- 80 admins online com mapa aberto = 80 conexões SSE de tracking + N requests do Maps tile.

## Alternativas consideradas

**A1. Leaflet + OpenStreetMap (free, sem cartão).**
Rejeitada para MVP Aurora. Qualidade visual e UX inferior ao Google Maps em contexto brasileiro (estradas rurais, traffic data). Reavaliar se custo Maps virar problema (improvável no free tier).

**A2. Mapbox.**
Rejeitada. Custo similar ao Google Maps no nosso volume, e Aurora já tem ecossistema Google (Workspace). Menos fricção de billing.

**A3. Polling em vez de SSE pro tracking.**
Rejeitada. Polling de 5s × 400 motoristas × 80 admins = 6.400 req/min só pra atualizar mapa. SSE entrega o mesmo com 80 conexões persistentes.

**A4. Heatmap em vez de markers individuais.**
Rejeitada como visão padrão. Heatmap perde a informação de "qual motorista" e "qual ETA". Pode ser **toggle adicional** no mapa para visão histórica/agregada de trânsito, mas não substitui markers.

## Referências

- Backend ADR-0003: `TruckFlow/docs/adr/0003-design-tracking-motorista.md`
- [ADR-0001](./0001-notificacoes-in-app.md) — mesmo padrão SSE
- vue3-google-map: https://vue3-google-map.com/
