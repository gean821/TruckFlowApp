export const Roles = {
  Admin: "Admin",
  Motorista: "Motorista",
  Gerente: "Gerente",
  Monitor: "Monitor",
  Portaria: "Portaria",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const RoleGroups = {
  // Programação operacional: criar/editar grades, agendamentos avulsos, gerenciar fluxo
  CanManageGrade: [Roles.Admin, Roles.Gerente, Roles.Monitor] as Role[],

  // Operação de portaria: check-in/check-out
  CanCheckIn: [Roles.Admin, Roles.Gerente, Roles.Monitor, Roles.Portaria] as Role[],

  // Visualização de grades e agendamentos (read-only inclusive)
  CanViewSchedule: [Roles.Admin, Roles.Gerente, Roles.Monitor, Roles.Portaria] as Role[],

  // Gerenciamento de usuários e roles
  CanManageUsers: [Roles.Admin, Roles.Gerente] as Role[],

  // Cadastros de domínio (fornecedor, produto, doca, unidade, empresa)
  CanManageMasterData: [Roles.Admin, Roles.Gerente] as Role[],

  // Auditoria (ler logs)
  CanViewAuditLogs: [Roles.Admin, Roles.Gerente] as Role[],
} as const;

export type RoleGroupKey = keyof typeof RoleGroups;

export function hasRole(
  userRole: string | undefined | null,
  allowed: readonly string[]): boolean {

  if (!userRole) {
    return false;
  }

  return allowed.includes(userRole);
}
