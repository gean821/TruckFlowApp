<template>
  <v-dialog v-model="internalOpen" max-width="550" persistent>
    <v-card class="pa-4" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-bold">{{ isEdit ? "Editar Local" : "Novo Local" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submit">
          <v-row>
            <v-col cols="12">
              <p class="text-overline text-primary mb-1">Configurações do Local</p>
              <v-text-field v-model="form.nome" label="Nome do Local (Ex: Doca 01)" variant="outlined"
                density="comfortable" :rules="[rules.required, rules.min3]" />
            </v-col>

            <v-col cols="12">
              <v-select v-model="form.unidadeEntregaId" :items="unidadeStore.unidades" item-title="nome" item-value="id"
                label="Unidade de Entrega" variant="outlined" density="comfortable" :rules="[rules.required]"
                :loading="unidadeStore.loading">
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="primary">mdi-office-building</v-icon>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select v-model="form.status" :items="statusOptions" item-title="text" item-value="value"
                label="Status do Local" variant="outlined" density="comfortable" rounded="lg">
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
        <v-btn color="primary" variant="flat" @click="submit" class="px-8 text-none" rounded="lg" :loading="submitting">
          {{ isEdit ? "Salvar Alterações" : "Criar Local" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useUnidadeEntregaStore } from '@/stores/UnidadeEntregaStore';
import type { CreateLocalDescargaDto } from '@/entities/localDescarga.types';

const props = defineProps<{ open: boolean; initialData?: any }>();
const emit = defineEmits(["close", "submit"]);

const unidadeStore = useUnidadeEntregaStore();
const formRef = ref<any>(null);
const submitting = ref(false);

const internalOpen = computed(() => props.open);
const isEdit = computed(() => !!props.initialData);

const form = reactive<CreateLocalDescargaDto>({
  nome: '',
  unidadeEntregaId: '',
  status: true
})

const statusOptions = [
  { text: 'ATIVA', value: true },
  { text: 'INATIVA', value: false }
];

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  min3: (v: string) => v.length >= 3 || 'Mínimo de 3 caracteres'
};

onMounted(() => {
  if (unidadeStore.unidades.length === 0) unidadeStore.fetchAll();
});

watch(() => props.initialData, (val) => {
  if (val) {
    form.nome = val.nome;
    form.unidadeEntregaId = val.unidadeEntregaId;
    form.status = val.status ?? false; 
  } else {
    form.nome = "";
    form.unidadeEntregaId = "";
    form.status = true;
  }

}, { immediate: true });
const close = () => emit("close");

async function submit() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }

  submitting.value = true;
  try {
    emit("submit", { ...form });
  } finally {
    submitting.value = false;
  }
}
</script>