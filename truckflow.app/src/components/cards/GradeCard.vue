<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-card class="w-100 rounded-xl" max-width="900" elevation="2" :loading="isCreating">

      <div class="bg-primary px-6 py-4 d-flex align-center">
        <v-icon size="32" class="mr-4 text-white">mdi-calendar-clock</v-icon>
        <div>
          <h2 class="text-h6 font-weight-bold text-white">Nova Grade de Recebimento</h2>
          <div class="text-subtitle-2 text-blue-lighten-4">
            Defina horários e regras para agendamento
          </div>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="cadastrar" class="pa-6">

        <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">DADOS OPERACIONAIS</div>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-autocomplete v-model="formModelGrade.fornecedorId" :items="fornecedorStore.fornecedores"
              item-title="nome" item-value="id" label="Fornecedor" placeholder="Selecione..." variant="outlined"
              density="comfortable" color="primary" hide-details="auto" class="mb-3">
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-domain</v-icon>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-select v-model="formModelGrade.produtoId" :items="produtoStore.produtos" item-title="nome"
              item-value="id" label="Produto" placeholder="Tipo de carga" variant="outlined" density="comfortable"
              color="primary" hide-details="auto" class="mb-3">
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-package-variant</v-icon>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-select v-model="formModelGrade.localDescargaId" :items="locais" item-title="nome" item-value="id"
              label="Local de Descarga" placeholder="Selecione a doca" variant="outlined" density="comfortable"
              color="primary" hide-details="auto" class="mb-3">
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-warehouse</v-icon>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>
        <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">VIGÊNCIA E HORÁRIOS</div>

        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field v-model="formModelGrade.dataInicio" type="date" label="Início da Vigência" variant="outlined"
              density="comfortable" color="primary" hide-details="auto" class="mb-3" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formModelGrade.dataFim" type="date" label="Fim da Vigência" variant="outlined"
              density="comfortable" color="primary" hide-details="auto" class="mb-3" />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field v-model="formModelGrade.horaInicial" type="time" label="Abertura" variant="outlined"
              density="comfortable" color="primary" hide-details="auto" class="mb-3">
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-clock-start</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="formModelGrade.horaFinal" type="time" label="Fechamento" variant="outlined"
              density="comfortable" color="primary" hide-details="auto" class="mb-3">
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-clock-end</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="formModelGrade.intervaloMinutos" :items="intervalos" label="Intervalo (min)"
              variant="outlined" density="comfortable" color="primary" hide-details="auto" class="mb-3">
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-timer-sand</v-icon>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <div class="mt-2">
          <label class="text-caption font-weight-bold ml-1 text-grey-darken-1">DIAS DE OPERAÇÃO</label>
          <v-btn-toggle v-model="diasSelecionados" multiple variant="outlined" divided color="primary"
            class="d-flex flex-wrap w-100 mt-1 rounded-lg overflow-hidden border-opacity-50">
            <v-btn value="1" class="flex-grow-1 text-caption font-weight-bold">Seg</v-btn>
            <v-btn value="2" class="flex-grow-1 text-caption font-weight-bold">Ter</v-btn>
            <v-btn value="3" class="flex-grow-1 text-caption font-weight-bold">Qua</v-btn>
            <v-btn value="4" class="flex-grow-1 text-caption font-weight-bold">Qui</v-btn>
            <v-btn value="5" class="flex-grow-1 text-caption font-weight-bold">Sex</v-btn>
            <v-btn value="6" class="flex-grow-1 text-caption font-weight-bold">Sáb</v-btn>
            <v-btn value="0" class="flex-grow-1 text-caption font-weight-bold text-error">Dom</v-btn>
          </v-btn-toggle>
        </div>

        <div class="d-flex justify-end mt-8">
          <v-btn color="primary" size="large" rounded="lg" type="submit" :loading="isCreating"
            class="px-8 text-capitalize font-weight-bold" elevation="2">
            Gerar Vagas
            <template v-slot:append>
              <v-icon>mdi-check</v-icon>
            </template>
          </v-btn>
        </div>

      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useFornecedorStore } from '@/stores/FornecedorStore';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { useToastStore } from '@/stores/ToastStore';
import { useLocalDescargaStore } from '@/stores/LocalDescargaStore';
import { useGrade } from '@/hooks/useGrade2';
import { parseISO, getDay } from 'date-fns';
import type { GradeCreateDto } from '@/entities/grade.types';

const produtoStore = useProdutoStore();
const descargaStore = useLocalDescargaStore();
const fornecedorStore = useFornecedorStore();
const toast = useToastStore();

const locais = computed(() => descargaStore.locais);

const { createGrade, isCreating } = useGrade();

const diasSelecionados = ref<string[]>([]);
const intervalos = [10, 15, 20, 30, 45, 60, 90, 120];

const formModelGrade = reactive<GradeCreateDto>({
  fornecedorId: '',
  produtoId: '',
  localDescargaId: '',
  dataInicio: '',
  dataFim: '',
  horaInicial: '',
  horaFinal: '',
  intervaloMinutos: 30,
  diasSemana: '',
});

onMounted(async () => {
  try {
    await Promise.all([
      produtoStore.getAll(),
      fornecedorStore.fetchAll(),
      descargaStore.fetchAll(),
    ]);
  } catch {
    toast.notify('Erro ao carregar dados iniciais.', 'error');
  }
});

async function cadastrar() {
  if (diasSelecionados.value.length === 0) {
    toast.notify("Selecione pelo menos um dia de operação.", "warning");
    return;
  }

  if (
    !formModelGrade.fornecedorId ||
    !formModelGrade.produtoId ||
    !formModelGrade.localDescargaId
  ) {
    toast.notify("Preencha todos os campos obrigatórios.", "warning");
    return;
  }

  formModelGrade.diasSemana = diasSelecionados.value.join(',');

  await createGrade({ ...formModelGrade });

  diasSelecionados.value = [];
}

watch(
  () => [formModelGrade.dataInicio, formModelGrade.dataFim],
  ([inicio, fim]) => {
    if (inicio && fim && inicio === fim) {
      const diaDaSemana = getDay(parseISO(inicio));
      diasSelecionados.value = [diaDaSemana.toString()];
      toast.notify("Dia selecionado automaticamente com base na data.", "info");
    }
  }
);
</script>