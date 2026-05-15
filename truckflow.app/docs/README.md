# TruckFlow Admin — Documentação (web)

Este diretório contém ADRs (Architecture Decision Records) do admin web (Vue 3 + Vite + Vuetify + TanStack Query).

## Estrutura

- [`adr/`](./adr/README.md) — Decisões arquiteturais numeradas, escopadas ao admin.

## Como ler

Comece pelo [índice de ADRs](./adr/README.md). Antes de qualquer mudança não-trivial, leia também o **ADR-0001 do backend** (`TruckFlow/docs/adr/0001-alvo-aurora.md`) que define o cliente alvo e dimensionamento.

## Repos relacionados

| Repo | Localização | Escopo |
|---|---|---|
| **Backend** (.NET) | `TruckFlow/docs/adr/` | Domínio, persistência, notificação server-side, tracking server-side, infra |
| **Mobile** (motorista) | `tf-mobile/truckflow-driver-app/docs/adr/` | Captura de localização, push, deep-links, UX motorista |
| **Admin** (este) | `TruckFlowApp/truckflow.app/docs/adr/` | Consumo de SSE, mapa, contato WhatsApp, UX admin |
