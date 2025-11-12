<template>
  <v-dialog v-model="open" max-width="900">
    <v-card>
      <v-card-title class="d-flex align-center">
        <div>
          <div class="text-h6">Itens do Recebimento</div>
          <div class="subtitle-2">
            <strong v-if="recebimento">
              {{ recebimento.fornecedor }}
            </strong>
            <span v-if="recebimento"> — {{ formatarData(recebimento.dataInicio) }}</span>
          </div>
        </div>

        <v-spacer />

        <v-btn icon @click="closeModal" aria-label="Fechar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div v-if="localItems.length === 0" class="pa-4">
          <p>Sem itens cadastrados para este recebimento.</p>
        </div>

        <v-data-table
          v-else
          :items="localItems"
          :headers="tableHeaders"
          class="elevation-1"
          hide-default-footer
          density="compact"
        >
          <template #item.produto="{ item }">
            {{ item.produto ?? item.produtoNome ?? '—' }}
          </template>

          <template #item.quantidadeTotalPlanejada="{ item }">
            {{ item.quantidadeTotalPlanejada }}
          </template>

          <template #item.cadenciaDiariaPlanejada="{ item }">
            {{ item.cadenciaDiariaPlanejada }}
          </template>

          <template #item.quantidadeTotalRecebida="{ item }">
            {{ item.quantidadeTotalRecebida ?? 0 }}
          </template>

          <template #item.faltaReceber="{ item }">
            {{ item.faltaReceber ?? ( (item.quantidadeTotalPlanejada ?? 0) - (item.quantidadeTotalRecebida ?? 0) ) }}
          </template>

          <template #item.createdAt="{ item }">
            {{ formatarData(item.createdAt) }}
          </template>

          <template #item.actions="{ item }">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-btn icon v-bind="props" @click="onDeleteItem(item)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Remover item</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeModal">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useItemPlanejamentoStore } from '@/stores/ItemPlanejamentoStore';
import { useRecebimentoStore } from '@/stores/RecebimentoStore';
import { formatarData } from '@/utils/date-format';
import type IPlanejamentoRecebimento from '@/Entities/IPlanejamentoRecebimento';
import type { VDataTableHeader } from '../data-table/CrudTable.vue';

const props = defineProps<{ recebimento: IPlanejamentoRecebimento | null }>();
const emit = defineEmits<{
  (e: 'close'): void
}>();


const itemStore = useItemPlanejamentoStore();
const recebimentoStore = useRecebimentoStore();

const open = ref(true);
const localItems = ref<any[]>([]);

const tableHeaders : VDataTableHeader = [
  { title: 'PRODUTO', key: 'produto' },
  { title: 'QUANTIDADE TOTAL (T)', key: 'quantidadeTotalPlanejada', align: 'end' },
  { title: 'CADÊNCIA DIÁRIA (T)', key: 'cadenciaDiariaPlanejada', align: 'end' },
  { title: 'RECEBIDO (T)', key: 'quantidadeTotalRecebida', align: 'end' },
  { title: 'FALTA RECEBER (T)', key: 'faltaReceber', align: 'end' },
  { title: 'CRIADO EM', key: 'createdAt' },
  { title: 'AÇÕES', key: 'actions', sortable: false, align: 'center' },
];

// quando receber um novo recebimento via prop, popula localItems e abre o modal
watch(
  () => props.recebimento,
  (r) => {
    open.value = !!r;
    if (!r) {
      localItems.value = [];
      return;
    }

    // clona os itens (evita problemas com reatividade/proxy)
    localItems.value = (r.itemPlanejamentos ?? []).map(i => ({ ...i }));
  },
  { immediate: true }
);

// util: pegar id do item (suporta id ou Id vindo do backend)
function getItemId(item: any): string | undefined {
  return item.id ?? item.Id ?? item.Id?.toString?.();
}

// fechar modal e notificar pai
function closeModal() {
  open.value = false;
  emit('close');
}

// confirmação e remoção do item
async function onDeleteItem(item: any) {
  const id = getItemId(item);
  if (!id) {
    // tenta remover localmente se não houver id (incomum)
    localItems.value = localItems.value.filter(x => x !== item);
    return;
  }

  const confirmMsg = `Remover o item "${item.produto ?? item.produtoNome ?? id}"? Esta ação é irreversível.`;
  if (!confirm(confirmMsg)) {
    return;
  }

  try {
    await itemStore.Deleteitem(id);
    // atualiza a UI local imediatamente
    localItems.value = localItems.value.filter(i => getItemId(i) !== id);

    // sincroniza as stores (atualiza listas globais)
    await itemStore.GetAll();
    await recebimentoStore.GetAll();

    // opcional: se quiser atualizar o recebimento atual (se ainda existir), tenta recarregar do backend
    if (props.recebimento?.id) {
      try {
        const updated = await recebimentoStore.GetById(props.recebimento.id);
        // atualiza localItems a partir do recebimento atualizado
        localItems.value = (updated.itemPlanejamentos ?? []).map((i: any) => ({ ...i }));
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.error('Erro ao apagar item:', err);
    alert('Falha ao remover item. Veja o console para mais detalhes.');
  }
}

</script>

<style scoped>
.text-h6 {
  font-weight: 600;
}
.subtitle-2 {
  color: rgba(0,0,0,0.6);
  font-size: 0.9rem;
}
</style>
