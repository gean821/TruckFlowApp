import { computed } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { RoleGroups, hasRole, type Role } from "@/shared/auth/roles";

export function usePermissions() {
  const auth = useAuthStore();

  const role = computed(() => auth.user?.role);

  const can = (allowed: readonly string[]) => hasRole(role.value, allowed);

  const isRole = (r: Role) => role.value === r;

  return {
    role,
    can,
    isRole,
    canManageGrade: computed(() => can(RoleGroups.CanManageGrade)),
    canCheckIn: computed(() => can(RoleGroups.CanCheckIn)),
    canViewSchedule: computed(() => can(RoleGroups.CanViewSchedule)),
    canManageUsers: computed(() => can(RoleGroups.CanManageUsers)),
    canManageMasterData: computed(() => can(RoleGroups.CanManageMasterData)),
    canViewAuditLogs: computed(() => can(RoleGroups.CanViewAuditLogs)),
  };
}
