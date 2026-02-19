<template>
    <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">

        <div class="mb-6 d-flex justify-space-between align-end flex-wrap gap-4">
            <div>
                <h1 class="text-h4 font-weight-bold text-grey-darken-3">Gestão de Recebimentos</h1>
                <p class="text-body-1 text-grey">Acompanhe os contratos, metas de entrega e registre entradas.</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" size="large" class="text-capitalize elevation-2"
                @click="router.push('/novo-recebimento')">
                Novo Planejamento
            </v-btn>
        </div>

        <div class="d-flex flex-wrap align-center justify-space-between mb-6 gap-4">
            <v-tabs v-model="tabStatus" color="primary" align-tabs="start" density="compact"
                class="rounded-lg bg-white border elevation-1" style="max-width: 500px;">
                <v-tab value="todos" class="text-capitalize">Todos</v-tab>
                <v-tab value="Planejado" class="text-capitalize">Planejados</v-tab>
                <v-tab value="Ativo" class="text-capitalize">Em Andamento</v-tab>
                <v-tab value="Concluido" class="text-capitalize">Concluídos</v-tab>
            </v-tabs>

            <v-text-field v-model="search" density="compact" variant="solo" label="Buscar fornecedor ou produto..."
                prepend-inner-icon="mdi-magnify" hide-details class="flex-grow-1 elevation-1 rounded-lg"
                style="max-width: 400px; min-width: 250px;"></v-text-field>
        </div>

        <div v-if="store.loading" class="d-flex justify-center mt-12">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <div v-else-if="filteredList.length === 0" class="text-center mt-12 text-grey">
            <v-icon size="64" class="mb-2 opacity-50">mdi-clipboard-text-off-outline</v-icon>
            <h3 class="text-h6">Nenhum planejamento encontrado</h3>
        </div>

        <v-row v-else>
            <v-col v-for="item in filteredList" :key="item.id" cols="12" sm="6" lg="4" xl="3">
                <v-card class="rounded-xl border hover-card d-flex flex-column h-100" elevation="1">

                    <div class="pa-4 pb-2">
                        <div class="d-flex justify-space-between align-start mb-2">
                            <div class="d-flex align-center">
                                <v-avatar color="blue-lighten-5" class="mr-3 text-blue-darken-3 rounded-lg">
                                    <span class="text-h6 font-weight-bold">{{ item.fornecedorNome.charAt(0) }}</span>
                                </v-avatar>
                                <div>
                                    <div class="text-subtitle-1 font-weight-bold text-grey-darken-3 text-truncate"
                                        style="max-width: 200px;">
                                        {{ item.fornecedorNome }}
                                    </div>
                                    <div class="text-caption text-grey">
                                        Início: {{ formatDate(item.dataInicio) }}
                                    </div>
                                </div>
                            </div>
                            <v-menu location="bottom end">
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"
                                        color="grey"></v-btn>
                                </template>
                                <v-list density="compact" class="rounded-lg elevation-3">
                                    <v-list-item prepend-icon="mdi-pencil-outline" title="Editar"
                                        @click="handleEdit(item)"></v-list-item>
                                    <v-list-item prepend-icon="mdi-trash-can-outline" title="Excluir" color="error"
                                        @click="openDelete(item.id)"></v-list-item>
                                </v-list>
                            </v-menu>
                        </div>

                        <div class="mt-4 mb-2">
                            <div
                                class="d-flex justify-space-between text-caption mb-1 font-weight-bold text-grey-darken-2">
                                <span>Progresso do Contrato</span>
                                <span>{{ calcularProgressoGeral(item) }}%</span>
                            </div>
                            <v-progress-linear :model-value="calcularProgressoGeral(item)" color="success" height="6"
                                rounded bg-color="grey-lighten-3"></v-progress-linear>
                        </div>
                    </div>

                    <v-divider></v-divider>

                    <v-expand-transition>
                        <div v-if="expandedCards.includes(item.id)">
                            <div class="bg-grey-lighten-5 pa-4">
                                <div class="text-overline text-grey mb-2 font-weight-bold">ITENS ({{ item.itens.length
                                    }})</div>

                                <div v-for="sub in item.itens" :key="sub.id" class="mb-3 bg-white pa-3 rounded border">
                                    <div class="d-flex justify-space-between align-center mb-2">
                                        <span class="text-body-2 font-weight-bold text-grey-darken-3">{{ sub.produto
                                            }}</span>

                                        <v-btn v-if="sub.faltaReceber > 0" size="x-small" variant="tonal"
                                            color="primary" class="text-capitalize" prepend-icon="mdi-plus"
                                            @click="abrirModalRegistro(sub)">
                                            Registrar
                                        </v-btn>
                                        <v-chip v-else size="x-small" color="success" variant="flat"
                                            class="font-weight-bold">Concluído</v-chip>
                                    </div>

                                    <div class="d-flex justify-space-between text-caption text-grey-darken-1 mb-1">
                                        <span>Meta: {{ sub.quantidadeTotalPlanejada }} T</span>
                                        <span>Recebido: <strong>{{ sub.quantidadeTotalRecebida }} T</strong></span>
                                    </div>

                                    <v-progress-linear
                                        :model-value="(sub.quantidadeTotalRecebida / sub.quantidadeTotalPlanejada) * 100"
                                        color="blue" height="4" rounded></v-progress-linear>
                                </div>
                            </div>
                        </div>
                    </v-expand-transition>

                    <div class="pa-2 text-center bg-white rounded-b-xl">
                        <v-btn variant="text" size="small" color="grey-darken-1" class="text-caption"
                            :prepend-icon="expandedCards.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                            @click="toggleExpand(item.id)">
                            {{ expandedCards.includes(item.id) ? 'Recolher Detalhes' : 'Ver Detalhes' }}
                        </v-btn>
                    </div>

                </v-card>
            </v-col>
        </v-row>

        <ConfirmDeleteDialog v-model="showDelete" @confirm="confirmDelete" :loading="loadingDelete"
            message="Deseja realmente excluir este planejamento?" />

        <RegistrarEntradaModal v-model="showRegistroModal" :item="itemSelecionadoParaRegistro"
            :loading="loadingRegistro" @confirm="confirmarRegistroEntrada" />
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRecebimentoStore } from '@/stores/RecebimentoStore';
import { format, parseISO } from 'date-fns';
import type IRecebimentoResponse from '@/Dtos/Recebimento/IRecebimentoResponse';
import RegistrarEntradaModal from '@/components/modals/RegistrarEntradaModal.vue';
import ConfirmDeleteDialog from '@/components/modals/ConfirmDeleteDialog.vue';
import type { RegistrarEntradaDto } from '@/Dtos/Recebimento/RegistrarEntrada.dto';

const router = useRouter();
const store = useRecebimentoStore();

const search = ref('');
const tabStatus = ref('todos');
const expandedCards = ref<string[]>([]);

const showDelete = ref(false);
const itemToDelete = ref<string | null>(null);
const loadingDelete = ref(false);

const showRegistroModal = ref(false);
const itemSelecionadoParaRegistro = ref<any>(null);
const loadingRegistro = ref(false);

onMounted(() => {
    store.GetAll();
});

const filteredList = computed(() => {
    let list = store.recebimentos;
    if (tabStatus.value !== 'todos') {
        list = list.filter(i => i.status === tabStatus.value);
    }
    if (search.value) {
        const term = search.value.toLowerCase();
        list = list.filter(i =>
            i.fornecedorNome.toLowerCase().includes(term) ||
            i.itens.some(p => p.produto.toLowerCase().includes(term))
        );
    }
    return list;
});

function abrirModalRegistro(subItem: any) {
    itemSelecionadoParaRegistro.value = subItem;
    showRegistroModal.value = true;
}

async function confirmarRegistroEntrada(payload: RegistrarEntradaDto) {
    loadingRegistro.value = true;
    try {
        await store.RegistrarEntrada(payload);
        showRegistroModal.value = false;
    } catch (e) {
        console.error(e);
    } finally {
        loadingRegistro.value = false;
        itemSelecionadoParaRegistro.value = null;
    }
}

function formatDate(date: string) {
    if (!date) return '-';
    return format(parseISO(date), 'dd/MM/yyyy');
}

function calcularProgressoGeral(item: IRecebimentoResponse): number {
    if (!item.itens || item.itens.length === 0) return 0;
    const total = item.itens.reduce((acc, curr) => acc + curr.quantidadeTotalPlanejada, 0);
    const received = item.itens.reduce((acc, curr) => acc + curr.quantidadeTotalRecebida, 0);
    if (total === 0) return 0;
    return Math.min(Math.round((received / total) * 100), 100);
}

function toggleExpand(id: string) {
    if (expandedCards.value.includes(id)) {
        expandedCards.value = expandedCards.value.filter(x => x !== id);
    } else {
        expandedCards.value.push(id);
    }
}

function handleEdit(item: any) {
    // Futuro: router.push(`/editar/${item.id}`)
}

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
    } finally {
        loadingDelete.value = false;
        itemToDelete.value = null;
    }
}
</script>

<style scoped>
.hover-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.hover-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    border-color: #195FA0 !important;
}

.gap-4 {
    gap: 16px;
}
</style>