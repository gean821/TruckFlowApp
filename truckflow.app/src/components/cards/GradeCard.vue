<template>
  <v-container class="pa-4 d-flex justify-center">
    <v-card class="pa-6 w-100" max-width="900" elevation="3" :loading="gradeStore.loading">
      <div class="d-flex align-center mb-4">
        <v-icon color="primary" size="large" class="mr-3">mdi-calendar-clock</v-icon>
        <div>
          <v-card-title class="text-h5 font-weight-bold pa-0">Nova Grade de Recebimento</v-card-title>
          <v-card-subtitle class="pa-0 pt-1">Configure as regras de disponibilidade para fornecedores</v-card-subtitle>
        </div>
      </div>

      <v-divider class="mb-6"></v-divider>

      <v-form ref="formRef" @submit.prevent="cadastrar">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="formModelGrade.fornecedorId"
              :items="fornecedorStore.fornecedores"
              item-title="nome"
              item-value="id"
              label="Fornecedor"
              prepend-inner-icon="mdi-domain"
              variant="outlined"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="formModelGrade.produtoId"
              :items="produtoStore.produtos"
              item-title="nome"
              item-value="id"
              label="Produto"
              prepend-inner-icon="mdi-package-variant"
              variant="outlined"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="formModelGrade.unidadeEntregaId"
              :items="unidades"
              item-title="nome"
              item-value="id"
              label="Unidade de Entrega (Doca)"
              prepend-inner-icon="mdi-warehouse"
              variant="outlined"
              color="primary"
            />
          </v-col>
        </v-row>

        <v-row dense class="mt-2">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModelGrade.dataInicio"
              type="date"
              label="Data Início (Vigência)"
              variant="outlined"
              color="primary"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModelGrade.dataFim"
              type="date"
              label="Data Fim (Vigência)"
              variant="outlined"
              color="primary"
            />
          </v-col>
        </v-row>

        <v-row dense class="mt-2">
          <v-col cols="12">
            <label class="text-caption font-weight-bold ml-1 text-grey-darken-1">Dias de Operação</label>
            <v-btn-toggle
              v-model="diasSelecionados"
              multiple
              variant="outlined"
              divided
              color="primary"
              class="d-flex flex-wrap w-100 mt-1"
            >
              <v-btn value="1" class="flex-grow-1">Seg</v-btn>
              <v-btn value="2" class="flex-grow-1">Ter</v-btn>
              <v-btn value="3" class="flex-grow-1">Qua</v-btn>
              <v-btn value="4" class="flex-grow-1">Qui</v-btn>
              <v-btn value="5" class="flex-grow-1">Sex</v-btn>
              <v-btn value="6" class="flex-grow-1">Sáb</v-btn>
              <v-btn value="0" class="flex-grow-1">Dom</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-row dense class="mt-4">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formModelGrade.horaInicial"
              type="time"
              label="Abertura"
              prepend-inner-icon="mdi-clock-start"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="formModelGrade.horaFinal"
              type="time"
              label="Fechamento"
              prepend-inner-icon="mdi-clock-end"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="formModelGrade.intervaloMinutos"
              :items="intervalos"
              label="Intervalo (min)"
              prepend-inner-icon="mdi-timer-sand"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div class="d-flex justify-end">
          <v-btn
            color="success"
            size="large"
            type="submit"
            :loading="gradeStore.loading"
            prepend-icon="mdi-check-circle"
          >
            Gerar Vagas de Agendamento
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useFornecedorStore } from '@/stores/FornecedorStore';
import { useGradeStore } from '@/stores/GradeStore';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { useUnidadeEntregaStore } from '@/stores/UnidadeEntregaStore';
import type gradeCreateDto from '@/Dtos/grade/gradeCreateDto';

const produtoStore = useProdutoStore();
const fornecedorStore = useFornecedorStore();
const unidadeStore = useUnidadeEntregaStore();
const gradeStore = useGradeStore();
const unidades = computed(() => unidadeStore.unidadeEntregas)

// Controle dos dias da semana (Array no front -> String no DTO)
const diasSelecionados = ref<string[]>([]);

const intervalos = [10, 15, 20, 30, 45, 60, 90, 120];

const formModelGrade = reactive<gradeCreateDto>({
  fornecedorId: '',
  produtoId: '',
  unidadeEntregaId: '',
  dataInicio: '',
  dataFim: '',
  horaInicial: '',
  horaFinal: '',
  intervaloMinutos: 30,
  diasSemana: '' // Será preenchido antes de enviar
});

onMounted(async () => {
  await Promise.all([
    produtoStore.GetAll(),
    fornecedorStore.GetAll(),
    unidadeStore.GetAll()
  ]);
});

async function cadastrar() {
  if (diasSelecionados.value.length === 0) {
    alert("Por favor, selecione os dias da semana de operação.");
    return;
  }

  formModelGrade.diasSemana = diasSelecionados.value.join(',');

  try {
    await gradeStore.AddGrade({ ...formModelGrade });
    alert("Grade criada com sucesso! As vagas foram geradas.");
    
    diasSelecionados.value = [];
    
  } catch (e) {
    alert("Erro ao criar grade. Verifique os dados.");
  }
}
</script>