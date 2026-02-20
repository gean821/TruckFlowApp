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
          <v-tab value="all" class="text-none mr-2" rounded="xl" variant="flat">Todas</v-tab>
          <v-tab value="active" class="text-none mr-2" rounded="xl" variant="flat">Ativas</v-tab>
          <v-tab value="inactive" class="text-none" rounded="xl" variant="flat">Inativas</v-tab>
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
          :class="['hover-card pb-2', { 'opacity-60': !unidade.ativa }]" 
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
            <v-tooltip text="Editar">
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
            
            <v-tooltip text="Remover">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props"
                  variant="text" 
                  color="error-lighten-1" 
                  icon="mdi-delete-outline" 
                  @click="remove(unidade.id!)" 
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import UnidadeEntregaFormModal from "@/components/Forms/UnidadeEntregaFormModal.vue";
import type { UnidadeEntregaCreateDto, UnidadeEntregaResponse } from "@/entities/unidadeEntrega.types";
import { useUnidadeEntrega } from "@/hook/useUnidadeEntrega";

const { unidades, loading, create, update, remove } = useUnidadeEntrega();

const modalOpen = ref(false);
const editingUnidade = ref<UnidadeEntregaResponse | undefined>();

// Estado dos filtros
const activeTab = ref('all');
const searchQuery = ref('');

// Lógica de Filtro Reativa (Front-end)
const filteredUnidades = computed(() => {
  return unidades.value.filter(u => {
    // 1. Filtro por Tabs (Status)
    const matchesStatus = 
      activeTab.value === 'all' || 
      (activeTab.value === 'active' && u.ativa) || 
      (activeTab.value === 'inactive' && !u.ativa);

    // 2. Filtro por Busca (Texto)
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

async function handleSubmit(data: UnidadeEntregaCreateDto) {
  if (editingUnidade.value?.id) {
    await update(editingUnidade.value.id, data);
  } else {
    await create(data);
  }
  closeModal();
}
</script>

<style scoped>
.hover-card {
  transition: all 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.05) !important;
  border-color: #1976d2 !important;
}
.opacity-60 {
  opacity: 0.7;
}

/* Estilização moderna para as tabs tipo Pill */
.modern-tabs :deep(.v-tab) {
  background-color: #f5f5f5;
  color: #757575;
  transition: all 0.2s;
}

.modern-tabs :deep(.v-tab--selected) {
  background-color: #e3f2fd !important; /* light blue */
  color: #1976d2 !important;
  font-weight: 600;
}
</style>