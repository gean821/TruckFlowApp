<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card
      rounded="lg"
      :title="isEditing ? 'Editar produto' : 'Novo produto'"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formModel.nome"
              label="Nome do produto"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formModel.localDescargaId"
              :items="locais"
              label="Local de descarga"
              item-title="nome"
              item-value="id"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>
      </template>

      <v-divider />

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancelar" color="red" @click="fechar" />
        <v-spacer />
        <v-btn text="Salvar" color="blue" @click="salvar" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type IProduto from "@/Entities/IProduto";

const props = defineProps<{
  modelValue: boolean;
  isEditing: boolean;
  produto: IProduto;
  locais: Array<any>
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "salvar", value: IProduto): void;
}>();

const dialog = ref(props.modelValue);
const formModel = ref<IProduto>({ ...props.produto });

watch(() => props.modelValue, val => (dialog.value = val));
watch(() => dialog.value, val => emit("update:modelValue", val));
watch(() => props.produto, val => (formModel.value = { ...val }));

function salvar() {
  emit("salvar", formModel.value);
  emit("update:modelValue", false);
}

function fechar() {
  emit("update:modelValue", false);
}
</script>
