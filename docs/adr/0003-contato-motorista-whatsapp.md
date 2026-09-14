# ADR-0003 — Contato com motorista via deep-link WhatsApp

- **Status**: Aceito
- **Data**: 2026-05-14

## Contexto

Backend ADR-0002 (`TruckFlow/docs/adr/0002-design-notificacoes.md`) decide que WhatsApp **não** entra no dispatcher automático — fica como **ação manual** do admin via deep-link `wa.me`. Esta decisão se origina em:

- Aurora tem operação informal via WhatsApp já hoje; admins se relacionam com motoristas frequentes.
- Aprovação Meta de templates atrasaria entrega em 2-3 semanas calendário.
- Custo recorrente WhatsApp Cloud API (R$700-1.200/mês) não compensa em troca de auditoria de mensagem.

`Motorista.Telefone` já existe no domínio.

**Pendência aberta no ADR backend**: confirmar com Aurora que aceitam zero auditoria de comunicação WhatsApp. Este ADR assume aceitação.

## Decisão

### Componente reutilizável

`<ContatoMotoristaButton>` em `src/components/buttons/`:

Props:
- `telefone: string | null`
- `nomeMotorista: string`
- `template?: TipoMensagem` (opcional; padrão: mensagem genérica)
- `contexto?: Record<string, string>` (placeholders pro template)

Render:
- Botão Vuetify com ícone WhatsApp (`mdi-whatsapp`) e label "Falar com motorista".
- **Hidden** se `telefone == null || telefone.trim() === ''`.
- Tooltip: "Abre o WhatsApp Web ou app".

Clique:
- Sanitiza telefone (`/\D/g` → só dígitos), prepende DDI 55 se ainda não tem.
- Renderiza template com placeholders.
- `window.open(\`https://wa.me/${numeroSanitizado}?text=${encodeURIComponent(mensagem)}\`, '_blank')`.

### Templates de mensagem

Constantes em `src/constants/whatsappTemplates.ts`:

```ts
export const WHATSAPP_TEMPLATES = {
  cancelamento: (ctx) =>
    `Olá ${ctx.nome}, seu agendamento de ${ctx.data} ${ctx.hora} na unidade ` +
    `${ctx.unidade} foi cancelado. Motivo: ${ctx.motivo}. ` +
    `Para reagendar, acesse o app TruckFlow.`,

  reagendamento: (ctx) =>
    `Olá ${ctx.nome}, seu agendamento foi alterado para ${ctx.novaData} ${ctx.novaHora}. ` +
    `Confirme no app TruckFlow.`,

  lembreteJanelaProxima: (ctx) =>
    `Olá ${ctx.nome}, sua janela de chegada na ${ctx.unidade} ` +
    `termina em ${ctx.minutosRestantes} minutos. Tudo bem com a chegada?`,

  generico: (ctx) =>
    `Olá ${ctx.nome}, tudo bem? Aqui é da equipe ${ctx.fabrica}.`,
};
```

Tipo `TipoMensagem = keyof typeof WHATSAPP_TEMPLATES`.

### Onde aparece o botão

1. **Snackbar/toast pós-ação destrutiva**: quando admin cancela ou reagenda agendamento, o toast de sucesso inclui o botão (com template apropriado). Admin clica e o WhatsApp abre com mensagem pré-preenchida.
2. **Card/detalhe do agendamento**: botão sempre visível ao lado do nome do motorista (template `generico`).
3. **Detalhe do motorista** (futuro): mesma posição.

### Sanitização do telefone

Função `sanitizarTelefoneBR(t: string): string | null` em `src/utils/phone.ts`:
- Remove tudo exceto dígitos.
- Se começa com `0`, remove (DDD com 0 antigo).
- Se tem 10 ou 11 dígitos, prepende `55`.
- Se tem 12 ou 13 e começa com `55`, mantém.
- Caso contrário, retorna `null` (telefone inválido, botão fica escondido).

Validação no front, **e também no backend** ao salvar/editar telefone do motorista — não confiar em só um lado.

### Decisão sobre canal automático vs manual

**Não** mostrar checkbox "Também avisar por WhatsApp" no modal de cancelamento. Admin avisa manualmente clicando no botão depois, ou não avisa — é uma escolha consciente, não uma opção marcada por padrão.

**Por quê**: opção marcada por padrão vira hábito mecânico que perde sentido (admin clica sem revisar mensagem, ou esquece). Botão explícito após a ação fica óbvio e revisável.

## Consequências

**Positivas**:
- Implementação trivial (~meio dia incluindo testes).
- Zero custo recorrente.
- Zero burocracia Meta.
- Admin pode revisar/personalizar a mensagem antes de enviar.
- Template centralizado garante consistência de redação entre 80 admins.
- Aproveita relacionamento WhatsApp informal que admins já têm.

**Negativas**:
- Sem rastro de "foi enviado" — auditoria depende de push + in-app oficiais.
- Número pessoal do admin fica exposto ao motorista. Mitigação: cada fábrica usa **WhatsApp Business App** em chip corporativo (free, multi-device).
- Eventos automáticos noturnos (expiração, lembrete) não disparam WhatsApp — só push e in-app.
- Admin pode esquecer de clicar pós-cancelamento. Toast de sucesso ajuda mas não obriga.

## Alternativas consideradas

**A1. WhatsApp Cloud API integrada (botão dispara mensagem direto, sem abrir wa.me).**
Rejeitada pelas razões do ADR backend (custo, prazo Meta, complexidade). Mantida como plano B se compliance Aurora exigir log.

**A2. Sem botão de WhatsApp, comunicação só pelo sistema (push + in-app + canal motorista→admin).**
Rejeitada. Quebra workflow informal que Aurora já tem. Admins iriam usar WhatsApp pessoal fora do sistema mesmo assim — melhor canalizar via botão com template.

**A3. Telefone clicável para discagem em vez de WhatsApp.**
Rejeitada como única opção. Pode coexistir (botão "Ligar" + botão "WhatsApp"). MVP é só WhatsApp; ligar adicionar se feedback pedir.

## Referências

- Backend ADR-0002: `TruckFlow/docs/adr/0002-design-notificacoes.md` (seção "WhatsApp — deep-link `wa.me`")
- Mobile ADR-0004: canal oposto (motorista → admin)
- WhatsApp click-to-chat API: https://faq.whatsapp.com/5913398998672934
