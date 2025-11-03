<template>
    <div class="d-flex flex-row justify-center align-center mt-3 pa-5">
        <h1 class="text-h5">Fornecedores</h1>
    </div>

    <CrudTable 
        :headers=headers
        :items="fornecedores"
        @abrir-dialog=""
        @delete="deleteFornecedor" 
    />

    <CrudTableModal 
        :is-editing=isEditing
        label="Nome do fornecedor"
        :value=formModel.nome
        v-model="dialog"
    />

</template>

<script setup lang="ts">
import CrudTableModal from '@/components/CrudTable-modal.vue';
import CrudTable, { type VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import type IFornecedor from '@/Entities/IFornecedor';
import { useFornecedorStore } from '@/stores/FornecedorStore';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { computed, onMounted, ref } from 'vue';
import { compileTemplate } from 'vue/compiler-sfc';

const dialog = ref(false);
const nome = ref('');
const isEditing = ref(false);


const headers: VDataTableHeader = [
    { title: "IDENTIFICADOR", key: "id", align: "start" },
    { title: "NOME", key: "nome" },
    { title: "CRIADO EM", key: "createdAt" },
    { title: "AÇÕES", key: "actions", sortable: false, align: "center" },
];

onMounted(() => {
    fornecedorStore.GetAll();
    produtoStore.GetAll();
})

const fornecedorStore = useFornecedorStore();
const fornecedores = computed(() => fornecedorStore.fornecedores)

const produtoStore = useProdutoStore();
const produtos = computed(() => produtoStore.produtos)

const formModel = ref<IFornecedor>({
    nome: '',
});

async function saveFornecedor() {
    console.log("teste");
}

async function deleteFornecedor(id: string) {
    await fornecedorStore.DeleteFornecedor(id);
}

</script>

<style scoped>
.text-h5 {
    font-family: "Montserrat", sans-serif;
}
</style>