<template>
  <v-container fluid class="pa-6">
    
    <CrudTable
     title="Recebimentos"
     subtitle="Gerenciar recebimentos"
     icon="mdi-import"
    :headers="headers"
    :items="recebimentos"
    @abrir-dialog="redirectToNewRecebimento"
    @viewItens="abrirModal"
    @delete="deletarRecebimento"
    :showView="true"  
    />

    <ItensModal 
    v-if="modalAberto" 
    :recebimento="recebimentoSelecionado" 
    @close="modalAberto = false"
    />

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import router from '@/router';
import CrudTable, { type VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import { useRecebimentoStore } from '@/stores/RecebimentoStore';
import ItensModal from '../modals/ItensModal.vue';
import type IRecebimentoResponse from '@/Dtos/Recebimento/IRecebimentoResponse';

const recebimentoStore = useRecebimentoStore();

const modalAberto = ref(false);
const recebimentoSelecionado = ref<IRecebimentoResponse | null>(null);

const headers: VDataTableHeader = [
  { title: "FORNECEDOR", key: "fornecedorNome" },
  { title: "DATA DE INÍCIO", key: "dataInicio" },
  { title: "TOTAL DE ITENS", key: "totalItens" },
  { title: "CRIADO EM", key: "createdAt" },
  { title: "AÇÕES", key: "actions", sortable: false, align: "center" },
];

onMounted(async () => {
  await recebimentoStore.GetAll();
});

const recebimentos = computed(() => recebimentoStore.recebimentos);


function redirectToNewRecebimento() {
  router.push('/novo-recebimento');
}

function abrirModal(recebimento: IRecebimentoResponse) {
  recebimentoSelecionado.value = recebimento;
  modalAberto.value = true;
}

async function deletarRecebimento(id: string) {
  await recebimentoStore.DeleteRecebimento(id);
}
</script>

<style scoped>
.text-h5 {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
