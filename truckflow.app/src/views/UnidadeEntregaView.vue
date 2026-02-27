<template>
  <v-container class="py-10">
    <v-row class="mb-6 align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold mb-1 text-slate-900">Unidades de Entrega</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gerencie os pontos logísticos e unidades da sua empresa</p>
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
          Nova Unidade
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
            Todas
            <v-chip size="x-small" class="ml-2 font-weight-bold" color="grey-lighten-3" text-color="grey-darken-3">
              {{ counts.all }}
            </v-chip>
          </v-tab>

          <v-tab value="active" class="text-none mr-2" rounded="xl" variant="flat">
            Ativas
            <v-chip size="x-small" class="ml-2 font-weight-bold" color="success-lighten-4" text-color="success">
              {{ counts.active }}
            </v-chip>
          </v-tab>

          <v-tab value="inactive" class="text-none" rounded="xl" variant="flat">
            Inativas
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
          label="Buscar por nome, cidade ou logradouro..."
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

    <v-row v-else-if="filteredUnidades.length === 0" class="justify-center py-10">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-map-marker-off-outline</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">Nenhuma unidade encontrada.</p>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="unidade in filteredUnidades" :key="unidade.id" cols="12" md="4">
        <v-card 
          variant="outlined" 
          :class="['hover-card pb-2', { 'card-inactive': !unidade.ativa }]" 
          rounded="xl"
          :style="unidade.ativa ? 'border-color: #e0e0e0' : 'border-color: #ffcdd2; background-color: #fafafa'"
        >
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar :color="unidade.ativa ? 'primary-lighten-5' : 'error-lighten-5'" rounded="lg">
                <v-icon :color="unidade.ativa ? 'primary' : 'error'">
                  {{ unidade.ativa ? 'mdi-office-building-marker' : 'mdi-office-building-marker-outline' }}
                </v-icon>
              </v-avatar>
            </template>
            
            <v-card-title class="font-weight-bold text-truncate d-flex align-center">
              {{ unidade.nome }}
              <v-chip v-if="!unidade.ativa" size="x-small" color="error" class="ml-2" variant="flat">
                INATIVO
              </v-chip>
            </v-card-title>
            <v-card-subtitle>{{ unidade.cidade }} - {{ unidade.estado }}</v-card-subtitle>
          </v-card-item>

          <v-card-text class="pt-0">
            <div class="d-flex align-center mb-2">
              <v-icon size="small" class="mr-2" color="grey">mdi-map-marker-outline</v-icon>
              <span class="text-body-2 text-medium-emphasis">{{ unidade.logradouro }}, {{ unidade.numero }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="small" class="mr-2" color="grey">mdi-mailbox-outline</v-icon>
              <span class="text-body-2 text-medium-emphasis">CEP: {{ unidade.cep }}</span>
            </div>
          </v-card-text>

          <v-divider class="mx-4" />

          <v-card-actions class="px-4 py-3">
            <v-spacer />
            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text" 
                  color="grey-darken-1" 
                  icon="mdi-pencil-outline" 
                  @click="openEditModal(unidade)" 
                />
              </template>
            </v-tooltip>
            
            <v-tooltip text="Remover" location="top">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text" 
                  color="error" 
                  icon="mdi-delete-outline" 
                  @click="openConfirmDelete(unidade)" 
                />
              </template> 
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <UnidadeEntregaFormModal
      :key="editingUnidade?.id || 'new'"
      :open="modalOpen"
      :initialData="editingUnidade"
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
import UnidadeEntregaFormModal from "@/components/Forms/UnidadeEntregaFormModal.vue";
import ConfirmDeleteDialog from "@/components/modals/ConfirmDeleteDialog.vue";
import type { UnidadeEntregaCreateDto, UnidadeEntregaResponse } from "@/entities/unidadeEntrega.types";
import { useUnidadeEntrega } from "@/hooks/useUnidadeEntrega";

const { unidades, loading, create, update, remove } = useUnidadeEntrega();

const modalOpen = ref(false);
const deleteDialogOpen = ref(false);
const isDeleting = ref(false);

const editingUnidade = ref<UnidadeEntregaResponse | undefined>();
const targetUnidade = ref<UnidadeEntregaResponse | null>(null);

const activeTab = ref('all');
const searchQuery = ref('');

const counts = computed(() => ({
  all: unidades.value.length,
  active: unidades.value.filter(u => u.ativa).length,
  inactive: unidades.value.filter(u => !u.ativa).length
}));

const deleteMessage = computed(() => 
  targetUnidade.value 
    ? `Tem certeza que deseja excluir a unidade "${targetUnidade.value.nome}"? Esta ação não pode ser desfeita.` 
    : ""
);

const filteredUnidades = computed(() => {
  return unidades.value.filter(u => {
    const matchesStatus = 
      activeTab.value === 'all' || 
      (activeTab.value === 'active' && u.ativa) || 
      (activeTab.value === 'inactive' && !u.ativa);

    const query = searchQuery.value?.toLowerCase() || '';
    const matchesSearch = 
      u.nome.toLowerCase().includes(query) ||
      u.cidade?.toLowerCase().includes(query) ||
      u.logradouro?.toLowerCase().includes(query) ||
      u.cep?.includes(query);

    return matchesStatus && matchesSearch;
  });
});

function openCreateModal() {
  editingUnidade.value = undefined;
  modalOpen.value = true;
}

function openEditModal(unidade: UnidadeEntregaResponse) {
  editingUnidade.value = unidade;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  editingUnidade.value = undefined;
}

function openConfirmDelete(unidade: UnidadeEntregaResponse) {
  targetUnidade.value = unidade;
  deleteDialogOpen.value = true;
}

async function handleSubmit(data: UnidadeEntregaCreateDto) {
  const payload = {
    ...data,
    cep: data.cep?.replace(/\D/g, '')
  };

  try {
    if (editingUnidade.value?.id) {
      await update(editingUnidade.value.id, payload);
    } else { 
      await create(payload);
    }
    closeModal();
  } catch (error) {
    console.error("Erro ao salvar unidade:", error);
  }
}

async function handleConfirmDelete() {
  if (!targetUnidade.value?.id) return;
  
  isDeleting.value = true;
  try {
    await remove(targetUnidade.value.id);
    deleteDialogOpen.value = false;
  } finally {
    isDeleting.value = false;
    targetUnidade.value = null;
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

/* Estilização Moderna das Tabs */
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