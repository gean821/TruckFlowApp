<template>
    <v-container fluid class="pa-6">

        <CrudTable
            title="Bloqueios"
            subtitle="Visualize e gerencie os bloqueios"
            icon="mdi-cancel"
            :headers="headers" 
            :items=bloqueios
        />
        
    </v-container>
</template>


<script setup lang="ts">
import CrudTable, { type VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import { useBloqueioStore } from '@/stores/BloqueioStore';
import { useFornecedorStore } from '@/stores/FornecedorStore';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { onMounted, ref, computed } from 'vue';

onMounted(() => {
    bloqueioStore.GetAll();
    produtoStore.GetAll();
    fornecedorStore.GetAll();
})

const headers: VDataTableHeader = [
    { title: "HORÁRIO", key: "horario" },
    { title: "PRODUTO", key: "produto" },
    { title: "FORNECEDOR", key: "fornecedor" },
    { title: "AÇÕES", key: "actions", sortable: false, align: "center" },
];

const bloqueioStore = useBloqueioStore();
const bloqueios = computed(() => bloqueioStore.bloqueios);

const produtoStore = useProdutoStore();
const produtos = computed(() => produtoStore.produtos);

const fornecedorStore = useFornecedorStore();
const fornecedores = computed(() => fornecedorStore.fornecedores);

</script>


<style scoped></style>