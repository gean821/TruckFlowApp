<template>
  <v-container class="py-10">
    <v-row class="mb-6 align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold mb-1 text-slate-900">Locais de Descarga</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gerencie as docas e pontos de descarregamento da sua operação</p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          rounded="lg"
          elevation="0"
          @click="openCreateModal"
          class="text-none"
        >
          Novo Local
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-8 align-center">
      <v-col cols="12" md="6">
        <v-tabs
          v-model="activeTab"
          color="primary"
          align-tabs="start"
          class="modern-tabs"
          hide-slider
        >
          <v-tab value="all" class="text-none mr-2" rounded="xl" variant="flat">
            Todos
            <v-chip size="x-small" class="ml-2 font-weight-bold" color="grey-lighten-3" text-color="grey-darken-3">
              {{ counts.all }}
            </v-chip>
          </v-tab>

          <v-tab value="active" class="text-none mr-2" rounded="xl" variant="flat">
            Ativos
            <v-chip size="x-small" class="ml-2 font-weight-bold" color="success-lighten-4" text-color="success">
              {{ counts.active }}
            </v-chip>
          </v-tab>

          <v-tab value="inactive" class="text-none" rounded="xl" variant="flat">
            Inativos
            <v-chip size="x-small" class="ml-2 font-weight-bold" color="error-lighten-4" text-color="error">
              {{ counts.inactive }}
            </v-chip>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Buscar por nome ou unidade de entrega..."
          variant="outlined"
          hide-details
          rounded="lg"
          density="comfortable"
          bg-color="white"
          clearable
        />
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="i in 3" :key="i" cols="12" md="4">
        <v-skeleton-loader type="card" class="rounded-xl" />
      </v-col>
    </v-row>

    <v-row v-else-if="filteredLocais.length === 0" class="justify-center py-10">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-tray-arrow-down-outline</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">Nenhum local de descarga encontrado.</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="local in filteredLocais" :key="local.id" cols="12" md="4">
        <v-card 
          variant="outlined" 
          :class="['hover-card pb-2', { 'card-inactive': !local.status }]" 
          rounded="xl"
          :style="local.status ? 'border-color: #e0e0e0' : 'border-color: #ffcdd2; background-color: #fafafa'"
        >
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar :color="local.status ? 'blue-lighten-5' : 'error-lighten-5'" rounded="lg">
                <v-icon :color="local.status ? 'blue-darken-1' : 'error'">
                  {{ local.status ? 'mdi-truck-check' : 'mdi-truck-remove-outline' }}
                </v-icon>
              </v-avatar>
            </template>
            
            <v-card-title class="font-weight-bold text-truncate d-flex align-center">
              {{ local.nome }}
              <v-chip v-if="!local.status" size="x-small" color="error" class="ml-2" variant="flat">
                INATIVO
              </v-chip>
            </v-card-title>
            <v-card-subtitle class="d-flex align-center">
              <v-icon size="14" class="mr-1">mdi-office-building</v-icon>
              {{ local.unidadeEntrega }}
            </v-card-subtitle>
          </v-card-item>

          <v-divider class="mx-4 my-2" opacity="0.5" />

          <v-card-actions class="px-4 py-3">
            <v-spacer />
            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text" 
                  color="grey-darken-1" 
                  icon="mdi-pencil-outline" 
                  @click="openEditModal(local)" 
                />
              </template>
            </v-tooltip>
            
            <v-tooltip text="Remover" location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text" 
                  color="error" 
                  icon="mdi-trash-can-outline" 
                  @click="openConfirmDelete(local)" 
                />
              </template> 
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <LocalDescargaFormModal
      :key="editingLocal?.id || 'new'"
      :open="modalOpen"
      :initialData="editingLocal"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <ConfirmDeleteDialog
      v-model="deleteDialogOpen"
      :message="deleteMessage"
      :loading="isDeleting"
      @confirm="handleConfirmDelete"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useLocalDescarga } from "@/hooks/useLocalDescarga";
import LocalDescargaFormModal from "@/components/Forms/LocalDescargaFormModal.vue";
import ConfirmDeleteDialog from "@/components/modals/ConfirmDeleteDialog.vue";
import type { LocalDescargaResponse, CreateLocalDescargaDto } from "@/Entities/localDescarga.types";

const { locais, loading, create, update, remove } = useLocalDescarga();

const modalOpen = ref(false);
const deleteDialogOpen = ref(false);
const isDeleting = ref(false);
const activeTab = ref('all');
const searchQuery = ref('');

const editingLocal = ref<LocalDescargaResponse | undefined>();
const targetLocal = ref<LocalDescargaResponse | null>(null);

const counts = computed(() => ({
  all: locais.value.length,
  active: locais.value.filter(l => l.status === true).length,
  inactive: locais.value.filter(l => l.status === false || l.status == null).length
}));


const filteredLocais = computed(() => {
  return locais.value.filter(l => {    
    let matchesStatus = false;
    if (activeTab.value === 'all') matchesStatus = true;
    else if (activeTab.value === 'active') matchesStatus = l.status === true;
    else if (activeTab.value === 'inactive') matchesStatus = l.status === false || l.status == null;

    const query = searchQuery.value?.toLowerCase() || '';
    const nome = l.nome?.toLowerCase() || '';
    const unidade = l.unidadeEntrega?.toLowerCase() || '';

    const matchesSearch = nome.includes(query) || unidade.includes(query);

    return matchesStatus && matchesSearch;
  });
});

const deleteMessage = computed(() => 
  targetLocal.value ? `Tem certeza que deseja excluir o local "${targetLocal.value.nome}"? Esta ação não pode ser desfeita.` : ""
);

function openCreateModal() {
  editingLocal.value = undefined;
  modalOpen.value = true;
}

function openEditModal(local: LocalDescargaResponse) {
  editingLocal.value = local;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingLocal.value = undefined;
}

function openConfirmDelete(local: LocalDescargaResponse) {
  targetLocal.value = local;
  deleteDialogOpen.value = true;
}

async function handleSubmit(payload: CreateLocalDescargaDto) {
  try {
    if (editingLocal.value?.id) {
      await update(editingLocal.value.id, payload);
    } else {
      await create(payload);
    }

    closeModal();
  } catch (error) {
    console.error("Erro ao salvar local de descarga:", error);
  }
}

async function handleConfirmDelete() {
  if (!targetLocal.value?.id) return;
  isDeleting.value = true;
  try {
    await remove(targetLocal.value.id);
    deleteDialogOpen.value = false;
  } finally {
    isDeleting.value = false;
    targetLocal.value = null;
  }
}
</script>

<style scoped>
.hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.08) !important;
  border-color: #1976d2 !important;
}

.card-inactive {
  opacity: 0.8;
  filter: grayscale(0.3);
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