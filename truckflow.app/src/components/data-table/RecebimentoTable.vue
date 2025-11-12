<template>
  <div class="d-flex flex-row justify-center align-center pa-5 mt-3">
    <h1 class="text-h5">Controle de Recebimentos</h1>
  </div>

  <CrudTable 
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import router from '@/router';
import CrudTable, { type VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import { useRecebimentoStore } from '@/stores/RecebimentoStore';
import type IPlanejamentoRecebimento from '@/Entities/IPlanejamentoRecebimento';
import ItensModal from '../modals/ItensModal.vue';

const recebimentoStore = useRecebimentoStore();

const modalAberto = ref(false);
const recebimentoSelecionado = ref<IPlanejamentoRecebimento | null>(null);

const headers: VDataTableHeader = [
  { title: "FORNECEDOR", key: "fornecedorNome" },
  { title: "DATA DE INÍCIO", key: "dataInicio" },
  { title: "TOTAL DE ITENS", key: "itensCount" },
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

function abrirModal(recebimento: IPlanejamentoRecebimento) {
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
