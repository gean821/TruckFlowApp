<template>
  <v-dialog v-model="internalModel" max-width="600">
    <v-card>
      <v-card-title>{{ isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor' }}</v-card-title>
      <v-card-text>
        <v-text-field 
          v-model="form.nome"
          label="Razão Social / Nome"
          variant="outlined" 
          :rules="[rules.required]"
        />
        <v-text-field 
          v-model="form.cnpj"
          label="CNPJ"
          variant="outlined"
          placeholder="00.000.000/0000-00"
          :rules="[rules.required, rules.cnpj]"
          maxlength="18" 
          @input="mascaraCnpj"
        />

      </v-card-text>
      <v-card-actions>
        <v-btn 
          text="Cancelar"
          color="red"
          @click="close" 
          variant="flat"
          rounded="lg"
        />
        <v-spacer />
        <v-btn 
          color="blue"
          text="Salvar"
          @click="save" 
          variant="flat"
          rounded="lg"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { FornecedorResponse } from '@/entities/fornecedor.types';
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  isEditing: boolean
  fornecedor?: FornecedorResponse
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'salvar', fornecedor: FornecedorResponse): void
}>()

const form = ref<FornecedorResponse>({
  id: props.fornecedor?.id,
  nome: props.fornecedor?.nome ?? '',
  cnpj: props.fornecedor?.cnpj ?? '',
  produtos: props.fornecedor?.produtos ?? []
})

const internalModel = ref(props.modelValue)

watch(() => props.modelValue, val => (internalModel.value = val))
watch(() => internalModel.value, val => emit('update:modelValue', val))


watch(() => props.fornecedor, (val) => {
  form.value = val
    ? { ...val }
    : { id: undefined,
       nome: '',
       cnpj: '',
       produtos: [] 
      }
})

function mascaraCnpj(e: any) {
  let v = form.value.cnpj || '';
  v = v.replace(/\D/g, ""); 
  v = v.replace(/^(\d{2})(\d)/, "$1.$2"); 
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2"); 
  v = v.replace(/(\d{4})(\d)/, "$1-$2");
  form.value.cnpj = v;
}

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  cnpj: (v: string) => v.replace(/\D/g, '').length === 14 || 'CNPJ inválido (14 dígitos)'
};

function save() {
  const payload = {
    ...form.value,
    cnpj: form.value.cnpj?.replace(/\D/g, '')
  };
  
  if(!payload.nome || !payload.cnpj || payload.cnpj.length !== 14) {
    alert("Preencha os campos corretamente.");
    return;
  }

  emit('salvar', payload)
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>
