<template>
  <v-container class="pa-4">
    <div class="text-center mb-6">
      <h1 class="text-h5 font-weight-medium pa-3">
        Cadastro de Recebimento
      </h1>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-form v-model="isFormValid" @submit.prevent="submitFormulario">
          <v-card 
            elevation="5"
            class="pa-6" color="#EDEAEA94">
            <v-card-text>

              <h3 class="text-h5 mb-5 d-flex justify-center">Dados Principais</h3>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="recebimento.fornecedorId"
                    :items="fornecedores"
                    label="Fornecedor"
                    item-title="nome"
                    item-value="id"
                    :rules="[requiredRule]"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="formItem.produtoId"
                    label="Produto"
                    :items="produtosFiltrados"
                    item-title="nome"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    :disabled="!recebimento.fornecedorId"
                  />
                </v-col>
              </v-row>

              <v-row dense align="center">
                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="formItem.quantidadeTotalPlanejada"
                    label="Qtd. Total (T)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>

                <v-col cols="6" md="3">
                  <v-text-field
                    v-model.number="formItem.cadenciaDiariaPlanejada"
                    label="Cadência Diária (T)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>

                <v-col cols="12" md="4" class="mb-5">
                  <v-btn
                    color="green"
                    block
                    @click="adicionarItem"
                    :disabled="!formItem.produtoId || !formItem.quantidadeTotalPlanejada"
                  >
                    Adicionar
                  </v-btn>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-menu
                    v-model="menuData"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="formattedDate"
                        label="Data de entrega (apenas domingos)"
                        readonly
                        variant="outlined"
                        density="compact"
                        :rules="[requiredRule]"
                      />
                    </template>

                    <v-date-picker
                      v-model="selectedDate"
                      :allowed-dates="allowedSundays"
                      @update:model-value="onDateSelected"
                    />
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Tabela de Itens -->
              <v-data-table
                v-if="recebimento.itensPlanejamento.length > 0"
                :items="recebimento.itensPlanejamento"
                :headers="itemHeaders"
                density="compact"
                hide-default-footer
                class="bg-blue-grey-lighten-5 mt-4"
              >
                <template #item.produtoId="{ item }">
                  {{ getNomeProduto(item.produtoId) }}
                </template>

                <template v-slot:item.createdAt="{ value }">
                  {{ formatarData(value) }}
               </template>

                <template #item.actions="{ index }">
                  <v-icon color="red" @click="removerItem(index)">mdi-delete</v-icon>
                </template>
              </v-data-table>
            </v-card-text>

            <v-card-actions class="d-flex justify-space-between mt-4 pa-4">
              <v-btn 
                color="red"
                variant="flat" 
                @click="router.back()">
                Voltar
              </v-btn>

              <v-btn
                color="green"
                variant="elevated"
                type="submit"
                :disabled="!isFormValid || recebimento.itensPlanejamento.length === 0"
              >
                Agendar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>



<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useFornecedorStore } from "@/stores/FornecedorStore";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { useRecebimentoStore } from "@/stores/RecebimentoStore";
import type IProduto from "@/Entities/IProduto";
import type IFornecedor from "@/Entities/IFornecedor";
import type { VDataTableHeader } from "../data-table/CrudTable.vue";
import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type ItemPlanejamentoCreate from "@/Dtos/Item/ItemPlanejamentoCreate";
import { formatarData } from "@/utils/date-format";

const router = useRouter();

const recebimentoStore = useRecebimentoStore();
const produtoStore = useProdutoStore();
const fornecedorStore = useFornecedorStore();

const fornecedores = computed<IFornecedor[]>(() => fornecedorStore.fornecedores);
const todosProdutos = computed<IProduto[]>(() => produtoStore.produtos);

onMounted(async () => {
  await fornecedorStore.GetAll();
  await produtoStore.GetAll();
})

const isFormValid = ref(false);
const menuData = ref(false);

const recebimento = reactive<IRecebimentoCreate>({
    fornecedorId: '',
    dataInicio: null,
    itensPlanejamento: [] as ItemPlanejamentoCreate[],
});

const formItem = ref<ItemPlanejamentoCreate>({
  produtoId: '',
  planejamentoRecebimentoId: '',
  cadenciaDiariaPlanejada: 0,
  quantidadeTotalPlanejada: 0
});

const requiredRule = (v: any) => !!v || "Campo obrigatório";
const selectedDate = ref<string | null>(null);
const formattedDate = ref('');

function onDateSelected(value: string | null) {
  if (!value) {
    recebimento.dataInicio = null;
    formattedDate.value = "";
    return;
  }

  const dateObj = new Date(value);
  recebimento.dataInicio = dateObj;
  formattedDate.value = dateObj.toLocaleDateString("pt-BR");

  selectedDate.value = value;
  menuData.value = false;
}


const allowedSundays = (date: unknown) => {
  if (!(date instanceof Date)) {
    return false;
  }

  return date.getDay() === 0;
};

const produtosFiltrados = computed(() => {
    if (!recebimento.fornecedorId) {
      return [];
    }

    const fornecedor = fornecedores.value.find(f => f.id === recebimento.fornecedorId);
    return fornecedor?.produtos ?? [];
});


const itemHeaders : VDataTableHeader = [
    { title: 'Produto', key: 'produtoId' },
    { title: 'Qtd. Total (T)', key: 'quantidadeTotalPlanejada', align: 'end' },
    { title: 'Cadência Diária (T)', key: 'cadenciaDiariaPlanejada', align: 'end' },
    { title: 'Entrega', key: 'dataDeEntrega', align: 'end' },
    { title: 'Remover', key: 'actions', sortable: false, align: 'center' },
];

function getNomeProduto(id: string): string {
  return todosProdutos.value.find(p => p.id === id)?.nome || '...';
}

function getDataItem(date: Date) {
//  return recebimento.dataInicio;
}

function adicionarItem() {
    if (!formItem.value.produtoId || !formItem.value.quantidadeTotalPlanejada) {
      return;
    }

    const novoItem = {...formItem.value};
    
    if (!novoItem.planejamentoRecebimentoId) {
      delete novoItem.planejamentoRecebimentoId;
    }

    recebimento.itensPlanejamento.push(novoItem);

    formItem.value = {
      produtoId: '',
      planejamentoRecebimentoId: '',
      quantidadeTotalPlanejada: 0,
      cadenciaDiariaPlanejada: 0,
    };
}

function removerItem(index: number) {
  recebimento.itensPlanejamento.splice(index, 1);
}

async function submitFormulario() {
    if (!isFormValid.value || recebimento.itensPlanejamento.length === 0) {
      alert("Preencha todos os campos e adicione ao menos um item.");
      return;
    }

    if (!recebimento.dataInicio) {
      alert("Selecione uma data de entrega válida (domingo).");
      return;
    }

     try {
      const payload = JSON.parse(JSON.stringify(recebimento));

      await recebimentoStore.AddRecebimento(payload);
      router.back();
    } catch (error) {
      console.log("informações de recebimento: Data: ",
      recebimento.dataInicio, "Fornecedor:", recebimento.fornecedorId,
      "Itens:", recebimento.itensPlanejamento);
      console.error("Falha ao salvar:", error);
      alert("Erro ao salvar o planejamento.");
    }
}


</script>

<style scoped>
.text-h5 {
    font-family: "Montserrat", sans-serif;
}
</style>