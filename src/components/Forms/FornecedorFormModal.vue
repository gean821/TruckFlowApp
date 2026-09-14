<template>
  <v-dialog v-model="internalOpen" max-width="600" persistent>
    <v-card class="pa-4" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-bold">{{ isEdit ? "Editar Fornecedor" : "Novo Fornecedor" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <v-form ref="formRef">
          <v-row>
            <v-col cols="12">
              <p class="text-overline text-primary mb-1">Dados Jurídicos</p>
              <v-text-field
                v-model="form.nome"
                label="Razão Social / Nome Fantasia"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="form.cnpj"
                label="CNPJ"
                variant="outlined"
                density="comfortable"
                placeholder="00.000.000/0000-00"
                v-maska="'##.###.###/####-##'"
                :rules="[rules.required, rules.cnpj]"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" color="grey-darken-1" @click="close">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="submit" class="px-8" rounded="lg">
          {{ isEdit ? "Salvar Alterações" : "Cadastrar" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { FornecedorCreateDto } from '@/entities/fornecedor.types';
import { ref, reactive, computed, watch } from 'vue';

const props = defineProps<{ open: boolean; initialData?: any }>();
const emit = defineEmits(["close", "submit"]);

const formRef = ref<any>(null);
const internalOpen = computed(() => props.open);
const isEdit = computed(() => !!props.initialData);

const form = reactive<FornecedorCreateDto>({ nome: "", cnpj: "" });

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  cnpj: (v: string) => v?.replace(/\D/g, '').length === 14 || 'CNPJ inválido'
};

watch(() => props.initialData, (val) => {
  if (val) {
    Object.assign(form, val);
  } 
  else {
    Object.assign(form, { nome: "", cnpj: "" });
  } 
}, { immediate: true });

const close = () => emit("close");

async function submit() {
  const { valid } = await formRef.value.validate();
  if (valid) {
    emit("submit", { ...form, cnpj: form.cnpj.replace(/\D/g, '') });
  } 
}
</script>