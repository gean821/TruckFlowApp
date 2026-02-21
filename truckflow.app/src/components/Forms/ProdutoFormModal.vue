<template>
  <v-dialog v-model="internalOpen" max-width="550" persistent>
    <v-card class="pa-4" rounded="xl">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 font-weight-bold">{{ isEdit ? "Editar Produto" : "Novo Produto" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submit">
          <v-row>
            <v-col cols="12">
              <p class="text-overline text-primary mb-1">Identificação</p>
              <v-text-field
                v-model="form.nome"
                label="Nome do Produto"
                variant="outlined"
                density="comfortable"
                placeholder="Ex: Farelo de Soja"
                :rules="[rules.required, rules.min3]"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.codigoEan"
                label="Código EAN / SKU"
                variant="outlined"
                density="comfortable"
                placeholder="Opcional"
                prepend-inner-icon="mdi-barcode-scan"
              />
            </v-col>

            <v-col cols="12">
              <p class="text-overline text-primary mb-1">Logística</p>
              <v-select
                v-model="form.localDescargaId"
                :items="localStore.locais"
                item-title="nome"
                item-value="id"
                label="Local de Descarga Padrão"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                :loading="localStore.loading"
              >
                <template v-slot:prepend-inner>
                  <v-icon size="20" color="primary">mdi-tray-arrow-down</v-icon>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" color="grey-darken-1" @click="close" class="text-none">Cancelar</v-btn>
        <v-btn 
          color="primary" 
          variant="flat" 
          @click="submit" 
          class="px-8 text-none" 
          rounded="lg"
          :loading="submitting"
        >
          {{ isEdit ? "Salvar Alterações" : "Cadastrar Produto" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useLocalDescargaStore } from '@/stores/LocalDescargaStore';

const props = defineProps<{ open: boolean; initialData?: any }>();
const emit = defineEmits(["close", "submit"]);

const localStore = useLocalDescargaStore();
const formRef = ref<any>(null);
const submitting = ref(false);

const internalOpen = computed(() => props.open);
const isEdit = computed(() => !!props.initialData);

const form = reactive({
  nome: "",
  localDescargaId: "",
  codigoEan: ""
});

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  min3: (v: string) => v.length >= 3 || 'Mínimo de 3 caracteres'
};

onMounted(() => {
  if (localStore.locais.length === 0) localStore.fetchAll();
});

watch(() => props.initialData, (val) => {
  if (val) {
    Object.assign(form, {
      nome: val.nome,
      localDescargaId: val.localDescargaId,
      codigoEan: val.codigoEan || ""
    });
  } else {
    Object.assign(form, { nome: "", localDescargaId: "", codigoEan: "" });
  }
}, { immediate: true });

const close = () => emit("close");

async function submit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  submitting.value = true;
  try {
    emit("submit", { ...form });
  } finally {
    submitting.value = false;
  }
}
</script>