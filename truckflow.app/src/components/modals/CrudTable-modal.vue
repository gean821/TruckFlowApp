<template>
    <v-dialog v-model="internalModel" max-width="500">
        <v-card rounded="lg" :title="`${isEditing ? 'Editar' : 'Novo'}`">
            <template #text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="internalValue" :label="label" variant="outlined" />
                    </v-col>
                </v-row>
            </template>

            <v-divider />

            <v-card-actions class="bg-surface-light">
                <v-btn text="Cancelar" color="red" @click="close" />
                <v-spacer />
                <v-btn text="Salvar" color="blue" @click="salvar" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue: boolean
    value?: string
    label?: string
    isEditing?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'salvar', value: string): void
}>()

const internalModel = ref(props.modelValue)
const internalValue = ref(props.value ?? '')

watch(() => props.modelValue, val => (internalModel.value = val))
watch(() => internalModel.value, val => emit('update:modelValue', val))
watch(() => props.value, val => (internalValue.value = val ?? ''))

function salvar() {
    emit('salvar', internalValue.value)
    emit('update:modelValue', false)
}

function close() {
    emit('update:modelValue', false)
}
</script>
