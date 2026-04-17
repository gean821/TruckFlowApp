<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-card
      class="w-100 rounded-xl"
      max-width="900"
      elevation="2"
      :loading="isCreating"
    >
      <div class="bg-primary px-6 py-4 d-flex align-center">
        <v-icon size="32" class="mr-4 text-white">mdi-calendar-clock</v-icon>
        <div>
          <h2 class="text-h6 font-weight-bold text-white">
            Nova Grade de Recebimento
          </h2>
          <div class="text-subtitle-2 text-blue-lighten-4">
            Defina horários e regras para agendamento
          </div>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="cadastrar" class="pa-6">
        <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">
          DADOS OPERACIONAIS
        </div>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="formModelGrade.fornecedorId"
              :items="fornecedorStore.fornecedores"
              item-title="nome"
              item-value="id"
              label="Fornecedor"
              placeholder="Selecione..."
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
            >
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-domain</v-icon>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="formModelGrade.produtoId"
              :items="produtoStore.produtos"
              item-title="nome"
              item-value="id"
              label="Produto"
              placeholder="Tipo de carga"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
            >
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-package-variant</v-icon>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="formModelGrade.localDescargaId"
              :items="locais"
              item-title="nome"
              item-value="id"
              label="Local de Descarga"
              placeholder="Selecione a doca"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
            >
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-warehouse</v-icon>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>
        <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">
          VIGÊNCIA E HORÁRIOS
        </div>

        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModelGrade.dataInicio"
              type="date"
              label="Início da Vigência"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
              :min="hoje"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModelGrade.dataFim"
              type="date"
              label="Fim da Vigência"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
              :min="formModelGrade.dataInicio || hoje"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formModelGrade.horaInicial"
              type="time"
              label="Abertura"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
            >
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-clock-start</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formModelGrade.horaFinal"
              type="time"
              label="Fechamento"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
              :hint="isCrossDay ? 'Passa da meia-noite (vira o dia)' : undefined"
              persistent-hint
            >
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-clock-end</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="formModelGrade.intervaloMinutos"
              :items="intervalos"
              label="Intervalo (min)"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              class="mb-3"
            >
              <template v-slot:prepend-inner>
                <v-icon size="small" color="grey">mdi-timer-sand</v-icon>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <div class="mt-2">
          <label class="text-caption font-weight-bold ml-1 text-grey-darken-1"
            >DIAS DE OPERAÇÃO</label
          >
          <v-btn-toggle
            v-model="diasSelecionados"
            multiple
            variant="outlined"
            divided
            color="primary"
            class="d-flex flex-wrap w-100 mt-1 rounded-lg overflow-hidden border-opacity-50"
          >
            <v-btn
              v-for="dia in diasOpcoes"
              :key="dia.value"
              :value="dia.value"
              :disabled="!diasNoRange.has(dia.value)"
              class="flex-grow-1 text-caption font-weight-bold"
              :class="{ 'text-error': dia.value === '0' }"
            >
              {{ dia.label }}
            </v-btn>
          </v-btn-toggle>
          <div class="text-caption text-grey mt-1 ml-1" v-if="rangeInvalido">
            Defina início e fim da vigência para habilitar os dias.
          </div>
        </div>

        <v-alert
          v-if="preview.total > 0"
          class="mt-5"
          type="info"
          variant="tonal"
          density="comfortable"
          border="start"
          icon="mdi-calendar-check"
        >
          <div class="d-flex align-center justify-space-between flex-wrap ga-2">
            <div>
              <div class="font-weight-bold text-body-1">
                {{ preview.total }} vaga{{ preview.total > 1 ? "s" : "" }} serão geradas
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ preview.diasAtivos }} dia{{ preview.diasAtivos > 1 ? "s" : "" }} operados
                × {{ preview.slotsPorDia }} slot{{ preview.slotsPorDia > 1 ? "s" : "" }}
                de {{ formModelGrade.intervaloMinutos }} min
                <span v-if="isCrossDay"> · janela cruza a meia-noite</span>
              </div>
            </div>
            <v-chip size="small" color="primary" variant="flat">
              {{ preview.janelaLabel }}
            </v-chip>
          </div>
        </v-alert>

        <v-alert
          v-else-if="temJanela && diasSelecionados.length === 0"
          class="mt-5"
          type="info"
          variant="tonal"
          density="comfortable"
          border="start"
          icon="mdi-gesture-tap"
        >
          Selecione ao menos um dia de operação para gerar as vagas.
        </v-alert>

        <v-alert
          v-else-if="temJanela && preview.diasAtivos === 0"
          class="mt-5"
          type="warning"
          variant="tonal"
          density="comfortable"
          border="start"
          icon="mdi-alert-outline"
        >
          Os dias selecionados não ocorrem no range de vigência escolhido.
        </v-alert>

        <div class="d-flex justify-end mt-8">
          <v-btn
            color="primary"
            size="large"
            rounded="lg"
            type="submit"
            :loading="isCreating"
            :disabled="preview.total === 0"
            class="px-8 text-capitalize font-weight-bold"
            elevation="2"
          >
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
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useFornecedorStore } from "@/stores/FornecedorStore";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { useToastStore } from "@/stores/ToastStore";
import { useLocalDescargaStore } from "@/stores/LocalDescargaStore";
import { useGrade } from "@/hooks/useGrade";
import { parseISO, getDay, format } from "date-fns";
import type { GradeCreateDto } from "@/entities/grade.types";

const produtoStore = useProdutoStore();
const descargaStore = useLocalDescargaStore();
const fornecedorStore = useFornecedorStore();
const toast = useToastStore();

const locais = computed(() => descargaStore.locais);

const { createGrade, isCreating } = useGrade();

const diasSelecionados = ref<string[]>([]);
const intervalos = [10, 15, 20, 30, 45, 60, 90, 120];

const diasOpcoes = [
  { value: "1", label: "Seg" },
  { value: "2", label: "Ter" },
  { value: "3", label: "Qua" },
  { value: "4", label: "Qui" },
  { value: "5", label: "Sex" },
  { value: "6", label: "Sáb" },
  { value: "0", label: "Dom" },
];

const hoje = format(new Date(), "yyyy-MM-dd");

const formModelGrade = reactive<GradeCreateDto>({
  fornecedorId: "",
  produtoId: "",
  localDescargaId: "",
  dataInicio: "",
  dataFim: "",
  horaInicial: "",
  horaFinal: "",
  intervaloMinutos: 30,
  diasSemana: "",
});

onMounted(async () => {
  try {
    await Promise.all([
      produtoStore.getAll(),
      fornecedorStore.fetchAll(),
      descargaStore.fetchAll(),
    ]);
  } catch {
    toast.notify("Erro ao carregar dados iniciais.", "error");
  }
});

const rangeInvalido = computed(() => {
  const { dataInicio, dataFim } = formModelGrade;
  if (!dataInicio || !dataFim) {
    return true;
  }   

  return parseISO(dataFim) < parseISO(dataInicio);
});

const diasNoRange = computed(() => {
  const set = new Set<string>();
  const { dataInicio, dataFim } = formModelGrade;
  
  if (!dataInicio || !dataFim) {
    return set;
  } 

  const ini = parseISO(dataInicio);
  const fim = parseISO(dataFim);
  
  if (fim < ini) {
    return set;
  } 

  const totalDias = Math.floor((fim.getTime() - ini.getTime()) / 86400000) + 1;
  const limite = Math.min(totalDias, 7);

  for (let i = 0; i < limite; i++) {
    const d = new Date(ini);
    d.setDate(ini.getDate() + i);
    set.add(String(d.getDay()));
  }

  return set;
});

watch(diasNoRange, (novosDias) => {
  diasSelecionados.value = diasSelecionados.value.filter((d) => novosDias.has(d));
});

const temJanela = computed(
  () =>
    !!formModelGrade.horaInicial &&
    !!formModelGrade.horaFinal &&
    formModelGrade.horaInicial !== formModelGrade.horaFinal
);

const isCrossDay = computed(() => {
  if (!temJanela.value) {
    return false;
  } 

  return formModelGrade.horaFinal < formModelGrade.horaInicial;
});

function minutosDaJanela(): number {
  if (!temJanela.value) {
    return 0;
  } 
  
  const [hi, mi] = formModelGrade.horaInicial.split(":").map(Number);
  const [hf, mf] = formModelGrade.horaFinal.split(":").map(Number);
  let diff = hf * 60 + mf - (hi * 60 + mi);
  if (diff <= 0) diff += 24 * 60;
  return diff;
}

const preview = computed(() => {
  const intervalo = Number(formModelGrade.intervaloMinutos) || 0;
  const minutos = minutosDaJanela();
  const slotsPorDia = intervalo > 0 ? Math.floor(minutos / intervalo) : 0;

  if (!formModelGrade.dataInicio || !formModelGrade.dataFim || rangeInvalido.value) {
    return { total: 0, diasAtivos: 0, slotsPorDia, janelaLabel: "" };
  }

  const ini = parseISO(formModelGrade.dataInicio);
  const fim = parseISO(formModelGrade.dataFim);
  const diasSelecionadosSet = new Set(diasSelecionados.value);

  let diasAtivos = 0;
  const cursor = new Date(ini);
  while (cursor <= fim) {
    if (diasSelecionadosSet.has(String(cursor.getDay()))) diasAtivos++;
    cursor.setDate(cursor.getDate() + 1);
  }

  const janelaLabel = temJanela.value
    ? `${formModelGrade.horaInicial} → ${formModelGrade.horaFinal}${isCrossDay.value ? " (+1d)" : ""}`
    : "";

  return {
    total: diasAtivos * slotsPorDia,
    diasAtivos,
    slotsPorDia,
    janelaLabel,
  };
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

  if (preview.value.total === 0) {
    toast.notify("A combinação atual não gera nenhuma vaga.", "warning");
    return;
  }

  formModelGrade.diasSemana = diasSelecionados.value.join(",");

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
