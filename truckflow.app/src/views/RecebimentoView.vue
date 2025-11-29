<template>
    <v-container fluid class="pa-6">
        <CrudTable
        title="Recebimento"
        subtitle="Gerenciar recebimentos"
        icon="mdi-import" 
        :headers=headers
        :items=itens
        @abrir-dialog=redirectToNewRecebimento
        @delete=deleteItem
        />
    </v-container>
   
</template>

<script setup lang="ts">
import CrudTable, { type VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import router from '@/router';
import { useFornecedorStore } from '@/stores/FornecedorStore';
import { useItemPlanejamentoStore } from '@/stores/ItemPlanejamentoStore';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { useRecebimentoStore } from '@/stores/RecebimentoStore';
import { computed, onMounted, ref } from 'vue';

onMounted(async() => {
    await recebimentoStore.GetAll();
    await itemStore.GetAll();
    await fornecedorStore.GetAll();
    await produtoStore.GetAll();
})

const recebimentoStore = useRecebimentoStore();
const recebimentos = computed(() => recebimentoStore.recebimentos)
const produtoStore = useProdutoStore();
const produtos = computed(() => produtoStore.produtos);
const fornecedorStore = useFornecedorStore();
const fornecedores = computed(() => fornecedorStore.fornecedores);

const itemStore = useItemPlanejamentoStore();
const itens = computed(() => itemStore.itensPlanejamentos)


const headers: VDataTableHeader = [
    { title: "FORNECEDOR", key: "fornecedor" }, 
    { title: "PRODUTO", key: "produto" }, 
    { title: "CADÊNCIA DIÁRIA (T)", key: "cadenciaDiariaPlanejada" }, 
    { title: "RECEBIDO (T)", key: "quantidadeTotalRecebida" },
    { title: "FALTA RECEBER (T)", key: "faltaReceber" },
    { title: "CRIADO EM", key: "createdAt" },
    { title: "AÇÕES", key: "actions", sortable: false, align: "center" },
];

const dialog = ref(false);
const isEditing = ref(false);

function redirectToNewRecebimento() {
    router.push('/novo-recebimento')
}

async function deleteItem(id: string) {
    await itemStore.Deleteitem(id)
}

</script>

<style scoped>

.text-h5 {
   font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
}


</style>