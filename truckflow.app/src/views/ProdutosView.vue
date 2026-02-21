<template>
  <v-container class="py-10">
    <v-row class="mb-6 align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-bold mb-1 text-slate-900">Catálogo de Produtos</h1>
        <p class="text-subtitle-1 text-medium-emphasis">Gira os produtos e os seus respetivos locais de descarga</p>
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
          Novo Produto
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6 align-center">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Procurar por nome, EAN ou local de descarga..."
          variant="outlined"
          hide-details
          rounded="lg"
          density="comfortable"
          bg-color="white"
          clearable
          @update:model-value="currentPage = 1"
        />
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-spacer class="hidden-sm-and-down" />
        <span class="text-body-2 text-medium-emphasis mr-3">Itens por página:</span>
        <v-select
          v-model="itemsPerPage"
          :items="[9, 18, 27, 45]"
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          style="max-width: 100px"
          @update:model-value="currentPage = 1"
        />
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
        <v-skeleton-loader type="list-item-avatar-two-line" class="rounded-xl border" />
      </v-col>
    </v-row>

    <!-- Grid de Produtos (Paginado) -->
    <v-row v-else-if="paginatedProdutos.length > 0">
      <v-col v-for="produto in paginatedProdutos" :key="produto.id" cols="12" sm="6" md="4">
        <v-card 
          variant="outlined" 
          class="hover-card h-100 d-flex flex-column" 
          rounded="xl" 
          style="border-color: #e2e8f0"
        >
          <v-card-item class="pa-4">
            <template v-slot:prepend>
              <v-avatar color="primary-lighten-5" rounded="lg" size="48">
                <v-icon color="primary">mdi-package-variant-closed</v-icon>
              </v-avatar>
            </template>
            
            <v-card-title class="text-subtitle-1 font-weight-bold text-truncate">
              {{ produto.nome }}
            </v-card-title>
            
            <v-card-subtitle class="mt-1">
              <v-chip size="x-small" color="blue-grey-lighten-4" variant="flat" class="text-blue-grey-darken-3">
                <v-icon start size="12">mdi-tray-arrow-down</v-icon>
                {{ produto.localDescarga || 'Sem local definido' }}
              </v-chip>
            </v-card-subtitle>
          </v-card-item>

          <v-spacer />
          <v-divider opacity="0.5" />

          <div class="px-4 py-3 d-flex align-center justify-space-between bg-grey-lighten-5">
            <div class="d-flex flex-column">
              <span class="text-caption text-disabled font-weight-bold">CÓDIGO EAN</span>
              <span class="text-caption font-weight-medium text-grey-darken-2">
                {{ produto.codigoEan || '---' }}
              </span>
            </div>
            
            <div class="d-flex ga-1">
              <v-tooltip text="Editar Produto" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn 
                    v-bind="props" 
                    icon="mdi-pencil-outline" 
                    variant="text" 
                    size="small" 
                    color="grey-darken-1" 
                    @click="openEditModal(produto)" 
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Remover Produto" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn 
                    v-bind="props" 
                    icon="mdi-trash-can-outline" 
                    variant="text" 
                    size="small" 
                    color="error" 
                    @click="openConfirmDelete(produto)" 
                  />
                </template>
              </v-tooltip>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estado de Procura Vazia -->
    <v-row v-else class="justify-center py-12">
      <v-col cols="12" class="text-center">
        <v-avatar size="80" color="grey-lighten-4" class="mb-4">
          <v-icon size="40" color="grey-lighten-1">mdi-package-variant-remove</v-icon>
        </v-avatar>
        <p class="text-h6 text-medium-emphasis">Não encontrámos nenhum produto.</p>
        <p class="text-body-2 text-disabled">Tente ajustar os seus termos de pesquisa.</p>
      </v-col>
    </v-row>

    <!-- Navegação: Paginação -->
    <v-row v-if="totalPages > 1" class="mt-8">
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          rounded="lg"
          active-color="primary"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <!-- Modais de Suporte -->
    <ProdutoFormModal
      :key="editingProduto?.id || 'new-product'"
      :open="modalOpen"
      :initialData="editingProduto"
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
import ProdutoFormModal from "@/components/Forms/ProdutoFormModal.vue";
import ConfirmDeleteDialog from "@/components/modals/ConfirmDeleteDialog.vue";
import { useProduto } from "@/hooks/useProdutos";
import type { ProdutoCreateDto, ProdutoResponse } from "@/Entities/produto.types";

const { produtos, loading, create, update, remove } = useProduto();

const modalOpen = ref(false);
const deleteDialogOpen = ref(false);
const isDeleting = ref(false);

const editingProduto = ref<ProdutoResponse | undefined>();
const targetProduto = ref<ProdutoResponse | null>(null);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(9);

const filteredProdutos = computed(() => {
  const query = searchQuery.value?.toLowerCase() || '';
  return produtos.value.filter(p => {
    const nome = p.nome?.toLowerCase() || '';
    const local = p.localDescarga?.toLowerCase() || '';
    const ean = p.codigoEan?.toLowerCase() || '';
    
    return nome.includes(query) || local.includes(query) || ean.includes(query);
  });
});

// 2. Cálculo do total de páginas
const totalPages = computed(() => Math.ceil(filteredProdutos.value.length / itemsPerPage.value));

// 3. Fatiamento do array para a página atual (Otimização de renderização)
const paginatedProdutos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProdutos.value.slice(start, end);
});

// Mensagem de confirmação dinâmica
const deleteMessage = computed(() => 
  targetProduto.value 
    ? `Tem a certeza que deseja eliminar o produto "${targetProduto.value.nome}"? Esta ação não pode ser revertida.` 
    : ""
);

// Métodos de Gestão de Modais
const openCreateModal = () => { 
  editingProduto.value = undefined; 
  modalOpen.value = true; 
};

const openEditModal = (produto: ProdutoResponse) => { 
  editingProduto.value = produto; 
  modalOpen.value = true; 
};

const closeModal = () => { 
  modalOpen.value = false; 
  editingProduto.value = undefined; 
};

function openConfirmDelete(produto: ProdutoResponse) {
  targetProduto.value = produto;
  deleteDialogOpen.value = true;
}

async function handleSubmit(payload: ProdutoCreateDto) {
  try {
    if (editingProduto.value?.id) {
      await update(editingProduto.value.id, payload);
    } else {
      await create(payload);
    }
    closeModal();
  } catch (error) {
    console.error("Erro ao processar produto:", error);
  }
}

async function handleConfirmDelete() {
  if (!targetProduto.value?.id) {
    return;
  } 
  
  isDeleting.value = true;
  try {
    await remove(targetProduto.value.id);
    deleteDialogOpen.value = false;
  } finally {
    isDeleting.value = false;
    targetProduto.value = null;
  }
}
</script>

<style scoped>
.hover-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
}

.hover-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.08) !important;
  border-color: #1976d2 !important;
}

@media (max-width: 600px) {
  .py-10 {
    padding-bottom: 80px !important;
  }
}
</style>