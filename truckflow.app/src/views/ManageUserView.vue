<template>
  <v-container class="py-10">
    <v-row class="mb-6 align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold mb-1 text-slate-900">
          Gerenciar Usuários
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Cadastre e gerencie os administradores da sua empresa.
        </p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-account-plus-outline"
          rounded="lg"
          elevation="0"
          @click="openCreateModal"
          class="text-none"
        >
          Novo Usuário
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-8 align-center">
      <v-col cols="12" md="6">
        <v-tabs
          v-model="filtroStatus"
          color="primary"
          align-tabs="start"
          class="modern-tabs"
          hide-slider
        >
          <v-tab value="all" class="text-none mr-2" rounded="xl" variant="flat">
            Todos
            <v-chip
              size="x-small"
              class="ml-2 font-weight-bold"
              color="grey-lighten-3"
              text-color="grey-darken-3"
            >
              {{ data?.totalCount ?? 0 }}
            </v-chip>
          </v-tab>

          <v-tab
            value="active"
            class="text-none mr-2"
            rounded="xl"
            variant="flat"
          >
            Ativos
            <v-chip
              size="x-small"
              class="ml-2 font-weight-bold"
              color="success-lighten-4"
              text-color="success"
            >
              {{ countByStatus.active }}
            </v-chip>
          </v-tab>

          <v-tab value="inactive" class="text-none" rounded="xl" variant="flat">
            Inativos
            <v-chip
              size="x-small"
              class="ml-2 font-weight-bold"
              color="error-lighten-4"
              text-color="error"
            >
              {{ countByStatus.inactive }}
            </v-chip>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar por nome, login ou e-mail..."
          variant="outlined"
          hide-details
          rounded="lg"
          density="comfortable"
          bg-color="white"
          clearable
        />
      </v-col>
    </v-row>

    <v-row v-if="isLoading && !data">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card" class="rounded-xl" />
      </v-col>
    </v-row>

    <v-row
      v-else-if="(data?.items ?? []).length === 0"
      class="justify-center py-10"
    >
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1"
          >mdi-account-search-outline</v-icon
        >
        <p class="text-h6 text-medium-emphasis mt-4">
          Nenhum usuário encontrado.
        </p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="user in data?.items ?? []"
        :key="user.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card
          variant="outlined"
          :class="[
            'hover-card pb-2 h-100 d-flex flex-column',
            { 'card-inactive': !!user.deletedAt },
          ]"
          rounded="xl"
          :style="
            user.deletedAt
              ? 'border-color: #ffcdd2; background-color: #fafafa'
              : 'border-color: #e2e8f0'
          "
        >
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar
                :color="
                  user.deletedAt ? 'error-lighten-5' : 'primary-lighten-5'
                "
                rounded="lg"
                size="48"
              >
                <v-img v-if="user.photoUrl" :src="user.photoUrl" cover />
                <span
                  v-else
                  class="text-subtitle-1 font-weight-bold"
                  :class="user.deletedAt ? 'text-error' : 'text-primary'"
                >
                  {{ getInitials(user) }}
                </span>
              </v-avatar>
            </template>

            <v-card-title
              class="font-weight-bold text-truncate d-flex align-center"
            >
              {{ user.nomeReal ?? user.username }}
              <v-chip
                v-if="user.deletedAt"
                size="x-small"
                color="error"
                class="ml-2"
                variant="flat"
              >
                INATIVO
              </v-chip>
            </v-card-title>
            <v-card-subtitle class="d-flex align-center">
              <v-icon size="13" class="mr-1">mdi-at</v-icon>
              {{ user.username }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="pt-0 flex-grow-1">
            <div class="d-flex align-center mb-2 text-medium-emphasis">
              <v-icon size="14" class="mr-2 text-grey-lighten-1"
                >mdi-email-outline</v-icon
              >
              <span class="text-body-2 text-truncate">{{ user.email }}</span>
            </div>
            <div class="d-flex align-center justify-space-between">
              <v-chip
                size="x-small"
                color="primary"
                variant="tonal"
                class="font-weight-bold"
              >
                <v-icon start size="12">mdi-shield-account-outline</v-icon>
                {{ user.role }}
              </v-chip>
              <span class="text-caption text-disabled">{{
                formatData(user.createdAt)
              }}</span>
            </div>
          </v-card-text>

          <v-divider class="mx-4 my-2" opacity="0.5" />

          <v-card-actions class="px-4 py-2">
            <v-spacer />
            <v-tooltip text="Histórico" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-history"
                  variant="text"
                  color="grey-darken-1"
                  size="small"
                  @click="openHistorico(user)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil-outline"
                  variant="text"
                  color="grey-darken-1"
                  size="small"
                  @click="openEditModal(user)"
                />
              </template>
            </v-tooltip>

            <v-tooltip
              :text="user.deletedAt ? 'Ativar' : 'Inativar'"
              location="top"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="
                    user.deletedAt
                      ? 'mdi-account-check-outline'
                      : 'mdi-account-off-outline'
                  "
                  variant="text"
                  :color="user.deletedAt ? 'success' : 'error'"
                  size="small"
                  @click="openConfirmStatus(user)"
                />
              </template>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-center mt-6" v-if="(data?.totalPages ?? 0) > 1">
      <v-pagination
        v-model="page"
        :length="data?.totalPages ?? 1"
        :total-visible="7"
        color="primary"
        rounded="circle"
      />
    </div>

    <UsuarioFormModal
      :key="editingUser?.id ?? 'new'"
      :open="modalOpen"
      :initial-data="editingUser"
      :loading="isCreating || isUpdating"
@close="closeModal"
      @submit="handleSubmit"
    />

    <ConfirmDialog
      v-model="statusDialogOpen"
      :title="statusTarget?.deletedAt ? 'Ativar usuário' : 'Inativar usuário'"
      :message="statusMessage"
      :confirm-text="statusTarget?.deletedAt ? 'Ativar' : 'Inativar'"
      :color="statusTarget?.deletedAt ? 'success' : 'warning'"
      :icon="
        statusTarget?.deletedAt
          ? 'mdi-account-check-outline'
          : 'mdi-account-off-outline'
      "
      :loading="isTogglingStatus"
      @confirm="handleConfirmStatus"
    />

    <AuditDrawer
      v-model="auditDrawerOpen"
      entity-name="Administrador"
      :entity-id="auditTarget?.id ?? ''"
      :entity-label="
        auditTarget
          ? `Usuário — ${auditTarget.nomeReal ?? auditTarget.username}`
          : undefined
      "
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { format, parseISO } from "date-fns";
import { useUsuariosQuery } from "@/queries/usuario.queries";
import { useUsuario } from "@/hooks/useUsuario";
import type {
  UsuarioCreateDto,
  UsuarioListQueryDto,
  UsuarioResponseDto,
  UsuarioStatusFiltro,
  UsuarioUpdateDto,
} from "@/entities/usuario.types";
import UsuarioFormModal from "@/components/Forms/UsuarioFormModal.vue";
import ConfirmDialog from "@/components/modals/ConfirmDialog.vue";
import AuditDrawer from "@/components/audit/AuditDrawer.vue";

const route = useRoute();
const router = useRouter();

const STATUS_VALUES: UsuarioStatusFiltro[] = ["all", "active", "inactive"];

function parseStatus(value: unknown): UsuarioStatusFiltro {
  return STATUS_VALUES.includes(value as UsuarioStatusFiltro)
    ? (value as UsuarioStatusFiltro)
    : "all";
}

const page = ref(Number(route.query.page) || 1);
const pageSize = ref(12);
const search = ref(route.query.search?.toString() ?? "");
const searchDebounced = ref(search.value);
const filtroStatus = ref<UsuarioStatusFiltro>(parseStatus(route.query.status));

let timeout: ReturnType<typeof setTimeout>;

  watch(search, (val) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchDebounced.value = val ?? "";
  }, 400);
});

watch([searchDebounced, filtroStatus], () => {
  page.value = 1;
});

watch([searchDebounced, filtroStatus, page], () => {
  router.replace({
    query: {
      search: searchDebounced.value || undefined,
      status: filtroStatus.value === "all" ? undefined : filtroStatus.value,
      page: page.value !== 1 ? String(page.value) : undefined,
    },
  });
});

const params = computed<UsuarioListQueryDto>(() => ({
  pageNumber: page.value,
  pageSize: pageSize.value,
  search: searchDebounced.value || undefined,
  status: filtroStatus.value === "all" ? undefined : filtroStatus.value,
}));

const { data, isLoading } = useUsuariosQuery(params);
const { create, update, setStatus, isCreating, isUpdating, isTogglingStatus } =
  useUsuario();

const countByStatus = computed(() => {
  const items = data.value?.items ?? [];
  return {
    active: items.filter((u) => !u.deletedAt).length,
    inactive: items.filter((u) => !!u.deletedAt).length,
  };
});

const modalOpen = ref(false);
const editingUser = ref<UsuarioResponseDto | undefined>();

const statusDialogOpen = ref(false);
const statusTarget = ref<UsuarioResponseDto | null>(null);

const auditDrawerOpen = ref(false);
const auditTarget = ref<UsuarioResponseDto | null>(null);

const statusMessage = computed(() => {
  if (!statusTarget.value) {
    return "";
  } 

  const nome = statusTarget.value.nomeReal ?? statusTarget.value.username;
  return statusTarget.value.deletedAt
    ? `Tem certeza que deseja ativar o usuário "${nome}"? Ele poderá acessar o sistema novamente.`
    : `Tem certeza que deseja inativar o usuário "${nome}"? Ele perderá o acesso, mas o histórico será preservado.`;
});

function getInitials(item: UsuarioResponseDto) {
  const base = item.nomeReal ?? item.username ?? "?";
  return (
    base
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function formatData(iso?: string | null) {
  if (!iso) {
    return "-";
  } 

  try {
    return format(parseISO(iso), "dd/MM/yyyy");
  } catch {
    return "-";
  }
}

function openCreateModal() {
  editingUser.value = undefined;
  modalOpen.value = true;
}

function openEditModal(user: UsuarioResponseDto) {
  editingUser.value = user;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingUser.value = undefined;
}

function openConfirmStatus(user: UsuarioResponseDto) {
  statusTarget.value = user;
  statusDialogOpen.value = true;
}

function openHistorico(user: UsuarioResponseDto) {
  auditTarget.value = user;
  auditDrawerOpen.value = true;
}

async function handleSubmit(payload: UsuarioCreateDto | UsuarioUpdateDto) {
  try {
    if (editingUser.value?.id) {
      await update(editingUser.value.id, payload as UsuarioUpdateDto);
    } else {
      await create(payload as UsuarioCreateDto);
    }
    closeModal();
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
}

async function handleConfirmStatus() {
  if (!statusTarget.value) {
    return;
  } 
  
  const ativo = !!statusTarget.value.deletedAt;

  try {
    await setStatus(statusTarget.value.id, ativo);
    statusDialogOpen.value = false;
  } finally {
    statusTarget.value = null;
  }
}
</script>

<style scoped>
.hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08) !important;
  border-color: #1976d2 !important;
}

.card-inactive {
  opacity: 0.85;
  filter: grayscale(0.2);
}

.modern-tabs :deep(.v-tab) {
  background-color: #f8f9fa;
  color: #64748b;
  margin-right: 8px;
  border: 1px solid #e2e8f0;
  height: 48px !important;
  transition: all 0.2s;
}

.modern-tabs :deep(.v-tab--selected) {
  background-color: #ffffff !important;
  border-color: #1976d2 !important;
  color: #1976d2 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
