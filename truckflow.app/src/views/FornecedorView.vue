<template>
    <v-container class="py-10">
        <v-row class="mb-6 align-center">
            <v-col cols="12" sm="8">
                <h1 class="text-h4 font-weight-bold mb-1 text-slate-900">Fornecedores</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Gerencie seus parceiros comerciais e produtos associados
                </p>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right">
                <v-btn color="primary" size="large" prepend-icon="mdi-plus" rounded="lg" elevation="0"
                    @click="openCreateModal" class="text-none">
                    Novo Fornecedor
                </v-btn>
            </v-col>
        </v-row>

        <v-row class="mb-8 align-center">
            <v-col cols="12" md="6">
                <v-tabs v-model="activeTab" color="primary" class="modern-tabs" hide-slider>
                    <v-tab value="all" rounded="xl" variant="flat" class="text-none mr-2">
                        Todos <v-chip size="x-small" class="ml-2 font-weight-bold">{{ counts.all }}</v-chip>
                    </v-tab>
                    <v-tab value="with_products" rounded="xl" variant="flat" class="text-none">
                        Com Produtos <v-chip size="x-small" class="ml-2 font-weight-bold">{{ counts.withProducts
                            }}</v-chip>
                    </v-tab>
                </v-tabs>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Buscar por nome ou CNPJ..."
                    variant="outlined" hide-details rounded="lg" density="comfortable" bg-color="white" clearable />
            </v-col>
        </v-row>

        <v-row v-if="loading">
            <v-col v-for="i in 3" :key="i" cols="12" md="4"><v-skeleton-loader type="card" class="rounded-xl" /></v-col>
        </v-row>

        <v-row v-else>
            <v-col v-for="fornecedor in filteredFornecedores" :key="fornecedor.id" cols="12" md="4">
                <v-card variant="outlined" class="hover-card pb-2 h-100 d-flex flex-column" rounded="xl"
                    style="border-color: #e2e8f0">
                    <v-card-item>
                        <template v-slot:prepend>
                            <v-avatar color="indigo-lighten-5" rounded="lg">
                                <v-icon color="indigo">mdi-domain</v-icon>
                            </v-avatar>
                        </template>
                        <v-card-title class="font-weight-bold text-truncate">{{ fornecedor.nome }}</v-card-title>
                        <v-card-subtitle>{{ formatCnpj(fornecedor.cnpj) }}</v-card-subtitle>
                    </v-card-item>

                    <v-card-text class="pt-0 flex-grow-1">
                        <div class="mb-2 text-caption font-weight-bold text-uppercase text-disabled">Produtos Vinculados
                        </div>
                        <div class="d-flex flex-wrap ga-1">
                            <v-chip v-for="p in fornecedor.produtos" :key="p.id" size="x-small" color="primary"
                                variant="tonal" closable @click:close="handleUnlink(fornecedor.id!, p.id)">
                                {{ p.nome }}
                            </v-chip>
                            <v-btn v-if="!fornecedor.produtos?.length" variant="text" size="x-small" color="grey"
                                class="text-none pa-0" prepend-icon="mdi-plus" @click="openLinkModal(fornecedor)">
                                Vincular produto
                            </v-btn>
                            <v-btn v-else icon="mdi-plus" size="x-small" variant="tonal" color="primary"
                                @click="openLinkModal(fornecedor)" />
                        </div>
                    </v-card-text>

                    <v-divider class="mx-4 my-2" opacity="0.5" />

                    <v-card-actions class="px-4 py-3">
                        <v-spacer />
                        <v-btn icon="mdi-pencil-outline" variant="text" color="grey-darken-1"
                            @click="openEditModal(fornecedor)" />
                        <v-btn icon="mdi-trash-can-outline" variant="text" color="error"
                            @click="openConfirmDelete(fornecedor)" />
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <FornecedorFormModal :key="editingFornecedor?.id || 'new'" :open="modalOpen" :initialData="editingFornecedor"
            @close="closeModal" @submit="handleSubmit" />

        <ConfirmDeleteDialog v-model="deleteDialogOpen" :message="deleteMessage" :loading="isDeleting"
            @confirm="handleConfirmDelete" />

        <ProdutoSelectModal 
            v-model="linkDialogOpen" 
            :produtos="allProdutos"
            @vincular="handleLink" 
        />
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProdutoStore } from "@/stores/ProdutoStore";
import FornecedorFormModal from "@/components/Forms/FornecedorFormModal.vue";
import ConfirmDeleteDialog from "@/components/modals/ConfirmDeleteDialog.vue";
import ProdutoSelectModal from "@/components/modals/ProdutoSelectModal.vue";
import { useFornecedor } from "@/hooks/useFornecedor";
import { all } from "axios";

const { fornecedores, loading, create, update, remove, linkProduto, unlinkProduto } = useFornecedor();
const produtoStore = useProdutoStore();

const modalOpen = ref(false);
const deleteDialogOpen = ref(false);
const linkDialogOpen = ref(false);
const isDeleting = ref(false);
const activeTab = ref('all');
const searchQuery = ref('');

const editingFornecedor = ref<any>(null);
const targetFornecedor = ref<any>(null);
const allProdutos = computed(() => produtoStore.produtos);

const counts = computed(() => ({
    all: fornecedores.value.length,
    withProducts: fornecedores.value.filter(f => f.produtos?.length).length
}));

onMounted(() => {
    produtoStore.getAll
})

const filteredFornecedores = computed(() => {
    return fornecedores.value.filter(f => {
        const matchesTab = activeTab.value === 'all' || (activeTab.value === 'with_products' && f.produtos?.length);
        const query = searchQuery.value?.toLowerCase() || '';
        const matchesSearch = f.nome.toLowerCase().includes(query) || f.cnpj.includes(query);
        return matchesTab && matchesSearch;
    });
});

const deleteMessage = computed(() =>
    targetFornecedor.value ? `Deseja excluir o fornecedor "${targetFornecedor.value.nome}"?` : ""
);

const formatCnpj = (v: string) => v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

const openCreateModal = () => { editingFornecedor.value = null; modalOpen.value = true; };
const openEditModal = (f: any) => { editingFornecedor.value = f; modalOpen.value = true; };
const closeModal = () => { modalOpen.value = false; editingFornecedor.value = null; };
const openConfirmDelete = (f: any) => { targetFornecedor.value = f; deleteDialogOpen.value = true; };
const openLinkModal = (f: any) => { targetFornecedor.value = f; linkDialogOpen.value = true; };

async function handleSubmit(payload: any) {
    if (editingFornecedor.value?.id) {
        await update(editingFornecedor.value.id, payload);
    } 
    else  {
        await create(payload);
    }

    closeModal();
}

async function handleConfirmDelete() {
    if (!targetFornecedor.value?.id)  {
        return;
    }

    isDeleting.value = true;
    try {
        await remove(targetFornecedor.value.id); deleteDialogOpen.value = false;
    }
    finally { isDeleting.value = false; }
}

async function handleLink(produtoId: string) {
    if (targetFornecedor.value) {
        await linkProduto(targetFornecedor.value.id, produtoId);
    } 
}

async function handleUnlink(fornecedorId: string, produtoId: string) {
    await unlinkProduto(fornecedorId, produtoId);
}
</script>

<style scoped>
.hover-card {
    transition: all 0.3s ease;
    background: white;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.05) !important;
    border-color: #1976d2 !important;
}

.modern-tabs :deep(.v-tab) {
    background-color: #f8f9fa;
    color: #64748b;
    margin-right: 8px;
    border: 1px solid #e2e8f0;
}

.modern-tabs :deep(.v-tab--selected) {
    background-color: #ffffff !important;
    border-color: #1976d2 !important;
    color: #1976d2 !important;
}
</style>