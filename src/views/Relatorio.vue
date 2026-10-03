<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3">Relatórios</h1>
        <p class="text-body-1 text-medium-emphasis">Exporte dados históricos de agendamentos e movimentações.</p>
      </div>
      
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-history">
        Histórico de Downloads
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="12" lg="10" offset-lg="1">
        
        <v-card elevation="2" rounded="lg" class="overflow-hidden">
          
          <v-sheet color="grey-lighten-5" class="px-6 py-4 border-b d-flex align-center">
            <v-avatar color="primary" variant="tonal" class="mr-3" rounded>
              <v-icon color="primary">mdi-filter-variant</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">Parâmetros da Busca</div>
              <div class="text-caption text-medium-emphasis">Selecione os filtros para refinar seu relatório</div>
            </div>
          </v-sheet>

          <v-form v-model="formValido" @submit.prevent="gerarRelatorio">
            <div class="pa-6">
              
              <div class="text-overline text-primary mb-3 d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-cube-outline</v-icon>
                Dados da Carga
              </div>
              
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="filtros.fornecedorId"
                    :items="fornecedores"
                    item-title="nome"
                    item-value="id"
                    :loading="loadingFornecedores"
                    label="Fornecedor"
                    placeholder="Selecione um fornecedor"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-domain"
                    clearable
                    hide-details="auto"
                    color="primary"
                    class="mb-3"
                  ></v-autocomplete>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="filtros.produtoId"
                    :items="produtos"
                    item-title="nome"
                    item-value="id"
                    :loading="loadingProdutos"
                    label="Produto"
                    placeholder="Selecione um produto"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-package-variant-closed"
                    clearable
                    hide-details="auto"
                    color="primary"
                    class="mb-3"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="filtros.placaVeiculo"
                    label="Placa do Veículo"
                    placeholder="AAA-0000"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-truck-outline"
                    hide-details="auto"
                    color="primary"
                    v-mask="'AAA-####'" 
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="filtros.motorista"
                    label="Nome do Motorista"
                    placeholder="Digite o nome..."
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account-tie-hat"
                    hide-details="auto"
                    color="primary"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="my-6 border-opacity-50"></v-divider>

              <div class="text-overline text-primary mb-3 d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-clock-time-four-outline</v-icon>
                Período e Horário
              </div>

              <v-row dense>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.dataInicio"
                    type="date"
                    label="Data Início"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :rules="[v => !!v || 'Obrigatório']"
                    hint="Obrigatório"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.dataFim"
                    type="date"
                    label="Data Fim"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :rules="[v => !!v || 'Obrigatório']"
                    hint="Obrigatório"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.horaInicio"
                    type="time"
                    label="Horário Inicial"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="filtros.horaFim"
                    type="time"
                    label="Horário Final"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <v-sheet color="blue-grey-lighten-5" class="px-6 py-5 mt-2 border-t d-flex flex-wrap align-center justify-space-between gap-4">
              
              <div class="d-flex flex-column">
                <span class="text-caption font-weight-bold text-uppercase text-grey-darken-2 mb-1">
                  Formatos de Exportação
                </span>
                <div class="d-flex align-center ga-6">
                  <v-checkbox
                    v-model="exportar.csv"
                    label="CSV (.csv)"
                    color="green-darken-1"
                    hide-details
                    density="compact"
                    class="ma-0 pa-0 custom-checkbox"
                  ></v-checkbox>
                  
                  <v-checkbox
                    v-model="exportar.pdf"
                    label="PDF (.pdf)"
                    color="red-darken-1"
                    hide-details
                    density="compact"
                    class="ma-0 pa-0 custom-checkbox"
                  ></v-checkbox>
                </div>
              </div>

              <!-- Botão Principal -->
               <div class="d-flex align-center ga-3">
                 <v-btn variant="text" color="grey-darken-1" @click="limparFiltros">
                    Limpar Filtros
                 </v-btn>
                 
                 <v-btn
                  color="#195FA0"
                  size="large"
                  class="text-capitalize px-8 font-weight-bold"
                  rounded="lg"
                  elevation="2"
                  prepend-icon="mdi-file-download-outline"
                  :loading="loading"
                  :disabled="!podeGerar"
                  type="submit"
                >
                  {{ cooldown > 0 ? `Aguarde ${cooldown}s` : 'Gerar Relatório' }}
                </v-btn>
               </div>
            </v-sheet>
          </v-form>
        </v-card>

        <v-slide-y-transition>
          <v-alert
            v-if="sucessoGeracao"
            type="success"
            variant="tonal"
            class="mt-4 border-success"
            closable
            title="Relatório Gerado com Sucesso!"
            text="O download do seu arquivo começará em instantes. Verifique sua pasta de downloads."
            @click:close="sucessoGeracao = false"
          ></v-alert>
        </v-slide-y-transition>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue';
import { useFornecedor } from '@/hooks/useFornecedor';
import { useProduto } from '@/hooks/useProdutos';
import { useRelatorio } from '@/hooks/useRelatorio';
import type IRelatorioAgendamentoFilterDto from '@/Dtos/relatorio/relatorioAgendamentoFilter.dto';

const formValido = ref(false);
const loading = ref(false);
const sucessoGeracao = ref(false);

const { fornecedores, loading: loadingFornecedores } = useFornecedor();
const { produtos, loading: loadingProdutos } = useProduto();
const { gerarRelatorio: gerarRelatorioMutation } = useRelatorio();

const filtros = reactive({
  fornecedorId: null as string | null,
  produtoId: null as string | null,
  placaVeiculo: '',
  motorista: '',
  dataInicio: '',
  dataFim: '',
  horaInicio: '',
  horaFim: '',
});

const exportar = reactive({
  csv: true, // Default
  pdf: false
});

const isFormatoSelecionado = computed(() => {
  return exportar.csv || exportar.pdf;
});

const COOLDOWN_SEGUNDOS = 10;
const cooldown = ref(0);
let cooldownInterval: ReturnType<typeof setInterval> | null = null;

const periodoPreenchido = computed(() => !!filtros.dataInicio && !!filtros.dataFim);

const podeGerar = computed(() =>
  isFormatoSelecionado.value && periodoPreenchido.value && cooldown.value === 0
);

function iniciarCooldown() {
  cooldown.value = COOLDOWN_SEGUNDOS;

  cooldownInterval = setInterval(() => {
    cooldown.value -= 1;

    if (cooldown.value <= 0) {
      cooldown.value = 0;
      if (cooldownInterval) clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
  }, 1000);
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval);
});

function limparFiltros() {
    filtros.fornecedorId = null;
    filtros.produtoId = null;
    filtros.placaVeiculo = '';
    filtros.motorista = '';
    filtros.dataInicio = '';
    filtros.dataFim = '';
    filtros.horaInicio = '';
    filtros.horaFim = '';

    sucessoGeracao.value = false;
}

function montarFiltrosPayload(): IRelatorioAgendamentoFilterDto {
  return {
    dataInicio: filtros.dataInicio || undefined,
    dataFim: filtros.dataFim || undefined,
    horaInicio: filtros.horaInicio || undefined,
    horaFim: filtros.horaFim || undefined,
    fornecedorId: filtros.fornecedorId ?? undefined,
    produtoId: filtros.produtoId ?? undefined,
    placaVeiculo: filtros.placaVeiculo || undefined,
    motorista: filtros.motorista || undefined,
  };
}

async function gerarRelatorio() {
  if (!podeGerar.value) return;

  loading.value = true;
  sucessoGeracao.value = false;
  iniciarCooldown();

  try {
    const payload = montarFiltrosPayload();

    if (exportar.csv) {
      await gerarRelatorioMutation({ filtros: payload, formato: 'csv' });
    }
    if (exportar.pdf) {
      await gerarRelatorioMutation({ filtros: payload, formato: 'pdf' });
    }

    sucessoGeracao.value = true;
  } catch {
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Ajuste fino para checkboxes ficarem alinhados perfeitamente */
.custom-checkbox :deep(.v-label) {
    font-weight: 500;
    color: #424242; /* Grey darken-3 */
    opacity: 1;
}

/* Background suave para a área de ação */
.bg-action-area {
    background-color: #F8FAFC;
}
</style>