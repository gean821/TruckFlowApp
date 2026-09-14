<template>
  <v-dialog v-model="internalValue" max-width="450" persistent>
    <v-card class="rounded-xl pa-4">

      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3">Registrar Entrada</h3>
          <span class="text-caption text-grey">Lançamento manual de carga</span>
        </div>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="close"></v-btn>
      </div>

      <div class="bg-blue-grey-lighten-5 pa-4 rounded-lg mb-5 border border-blue-grey-lighten-4">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-caption font-weight-bold text-blue-grey-darken-1">PRODUTO</span>
          <v-chip size="x-small" color="blue-grey" variant="flat" class="font-weight-bold">
            {{ item?.produto }}
          </v-chip>
        </div>

        <div class="d-flex justify-space-between text-body-2 text-grey-darken-3 mb-1">
          <span>Meta: {{ item?.quantidadeTotalPlanejada }} T</span>
          <span>Recebido: <strong>{{ item?.quantidadeTotalRecebida }} T</strong></span>
        </div>

        <v-progress-linear :model-value="(item?.quantidadeTotalRecebida / item?.quantidadeTotalPlanejada) * 100"
          color="success" height="6" rounded bg-color="white"></v-progress-linear>
        <div class="text-right text-caption text-grey-darken-1 mt-1">
          Falta: {{ (item?.quantidadeTotalPlanejada - item?.quantidadeTotalRecebida).toFixed(2) }} T
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="confirmar">
        <v-text-field v-model.number="form.quantidade" label="Quantidade Chegada (Ton)" type="number" variant="outlined"
          density="comfortable" color="primary" autofocus class="mb-2" placeholder="Ex: 32.5" suffix="Ton"
          :rules="[rules.required, rules.positive]">
          <template v-slot:prepend-inner>
            <v-icon size="small" color="grey">mdi-weight-kilogram</v-icon>
          </template>
        </v-text-field>

        <v-textarea v-model="form.observacao" label="Observação / Nº Nota Fiscal" variant="outlined"
          density="comfortable" rows="3" color="primary" placeholder="Ex: Entrega avulsa NF 550..."
          hide-details></v-textarea>

        <div class="d-flex gap-3 justify-end mt-6">
          <v-btn variant="text" color="grey-darken-1" @click="close" class="text-capitalize">Cancelar</v-btn>

          <v-btn color="primary" type="submit" :loading="loading" class="px-6 text-capitalize elevation-1">
            Confirmar Entrada
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type ItemPlanejamento from '@/entities/ItemPlanejamento';
import { ref, computed, reactive, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  item: ItemPlanejamento; // O objeto do item que vem da lista
  loading?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const form = reactive({
  quantidade: null as number | null,
  observacao: ''
});

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  positive: (v: number) => v > 0 || 'Deve ser maior que zero'
};

// Limpa o form quando o modal abre
watch(() => props.modelValue, (val) => {
  if (val) {
    form.quantidade = null;
    form.observacao = '';
  }
});

function close() {
  internalValue.value = false;
}

function confirmar() {
  if (!form.quantidade || form.quantidade <= 0) return;

  emit('confirm', {
    itemId: props.item.id,
    quantidade: form.quantidade,
    observacao: form.observacao
  });
}
</script>