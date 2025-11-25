<template>
  <v-dialog v-model="internalModel" max-width="600">
    <v-card>
      <v-card-title>{{ isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor' }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.nome" label="Nome do fornecedor" variant="outlined" />
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
          color="green"
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
import { ref, watch } from 'vue'
import type IFornecedor from '@/Entities/IFornecedor'

const props = defineProps<{
  modelValue: boolean
  isEditing: boolean
  fornecedor?: IFornecedor
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'salvar', fornecedor: IFornecedor): void
}>()

const form = ref<IFornecedor>({
  id: props.fornecedor?.id,
  nome: props.fornecedor?.nome ?? '',
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
      produtos: [] 
    }
})

function save() {
  emit('salvar', form.value)
  emit('update:modelValue', false)
}

function close() {
  emit('update:modelValue', false)
}
</script>
