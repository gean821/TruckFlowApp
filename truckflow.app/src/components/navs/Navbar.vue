<template>
  <!-- App Bar -->
  <v-app-bar elevation="0" height="68" class="appbar-dark">

    <div class="appbar-left">
      <v-btn icon variant="text" size="small" class="toggle-btn" @click="toggleSidebar">
        <v-icon color="white" size="22">mdi-menu</v-icon>
      </v-btn>

      <div class="logo-area">
        <v-img src="/Rectangle.svg" alt="TruckFlow" width="210" max-height="52" contain class="logo-img" />
      </div>

      <div class="breadcrumb-area">
        <span v-if="breadcrumb.parent" class="breadcrumb-parent">{{ breadcrumb.parent }}</span>
        <v-icon v-if="breadcrumb.parent" size="12" color="rgba(255,255,255,0.3)" class="mx-1">mdi-chevron-right</v-icon>
        <span class="breadcrumb-current">{{ breadcrumb.label }}</span>
      </div>
    </div>

    <v-spacer />

    <div class="appbar-right">

      <div class="appbar-clock">
        <v-icon size="13" color="rgba(255,255,255,0.45)" class="mr-1">mdi-clock-outline</v-icon>
        <span class="clock-time">{{ currentTime }}</span>
      </div>

      <div class="appbar-divider" />

      <v-btn icon variant="text" size="small" class="appbar-icon-btn">
        <v-badge dot color="#FF5252" offset-x="-1" offset-y="-1">
          <v-icon color="rgba(255,255,255,0.75)" size="20">mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <div class="appbar-divider" />

      <v-menu location="bottom end" transition="slide-y-transition">
        <template #activator="{ props }">
          <v-btn variant="text" class="user-btn" rounded="xl" height="52" v-bind="props">
            <v-avatar class="user-avatar-appbar" size="34">
              <v-img v-if="profile.photo" :src="profile.photo" cover />
              <span v-else class="initials-text">{{ profile.initials }}</span>
            </v-avatar>
            <div class="user-info-appbar">
              <span class="user-name-appbar">{{ profile.name }}</span>
              <span class="user-role-appbar">{{ profile.role }}</span>
            </div>
            <v-icon size="14" color="rgba(255,255,255,0.4)" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card min-width="220" elevation="0" class="rounded-xl mt-2 dropdown-card">
          <div class="dropdown-header pa-4">
            <div class="d-flex align-center gap-3">
              <v-avatar class="user-avatar-appbar" size="40">
                <v-img v-if="profile.photo" :src="profile.photo" cover />
                <span v-else class="initials-text" style="font-size: 14px;">{{ profile.initials }}</span>
              </v-avatar>
              <div>
                <div class="font-weight-bold text-grey-darken-3" style="font-size: 14px;">{{ profile.name }}</div>
                <div class="text-grey" style="font-size: 12px;">{{ profile.role }}</div>
              </div>
            </div>
          </div>
          <v-divider />
          <v-list density="compact" class="py-2">
            <v-list-item prepend-icon="mdi-account-cog-outline" title="Minha Conta" to="/account-config" rounded="lg" class="mx-1 dropdown-item" />
            <v-list-item prepend-icon="mdi-account-edit-outline" title="Editar Informações" rounded="lg" class="mx-1 dropdown-item" @click="openEditModal" />
            <v-divider class="my-1 mx-2" />
            <v-list-item prepend-icon="mdi-logout" title="Sair" color="error" rounded="lg" class="mx-1 dropdown-item" @click="logout" />
          </v-list>
        </v-card>
      </v-menu>

    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="sidebarVisible"
    :rail="railMode"
    :rail-width="64"
    width="272"
    border="none"
    class="sidebar-premium"
  >
    <div class="sidebar-accent-bar" />

    <div v-if="!railMode" class="sidebar-profile">
      <div class="profile-glow" />
      <v-avatar size="72" class="profile-avatar mb-3">
        <v-img v-if="profile.photo" :src="profile.photo" cover />
        <span v-else class="profile-initials">{{ profile.initials }}</span>
      </v-avatar>
      <div class="text-white font-weight-bold text-truncate profile-name">{{ profile.name }}</div>
      <div class="profile-role">{{ profile.role }}</div>
    </div>
    <div v-else class="mt-3" />

    <v-divider v-if="!railMode" style="border-color: rgba(255,255,255,0.1);" class="mb-2" />

    <v-list density="compact" nav class="px-2 pt-1">

      <v-tooltip text="Dashboard" location="end" :disabled="!railMode">
        <template #activator="{ props: tip }">
          <v-list-item v-bind="tip" to="/dashboard" prepend-icon="mdi-view-dashboard-outline" title="Dashboard"
            rounded="lg" active-class="nav-active" class="mb-1 nav-item" />
        </template>
      </v-tooltip>

      <v-tooltip text="Agendamentos" location="end" :disabled="!railMode">
        <template #activator="{ props: tip }">
          <v-list-item v-bind="tip" to="/visualizar" prepend-icon="mdi-calendar-multiselect" title="Agendamentos"
            rounded="lg" active-class="nav-active" class="mb-1 nav-item" />
        </template>
      </v-tooltip>

      <v-tooltip text="Planej. Recebimento" location="end" :disabled="!railMode">
        <template #activator="{ props: tip }">
          <v-list-item v-bind="tip" to="/recebimentos" prepend-icon="mdi-file-document-edit-outline" title="Planej. Recebimento"
            rounded="lg" active-class="nav-active" class="mb-1 nav-item" />
        </template>
      </v-tooltip>

      <div v-if="!railMode" class="nav-section-label mt-4 mb-1">OPERAÇÃO</div>
      <v-divider v-else class="my-2" style="border-color: rgba(255,255,255,0.1);" />

      <template v-if="railMode">
        <v-tooltip text="Programação" location="end">
          <template #activator="{ props: tip }">
            <v-list-item v-bind="tip" prepend-icon="mdi-clock-outline" title="Programação"
              rounded="lg" class="mb-1 nav-item" @click="railMode = false" />
          </template>
        </v-tooltip>

        <v-tooltip text="Cadastros" location="end">
          <template #activator="{ props: tip }">
            <v-list-item v-bind="tip" prepend-icon="mdi-database-outline" title="Cadastros"
              rounded="lg" class="mb-1 nav-item" @click="railMode = false" />
          </template>
        </v-tooltip>

        <v-divider class="my-2" style="border-color: rgba(255,255,255,0.1);" />

        <v-tooltip text="Bloqueios" location="end">
          <template #activator="{ props: tip }">
            <v-list-item v-bind="tip" to="/bloqueios" prepend-icon="mdi-shield-lock-outline" title="Bloqueios"
              rounded="lg" active-class="nav-active" class="mb-1 nav-item" />
          </template>
        </v-tooltip>

        <v-tooltip text="Notificações" location="end">
          <template #activator="{ props: tip }">
            <v-list-item v-bind="tip" rounded="lg" class="mb-1 nav-item" @click="railMode = false">
              <template #prepend>
                <v-badge dot color="error" offset-x="-2" offset-y="-2">
                  <v-icon>mdi-bell-badge-outline</v-icon>
                </v-badge>
              </template>
            </v-list-item>
          </template>
        </v-tooltip>
      </template>

      <template v-else>
        <v-list-group value="Programacao">
          <template #activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-clock-outline" title="Programação" rounded="lg" class="nav-item" />
          </template>
          <v-list-item to="nova-grade" title="Nova Grade" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
          <v-list-item to="/visualizar-grades" title="Visualizar Grades" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
        </v-list-group>

        <v-list-group value="Gerenciar">
          <template #activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-database-outline" title="Cadastros" rounded="lg" class="nav-item" />
          </template>
          <v-list-item to="produtos" title="Produtos" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
          <v-list-item to="locais" title="Locais de Descarga" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
          <v-list-item to="fornecedores" title="Fornecedores" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
          <v-list-item to="unidades-entregas" title="Unidades de Entrega" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
        </v-list-group>

        <div class="nav-section-label mt-4 mb-1">CONTROLE</div>

        <v-list-item to="/bloqueios" prepend-icon="mdi-shield-lock-outline" title="Bloqueios"
          rounded="lg" active-class="nav-active" class="mb-1 nav-item" />

        <v-list-group value="Notificacoes">
          <template #activator="{ props }">
            <v-list-item v-bind="props" rounded="lg" class="nav-item">
              <template #prepend>
                <v-badge dot color="error" offset-x="-2" offset-y="-2">
                  <v-icon>mdi-bell-badge-outline</v-icon>
                </v-badge>
              </template>
              <template #title>Notificações</template>
            </v-list-item>
          </template>
          <v-list-item to="reagendamentos" title="Reagendamentos" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
          <v-list-item to="enviar-notificacao" title="Enviar Nova" rounded="lg" class="pl-10 mb-1 nav-item-sub" active-class="nav-active-sub" />
        </v-list-group>
      </template>

      <v-tooltip text="Relatórios" location="end" :disabled="!railMode">
        <template #activator="{ props: tip }">
          <v-list-item v-bind="tip" to="/relatorios" prepend-icon="mdi-chart-box-outline" title="Relatórios"
            rounded="lg" active-class="nav-active" class="mt-1 nav-item" />
        </template>
      </v-tooltip>

    </v-list>

    <template #append>
      <div class="pa-2 pb-3">
        <v-divider style="border-color: rgba(255,255,255,0.1);" class="mb-2" />
        <v-tooltip text="Sair" location="end" :disabled="!railMode">
          <template #activator="{ props: tip }">
            <v-list-item v-bind="tip" prepend-icon="mdi-logout" title="Sair" rounded="lg" class="nav-item nav-logout" @click="logout" />
          </template>
        </v-tooltip>
        <div v-if="!railMode" class="text-center mt-2" style="font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.06em;">
          TruckFlow v1.0.0
        </div>
      </div>
    </template>

  </v-navigation-drawer>

  <EditProfileModal v-model="openProfile" />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EditProfileModal from '@/components/modals/EditProfileModal.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const openProfile = ref(false);
const sidebarVisible = ref(true);
const railMode = ref(false);
const currentTime = ref('');

const routeMap: Record<string, { label: string; parent?: string }> = {
  '/dashboard':          { label: 'Dashboard' },
  '/visualizar':         { label: 'Agendamentos' },
  '/recebimentos':       { label: 'Planej. Recebimento' },
  '/nova-grade':         { label: 'Nova Grade',          parent: 'Programação' },
  '/visualizar-grades':  { label: 'Visualizar Grades',   parent: 'Programação' },
  '/produtos':           { label: 'Produtos',            parent: 'Cadastros' },
  '/locais':             { label: 'Locais de Descarga',  parent: 'Cadastros' },
  '/fornecedores':       { label: 'Fornecedores',        parent: 'Cadastros' },
  '/unidades-entregas':  { label: 'Unidades de Entrega', parent: 'Cadastros' },
  '/bloqueios':          { label: 'Bloqueios' },
  '/reagendamentos':     { label: 'Reagendamentos',      parent: 'Notificações' },
  '/enviar-notificacao': { label: 'Enviar Nova',         parent: 'Notificações' },
  '/relatorios':         { label: 'Relatórios' },
  '/account-config':     { label: 'Minha Conta' },
};

const breadcrumb = computed(() => routeMap[route.path] ?? { label: route.path });

const profile = computed(() => {
  const name = authStore.user?.unique_name || 'Usuário';
  return {
    name,
    role: authStore.user?.role || 'Visitante',
    photo: (authStore.user as any)?.photoUrl ?? null,
    initials: name.substring(0, 2).toUpperCase(),
  };
});

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

let clockInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  updateTime();
  clockInterval = setInterval(updateTime, 60_000);
});

onUnmounted(() => {
  clearInterval(clockInterval);
});

function toggleSidebar() {
  if (!sidebarVisible.value) {
    sidebarVisible.value = true;
    railMode.value = false;
  } else if (!railMode.value) {
    railMode.value = true;
  } else {
    sidebarVisible.value = false;
    railMode.value = false;
  }
}

function openEditModal() {
  openProfile.value = true;
}

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.appbar-dark {
  background: linear-gradient(90deg, #0A2E52 0%, #0D3F6E 60%, #195FA0 100%) !important;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25) !important;
}

.appbar-left {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4px;
}

.toggle-btn {
  margin-left: 8px;
}

.logo-area {
  padding: 0 16px 0 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 4px;
  height: 56px;
  display: flex;
  align-items: center;
}

.logo-img {
  filter: brightness(0) invert(1);
}

.breadcrumb-area {
  display: flex;
  align-items: center;
  padding-left: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 8px;
}

.breadcrumb-parent {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
}

.breadcrumb-current {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}

.appbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 16px;
}

.appbar-icon-btn {
  opacity: 0.85;
  transition: opacity 0.15s;
}
.appbar-icon-btn:hover { opacity: 1; }

.appbar-divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 6px;
}

.appbar-clock {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.clock-time {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
}

.user-btn {
  gap: 10px;
  padding: 0 10px !important;
}

.user-avatar-appbar {
  background: rgba(255, 255, 255, 0.18) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.initials-text {
  color: white;
  font-weight: 700;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.user-info-appbar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.3;
}

.user-name-appbar {
  color: rgba(255, 255, 255, 0.95);
  font-size: 13px;
  font-weight: 600;
}

.user-role-appbar {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.dropdown-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14) !important;
}

.dropdown-header { background: #F8F9FC; }
.dropdown-item { font-size: 13px !important; }

/* ── Sidebar ── */
.sidebar-premium {
  background: linear-gradient(180deg, #0A2E52 0%, #0D3F6E 45%, #195FA0 100%) !important;
}

.sidebar-profile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 20px;
  overflow: hidden;
  text-align: center;
}

.profile-glow {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
  pointer-events: none;
}

.profile-avatar {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 3px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.profile-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.profile-name {
  font-size: 16px;
  max-width: 200px;
}

.profile-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 3px;
}

.nav-section-label {
  padding: 0 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.35);
}

.nav-item {
  color: rgba(255, 255, 255, 0.78) !important;
  font-weight: 500;
  font-size: 1.05rem !important;
  transition: background 0.15s ease, color 0.15s ease;
}

.nav-item-sub {
  color: rgba(255, 255, 255, 0.65) !important;
  font-size: 0.98rem !important;
}

.nav-active {
  background: linear-gradient(90deg, rgba(100, 181, 246, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%) !important;
  color: white !important;
  font-weight: 700 !important;
  border-left: 3px solid #64B5F6 !important;
}

:deep(.nav-active .v-icon) {
  color: #90CAF9 !important;
}

.nav-active-sub {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  font-weight: 600 !important;
}

.nav-logout {
  color: rgba(255, 110, 110, 0.9) !important;
  font-size: 1.05rem !important;
}

:deep(.v-list-item:not(.nav-active):not(.nav-active-sub):hover) {
  background-color: rgba(255, 255, 255, 0.09) !important;
  color: white !important;
}

:deep(.v-list-group__header .v-list-item__append) {
  color: rgba(255, 255, 255, 0.45);
}

:deep(.v-icon) { opacity: 1; }

.sidebar-accent-bar {
  height: 3px;
  background: linear-gradient(90deg, #64B5F6 0%, #90CAF9 40%, rgba(144, 202, 249, 0.2) 100%);
  flex-shrink: 0;
}
</style>
