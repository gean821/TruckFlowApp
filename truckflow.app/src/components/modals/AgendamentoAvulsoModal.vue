<template>
  <v-dialog v-model="isOpen" max-width="850px" persistent scrollable>
    <v-card class="rounded-xl overflow-hidden">
      <v-card-title
        class="bg-primary text-white pa-4 d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-3" size="28">mdi-calendar-plus</v-icon>
          <span class="text-h6 font-weight-bold">Novo Agendamento Avulso</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="white"
          density="comfortable"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="submit" ref="formRef" id="agendamento-form">
          <div
            class="text-overline text-primary font-weight-bold mb-3 d-flex align-center"
          >
            <v-icon size="small" class="mr-2">mdi-package-variant</v-icon>
            Informações da Carga
          </div>

          <v-row dense>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="form.fornecedorId"
                :items="fornecedores"
                item-title="nome"
                item-value="id"
                label="Fornecedor *"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="form.produtoId"
                :items="produtos"
                item-title="nome"
                item-value="id"
                label="Produto"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="form.localDescargaId"
                :items="locais"
                item-title="nome"
                item-value="id"
                label="Doca de Descarga *"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <div
            class="text-overline text-primary font-weight-bold mb-3 d-flex align-center"
          >
            <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
            Data e Horário
          </div>

          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="dataAvulsa"
                type="date"
                label="Data *"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="horaAvulsaInicio"
                type="time"
                label="Hora Início *"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.required]"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="horaAvulsaFim"
                type="time"
                label="Hora Fim *"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <div
            class="text-overline text-primary font-weight-bold mb-3 d-flex align-center"
          >
            <v-icon size="small" class="mr-2">mdi-truck-outline</v-icon>
            Dados do Veículo (Opcional)
          </div>

          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.placaVeiculo"
                label="Placa do Veículo"
                variant="outlined"
                density="comfortable"
                placeholder="ABC-1234"
                hide-details="auto"
                class="mb-2"
                v-maska="'AAA-NNNN'"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.tipoVeiculo"
                :items="opcoesTipoVeiculo"
                item-title="title"
                item-value="value"
                label="Tipo de Veículo"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
                clearable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="form.volumeCarga"
                type="number"
                label="Peso / Volume (kg)"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-2"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="grey-darken-2"
          class="text-none font-weight-medium"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="px-6 rounded-lg text-none font-weight-bold"
          type="submit"
          form="agendamento-form"
          :loading="loading"
        >
          Salvar Agendamento
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useAgendamento } from "@/hooks/useAgendamento";
import { useFornecedor } from "@/hooks/useFornecedor";
import { useProduto } from "@/hooks/useProdutos";
import { useLocalDescarga } from "@/hooks/useLocalDescarga";
import { TipoVeiculoLabels } from "@/utils/tipoVeiculoLabels";
import { useToastStore } from "@/stores/ToastStore";
import type CreateAgendamentoAdminDto from "@/Dtos/agendamento/agendamentoAdminCreate.dto";
import type { VForm } from "vuetify/components";

interface AgendamentoAvulsoProps {
  modelValue: boolean;
}

interface AgendamentoAvulsoEmits {
  (e: "update:modelValue", value: boolean): void;
  (e: "saved"): void;
}

interface AgendamentoFormState {
  fornecedorId: string | null;
  produtoId: string | null;
  localDescargaId: string | null;
  placaVeiculo: string;
  tipoVeiculo: number | null;
  volumeCarga: number;
  tipoCarga: number;
}

const props = defineProps<AgendamentoAvulsoProps>();
const emit = defineEmits<AgendamentoAvulsoEmits>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const { createAgendamento, isCreating } = useAgendamento();
const { fornecedores } = useFornecedor();
const { produtos } = useProduto();
const { locais } = useLocalDescarga();
const toast = useToastStore();

const formRef = ref<VForm | null>(null);
const loading = computed(() => isCreating.value);

const dataAvulsa = ref<string>("");
const horaAvulsaInicio = ref<string>("");
const horaAvulsaFim = ref<string>("");

const opcoesTipoVeiculo = computed(() => {
  return Object.entries(TipoVeiculoLabels).map(([key, value]) => ({
    title: value as string,
    value: Number(key),
  }));
});

const initialState: AgendamentoFormState = {
  fornecedorId: "",
  produtoId: "",
  localDescargaId: "",
  placaVeiculo: "",
  tipoVeiculo: null,
  volumeCarga: 0,
  tipoCarga: 1,
};

const form = reactive<AgendamentoFormState>({ ...initialState });

const rules = {
  required: (v: string | number | null | undefined) =>
    !!v || "Campo obrigatório",
};

watch(horaAvulsaInicio, (newVal) => {
  if (newVal && !horaAvulsaFim.value) {
    const [hours, minutes] = newVal.split(":");
    const nextHour = (Number(hours) + 1) % 24;
    horaAvulsaFim.value = `${String(nextHour).padStart(2, "0")}:${minutes}`;
  }
});

watch(isOpen, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

const resetForm = () => {
  Object.assign(form, initialState);
  dataAvulsa.value = "";
  horaAvulsaInicio.value = "";
  horaAvulsaFim.value = "";
  if (formRef.value) formRef.value.resetValidation();
};

const closeDialog = () => {
  isOpen.value = false;
};

const submit = async () => {
  const validation = await formRef.value?.validate();
  if (!validation?.valid) {
    return;
  }

  try {
    if (!form.fornecedorId || !form.localDescargaId) {
      toast.notify("Fornecedor e Doca são obrigatórios.", "warning");
      return;
    }

    const payload: CreateAgendamentoAdminDto = {
      fornecedorId: form.fornecedorId,
      localDescargaId: form.localDescargaId,
      produtoId: form.produtoId ?? "",
      placaVeiculo: form.placaVeiculo || undefined,
      tipoVeiculo: form.tipoVeiculo ?? undefined,
      volumeCarga: form.volumeCarga,
      tipoCarga: form.tipoCarga,
      dataInicio: new Date(
        `${dataAvulsa.value}T${horaAvulsaInicio.value}:00`,
      ).toISOString(),
      dataFim: new Date(
        `${dataAvulsa.value}T${horaAvulsaFim.value}:00`,
      ).toISOString(),
      motoristaId: undefined,
      notaFiscalId: undefined,
    };

    await createAgendamento(payload);
    emit("saved");
    closeDialog();
  } catch (error: unknown) {
    console.error(error);
    const err = error as { response?: { data?: { message?: string } } };
    toast.notify(
      err?.response?.data?.message || "Erro ao criar agendamento.",
      "error",
    );
  }
};
</script>
