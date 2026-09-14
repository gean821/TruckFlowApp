<template>
  <v-row>
    <v-col
      v-for="action in visibleActions"
      :key="action.title"
      cols="12"
      sm="6"
      md="6"
      lg="3"
    >
      <v-card
        elevation="0"
        class="rounded-xl pa-4 cursor-pointer action-card h-100"
        @click="router.push(action.route)"
      >
        <div class="d-flex align-center">
          <v-avatar
            :style="{ background: action.color + '18' }"
            rounded="lg"
            size="52"
            class="mr-4 flex-shrink-0"
          >
            <v-icon :color="action.color" size="28">{{ action.icon }}</v-icon>
          </v-avatar>

          <div style="min-width: 0; flex: 1">
            <div
              class="text-subtitle-1 font-weight-bold text-grey-darken-3 text-truncate"
            >
              {{ action.title }}
            </div>
            <div class="text-caption text-grey-darken-1 text-truncate">
              {{ action.description }}
            </div>
          </div>

          <v-icon
            icon="mdi-chevron-right"
            class="flex-shrink-0 ml-2 chevron-icon"
          />
        </div>

        <div
          class="action-glow"
          :style="{
            background: `radial-gradient(ellipse at bottom right, ${action.color}18 0%, transparent 70%)`,
          }"
        ></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePermissions } from "@/hooks/usePermissions";
import { RoleGroups, type Role } from "@/shared/auth/roles";

const router = useRouter();
const { can } = usePermissions();

type QuickAction = {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  roles: readonly Role[];
};

const actions: QuickAction[] = [
  {
    title: "Agendamentos",
    description: "Visualize os agendamentos",
    icon: "mdi-calendar",
    route: "/visualizar",
    color: "#195FA0",
    roles: RoleGroups.CanViewSchedule,
  },
  {
    title: "Nova Grade",
    description: "Criar novo agendamento de grade",
    icon: "mdi-calendar-plus",
    route: "/nova-grade",
    color: "#195FA0",
    roles: RoleGroups.CanManageGrade,
  },
  {
    title: "Gerenciar Usuários",
    description: "Visualizar e editar usuários",
    icon: "mdi-account-group",
    route: "/usuarios",
    color: "#E65100",
    roles: RoleGroups.CanManageUsers,
  },
  {
    title: "Cadastrar Produto",
    description: "Adicionar produto ao sistema",
    icon: "mdi-package-variant-closed",
    route: "/produtos",
    color: "#2E7D32",
    roles: RoleGroups.CanManageMasterData,
  },
  {
    title: "Fornecedores",
    description: "Visualize os Fornecedores do sistema",
    icon: "mdi-truck-delivery-outline",
    route: "/fornecedores",
    color: "#2E7D32",
    roles: RoleGroups.CanManageMasterData,
  },
  {
    title: "Relatórios",
    description: "Exportar relatório de operações",
    icon: "mdi-file-chart",
    route: "/relatorios",
    color: "#455A64",
    roles: RoleGroups.CanManageMasterData,
  },
  {
    title: "Auditoria",
    description: "Visualizar auditoria do sistema",
    icon: "mdi-history",
    route: "/auditoria",
    color: "#455A64",
    roles: RoleGroups.CanViewAuditLogs,
  },
];

const visibleActions = computed(() => actions.filter((a) => can(a.roles)));
</script>

<style scoped>
.action-card {
  position: relative;
  overflow: hidden;
  border: none !important;
  transition: all 0.25s ease-in-out;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
  background: #ffffff;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 0 1px rgba(25, 95, 160, 0.12),
    0 4px 8px rgba(25, 95, 160, 0.08),
    0 16px 32px rgba(25, 95, 160, 0.12) !important;
}

.action-card:hover .chevron-icon {
  color: #195fa0 !important;
  transform: translateX(3px);
}

.chevron-icon {
  color: #cfd8dc;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.action-glow {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.action-card:hover .action-glow {
  opacity: 1;
}
</style>
