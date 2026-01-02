<template>
   <v-dialog 
    v-model="model" 
    max-width="500"
    max-height="500"
   >

  <v-card
    rounded="lg"
    elevation="5"  
  >
    <v-card-title>Vincular produto existente</v-card-title>

    <v-select
      label="Selecione um produto"
      :items="produtos"
      item-title="nome"
      item-value="id"
      v-model="produtoSelecionado"
    />

    <v-card-actions class="d-flex justify-space-between">
      <v-btn 
        @click="vincularProduto"
        :disabled="!produtoSelecionado"
        color="blue"
        variant="flat"

      >
        Vincular
      </v-btn>

      <v-btn
         @click="model = false"
         color="red"
         variant="flat"
        >
         Cancelar
      </v-btn>

    </v-card-actions>
  </v-card>
</v-dialog>

</template>


<script setup lang="ts">
import type IProduto from '@/entities/IProduto';
import {ref, computed} from 'vue';

const props = defineProps<{
    produtos: IProduto[],
    modelValue: boolean
}>();


const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'vincular', produtoId: string): void;
}>();


const produtoSelecionado = ref<string | null>(null);

async function vincularProduto() {
    if (produtoSelecionado.value) {
      emit('vincular', produtoSelecionado.value);
      model.value = false;
      produtoSelecionado.value = null;
    }
}

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

</script>