<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">
    
    <div class="mb-6 d-flex flex-wrap justify-space-between align-end gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Gestão de Recebimentos</h1>
        <p class="text-body-1 text-grey">Acompanhe os contratos, metas de entrega e progresso de recebimento.</p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        size="large"
        class="text-capitalize elevation-2"
        @click="router.push('/novo-recebimento')"
      >
        Novo Planejamento
      </v-btn>
    </div>

    <div class="d-flex flex-wrap align-center justify-space-between mb-6 gap-4">
      <v-tabs
        v-model="tabStatus"
        color="primary"
        align-tabs="start"
        density="compact"
        class="rounded-lg bg-white border elevation-1"
        style="max-width: 500px;"
      >
        <v-tab value="todos" class="text-capitalize">Todos</v-tab>
        <v-tab value="Planejado" class="text-capitalize">Planejados</v-tab>
        <v-tab value="Ativo" class="text-capitalize">Em Andamento</v-tab>
        <v-tab value="Concluido" class="text-capitalize">Concluídos</v-tab>
      </v-tabs>

      <v-text-field
        v-model="search"
        density="compact"
        variant="solo"
        label="Buscar fornecedor ou produto..."
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="flex-grow-1 elevation-1 rounded-lg"
        style="max-width: 400px; min-width: 250px;"
      ></v-text-field>
    </div>

    <div v-if="store.loading" class="d-flex justify-center mt-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="filteredList.length === 0" class="text-center mt-10 text-grey">
        <v-icon size="64" class="mb-2 opacity-50">mdi-clipboard-text-off-outline</v-icon>
        <h3 class="text-h6">Nenhum planejamento encontrado</h3>
        <p>Tente mudar o filtro ou crie um novo.</p>
    </div>

    <v-row v-else>
      <v-col 
        v-for="item in filteredList" 
        :key="item.id" 
        cols="12" 
        md="6" 
        xl="4"
      >
        <v-card class="rounded-xl border hover-card" elevation="1">
            
            <div class="pa-4 pb-2">
                <div class="d-flex justify-space-between align-start mb-2">
                    <div class="d-flex align-center">
                        <v-avatar color="blue-lighten-5" class="mr-3 text-blue-darken-3 rounded-lg">
                            <v-icon>mdi-domain</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 text-truncate" style="max-width: 250px;">
                                {{ item.fornecedorNome }}
                            </div>
                            <div class="text-caption text-grey d-flex align-center">
                                <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                                Início: {{ formatDate(item.dataInicio) }}
                            </div>
                        </div>
                    </div>
                    
                    <v-menu location="bottom end">
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" color="grey"></v-btn>
                        </template>
                        <v-list density="compact" class="rounded-lg elevation-4">
                            <v-list-item prepend-icon="mdi-pencil" title="Editar" @click="handleEdit(item)"></v-list-item>
                            <v-list-item prepend-icon="mdi-delete" title="Excluir" color="error" @click="openDelete(item.id)"></v-list-item>
                        </v-list>
                    </v-menu>
                </div>

                <div class="mt-4 mb-2">
                    <div class="d-flex justify-space-between text-caption mb-1 font-weight-bold text-grey-darken-2">
                        <span>Progresso do Contrato</span>
                        <span>{{ calcularProgressoGeral(item) }}%</span>
                    </div>
                    <v-progress-linear
                        :model-value="calcularProgressoGeral(item)"
                        color="success"
                        height="8"
                        rounded
                        bg-color="blue-grey-lighten-4"
                    ></v-progress-linear>
                </div>
            </div>

            <v-divider></v-divider>

            <v-expand-transition>
                <div v-if="expandedCards.includes(item.id)">
                    <div class="bg-grey-lighten-5 pa-4">
                        <div class="text-overline text-grey mb-2">PRODUTOS ({{ item.itens.length }})</div>
                        
                        <div v-for="sub in item.itens" :key="sub.id" class="mb-3 bg-white pa-3 rounded border">
                            <div class="d-flex justify-space-between align-center mb-1">
                                <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ sub.produto }}</span>
                                <v-chip size="x-small" :color="sub.faltaReceber <= 0 ? 'success' : 'warning'" variant="flat">
                                    {{ sub.faltaReceber <= 0 ? 'Concluído' : 'Em andamento' }}
                                </v-chip>
                            </div>
                            
                            <div class="d-flex justify-space-between text-caption text-grey-darken-1 mb-1">
                                <span>Meta: {{ sub.quantidadeTotalPlanejada }} T</span>
                                <span>Recebido: <strong>{{ sub.quantidadeTotalRecebida }} T</strong></span>
                            </div>
                            
                            <v-progress-linear
                                :model-value="(sub.quantidadeTotalRecebida / sub.quantidadeTotalPlanejada) * 100"
                                color="blue"
                                height="4"
                                rounded
                            ></v-progress-linear>
                        </div>
                    </div>
                </div>
            </v-expand-transition>

            <div class="pa-2 text-center">
                <v-btn 
                    variant="text" 
                    size="small" 
                    color="grey-darken-1" 
                    class="text-caption"
                    :prepend-icon="expandedCards.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="toggleExpand(item.id)"
                >
                    {{ expandedCards.includes(item.id) ? 'Recolher Detalhes' : 'Ver Detalhes dos Produtos' }}
                </v-btn>
            </div>

        </v-card>
      </v-col>
    </v-row>

    <ConfirmDeleteDialog
        v-model="showDelete" 
        @confirm="confirmDelete" 
        :loading="loadingDelete"
        message="Tem certeza que deseja excluir este contrato? O histórico de recebimentos vinculados a ele será mantido, mas o planejamento será removido."
    />

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRecebimentoStore } from '@/stores/RecebimentoStore';
import { format, parseISO } from 'date-fns';
import type IRecebimentoResponse from '@/Dtos/Recebimento/IRecebimentoResponse';
import ConfirmDeleteDialog from '@/components/modals/ConfirmDeleteDialog.vue';

const router = useRouter();
const store = useRecebimentoStore();

// Estados
const search = ref('');
const tabStatus = ref('todos');
const expandedCards = ref<string[]>([]); // Array de IDs expandidos

// Delete
const showDelete = ref(false);
const itemToDelete = ref<string | null>(null);
const loadingDelete = ref(false);

onMounted(() => {
    store.GetAll();
});

// Filtro Inteligente (Busca + Tabs)
const filteredList = computed(() => {
    let list = store.recebimentos;

    // Filtro por Status
    if (tabStatus.value !== 'todos') {
        // Supondo que o backend retorne o Status. Se não retornar, precisa ajustar a lógica ou o DTO.
        // Se o status não vier no DTO, podemos calcular baseado no "Falta Receber"
        list = list.filter(i => i.status === tabStatus.value);
    }

    // Filtro por Busca (Fornecedor ou Produto)
    if (search.value) {
        const term = search.value.toLowerCase();
        list = list.filter(i => 
            i.fornecedorNome.toLowerCase().includes(term) ||
            i.itens.some(p => p.produto.toLowerCase().includes(term))
        );
    }

    return list;
});

// Helpers
function formatDate(date: string) {
    if(!date) return '-';
    return format(parseISO(date), 'dd/MM/yyyy');
}

function calcularProgressoGeral(item: IRecebimentoResponse): number {
    if (!item.itens || item.itens.length === 0) return 0;
    
    // Soma totais
    const totalPlanejado = item.itens.reduce((acc, curr) => acc + curr.quantidadeTotalPlanejada, 0);
    const totalRecebido = item.itens.reduce((acc, curr) => acc + curr.quantidadeTotalRecebida, 0);
    
    if (totalPlanejado === 0) return 0;
    
    const percent = (totalRecebido / totalPlanejado) * 100;
    return Math.min(Math.round(percent), 100); // Trava em 100%
}

function toggleExpand(id: string) {
    if (expandedCards.value.includes(id)) {
        expandedCards.value = expandedCards.value.filter(x => x !== id);
    } else {
        expandedCards.value.push(id);
    }
}

function handleEdit(item: any) {
    // router.push(`/editar-recebimento/${item.id}`);
    alert("Implementar rota de edição");
}

// Lógica de Exclusão Corrigida
function openDelete(id: string) {
    itemToDelete.value = id;
    showDelete.value = true;
}

async function confirmDelete() {
    if (!itemToDelete.value) return;
    
    loadingDelete.value = true;
    try {
        await store.DeleteRecebimento(itemToDelete.value);
        showDelete.value = false;
        // Opcional: store.GetAll() se a store não atualizar reativamente
    } catch (e) {
        console.error(e);
    } finally {
        loadingDelete.value = false;
        itemToDelete.value = null;
    }
}
</script>

<style scoped>
/* Efeito de hover suave no card */
.hover-card {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
    border-color: #195FA0 !important; /* Borda azul ao passar mouse */
}

.gap-4 { gap: 16px; }
</style>