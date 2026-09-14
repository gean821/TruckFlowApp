<template>
  <v-dialog v-model="internalOpen" max-width="700" persistent>
    <v-card class="pa-4" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-bold">{{ isEdit ? "Editar Unidade" : "Nova Unidade" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submit">
          <v-row>
            <v-col cols="12">
              <p class="text-overline text-primary mb-1">Informações Básicas</p>
              <v-text-field v-model="form.nome" label="Nome da Unidade" variant="outlined" density="comfortable"
                placeholder="Ex: Galpão Central" />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="form.cep" label="CEP" variant="outlined" density="comfortable"
                v-maska="'#####-###'" @update:model-value="handleCepChange" :loading="loadingCep"
                append-inner-icon="mdi-magnify" />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="form.localizacao" label="Apelido/Localização" variant="outlined"
                density="comfortable" />
            </v-col>

            <v-col cols="12" sm="9">
              <v-text-field v-model="form.logradouro" label="Logradouro" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" sm="3">
              <v-text-field v-model="form.numero" label="Nº" variant="outlined" density="comfortable" />
            </v-col>

            <v-col cols="12" sm="8">
              <v-text-field v-model="form.cidade" label="Cidade" variant="outlined" density="comfortable" readonly />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field v-model="form.estado" label="UF" variant="outlined" density="comfortable" readonly />
            </v-col>

            <v-col cols="12" sm="6">
              <v-select v-model="form.ativa" :items="statusOptions" item-title="text" item-value="value"
                label="Status da Unidade" variant="outlined" density="comfortable" rounded="lg">
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-badge :color="item.raw.value ? 'success' : 'error'" dot inline class="mr-2" />
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" color="grey-darken-1" @click="close" class="text-none">Cancelar</v-btn>
        <v-btn color="primary" variant="flat" @click="submit" class="px-8 text-none" rounded="lg">
          {{ isEdit ? "Salvar Alterações" : "Criar Unidade" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { UnidadeEntregaCreateDto } from '@/entities/unidadeEntrega.types';
import { fetchAddressByCep } from '@/shared/services/adress.service';
import { ref, reactive, computed, watch } from 'vue';

const props = defineProps<{ open: boolean; initialData?: any }>();
const emit = defineEmits(["close", "submit"]);

const loadingCep = ref(false);
const internalOpen = computed(() => props.open);

const form = reactive<UnidadeEntregaCreateDto>({
  nome: "",
  cep: "",
  localizacao: "",
  logradouro: "",
  numero: "",
  cidade: "",
  estado: "",
  ativa: false
})

const statusOptions = [
  { text: 'ATIVA', value: true },
  { text: 'INATIVA', value: false }
];


const isEdit = computed(() => !!props.initialData);

const handleCepChange = async (val: string) => {
  if (val.replace(/\D/g, '').length === 8) {
    loadingCep.value = true;
    const addr = await fetchAddressByCep(val);
    if (addr) {
      form.logradouro = addr.logradouro;
      form.cidade = addr.localidade;
      form.estado = addr.uf;
    }
    loadingCep.value = false;
  }
};

watch(() => props.initialData, (val) => {
  if (val) {
    Object.assign(form, val);
  }

  else {
    Object.assign(form, {
      nome: "", cep: "", localizacao: "",
      logradouro: "", numero: "",
      cidade: "", estado: "",
      ativa: true
    });
  }
}, { immediate: true });

const close = () => emit("close");
const submit = () => emit("submit", { ...form });
</script>