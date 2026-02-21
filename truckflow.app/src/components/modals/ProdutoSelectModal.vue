<template>
  <v-dialog v-model="internalOpen" max-width="500" persistent>
    <v-card class="pa-4" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-bold">Vincular Produto</span>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <div class="mb-4 text-body-2 text-medium-emphasis">
          Selecione um produto do catálogo para associar a este fornecedor.
        </div>
        
        <v-select
          v-model="produtoSelecionado"
          :items="produtos"
          item-title="nome"
          item-value="id"
          label="Produto"
          placeholder="Selecione um produto..."
          variant="outlined"
          density="comfortable"
          rounded="lg"
          hide-details
          no-data-text="Nenhum produto disponível"
        >
          <template v-slot:prepend-inner>
            <v-icon color="primary">mdi-package-variant-closed</v-icon>
          </template>
        </v-select>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          color="grey-darken-1"
          class="text-none px-4"
          @click="close"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="text-none px-8"
          rounded="lg"
          :disabled="!produtoSelecionado"
          @click="vincular"
        >
          Confirmar Vínculo
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ProdutoResponse } from '@/Entities/produto.types';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { ref, computed } from 'vue';
const {produtos} = useProdutoStore();

const props = defineProps<{
  produtos: ProdutoResponse[];
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'vincular', produtoId: string): void;
}>();

const produtoSelecionado = ref<string | null>(null);

const internalOpen = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val);
  }
});

function close() {
  internalOpen.value = false;
  produtoSelecionado.value = null;
}

function vincular() {
  if (produtoSelecionado.value) {
    emit('vincular', produtoSelecionado.value);
    close();
  }
}
</script>