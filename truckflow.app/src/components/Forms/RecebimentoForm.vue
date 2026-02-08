<template>
  <v-container class="pa-4 d-flex justify-center bg-grey-lighten-4 h-100">
    <v-card class="w-100 rounded-xl" max-width="900" elevation="2">

      <div class="pa-6 border-b d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" color="grey-darken-2" @click="router.back()" class="mr-2"></v-btn>
        <div>
          <h1 class="text-h6 font-weight-bold text-grey-darken-3">Novo Planejamento</h1>
          <div class="text-caption text-grey">Defina o contrato e as metas de entrega</div>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="salvar" class="pa-6">

        <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">DADOS GERAIS</div>
        <v-row dense>
          <v-col cols="12" md="8">
            <v-autocomplete v-model="recebimento.fornecedorId" :items="fornecedorStore.fornecedores" item-title="nome"
              item-value="id" label="Fornecedor" placeholder="Selecione..." variant="outlined" density="comfortable"
              color="primary" hide-details="auto" :rules="[requiredRule]" prepend-inner-icon="mdi-domain"
              @update:model-value="limparItensAoTrocarFornecedor"></v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="recebimento.dataInicio" type="date" label="Início do Contrato" variant="outlined"
              density="comfortable" color="primary" hide-details="auto" :rules="[requiredRule]"></v-text-field>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-overline text-grey-darken-1 font-weight-bold">ITENS DO CONTRATO</div>
          <v-btn prepend-icon="mdi-plus" variant="text" color="primary" class="text-capitalize font-weight-bold"
            @click="prepararNovoItem" :disabled="!recebimento.fornecedorId">Adicionar Produto</v-btn>
        </div>

        <v-expand-transition>
          <v-card v-if="mostrandoFormItem || recebimento.itensPlanejamento.length === 0" variant="tonal" color="primary"
            class="pa-4 mb-4 border-dashed">
            <div class="text-subtitle-2 font-weight-bold mb-3 text-primary d-flex align-center">
              <v-icon size="small" class="mr-2">mdi-package-variant-plus</v-icon>
              Novo Item
            </div>

            <div v-if="!recebimento.fornecedorId" class="text-center py-2 text-grey-darken-1 text-caption">
              Selecione um fornecedor acima para liberar os produtos.
            </div>

            <v-row dense v-else>
              <v-col cols="12" md="4">
                <v-select v-model="formItem.produtoId" :items="produtosFiltrados" item-title="nome" item-value="id"
                  label="Produto" variant="outlined" density="compact" bg-color="white" hide-details="auto"></v-select>
              </v-col>
              <v-col cols="6" md="4">
                <v-text-field v-model.number="formItem.quantidadeTotalPlanejada" label="Total (Ton)" type="number"
                  variant="outlined" density="compact" bg-color="white" hide-details="auto" suffix="T"></v-text-field>
              </v-col>
              <v-col cols="6" md="4">
                <v-text-field v-model.number="formItem.cadenciaDiariaPlanejada" label="Meta Diária" type="number"
                  variant="outlined" density="compact" bg-color="white" hide-details="auto"
                  suffix="T/dia"></v-text-field>
              </v-col>
            </v-row>

            <div class="d-flex justify-end mt-3 gap-2" v-if="recebimento.fornecedorId">
              <v-btn v-if="recebimento.itensPlanejamento.length > 0" variant="text" size="small" color="grey-darken-2"
                @click="mostrandoFormItem = false">Cancelar</v-btn>

              <v-btn color="primary" size="small" variant="flat" @click="confirmarAdicaoItem"
                :disabled="!formItem.produtoId || !formItem.quantidadeTotalPlanejada">Confirmar Item</v-btn>
            </div>
          </v-card>
        </v-expand-transition>

        <div v-if="recebimento.itensPlanejamento.length > 0" class="d-flex flex-column gap-3">
          <v-slide-y-transition group>
            <v-card v-for="(item, index) in recebimento.itensPlanejamento" :key="index" elevation="0"
              class="border pa-3 d-flex align-center bg-grey-lighten-5">
              <v-avatar color="blue-grey-lighten-4" size="40" class="mr-3 text-blue-grey-darken-3 font-weight-bold"
                variant="flat">
                {{ index + 1 }}
              </v-avatar>

              <div class="flex-grow-1">
                <div class="text-subtitle-2 font-weight-bold text-grey-darken-3">
                  {{ getNomeProduto(item.produtoId) }}
                </div>
                <div class="text-caption text-grey-darken-1 mt-1">
                  <v-icon size="small" class="mr-1">mdi-weight</v-icon>
                  Total: <strong>{{ item.quantidadeTotalPlanejada }} T</strong>
                  <span class="mx-2 text-grey-lighten-1">|</span>
                  <v-icon size="small" class="mr-1">mdi-calendar-clock</v-icon>
                  Diária: <strong>{{ item.cadenciaDiariaPlanejada }} T</strong>
                </div>
              </div>

              <v-tooltip text="Remover item" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-delete-outline" size="small" variant="text" color="error"
                    @click="removerItem(index)"></v-btn>
                </template>
              </v-tooltip>
            </v-card>
          </v-slide-y-transition>
        </div>

        <div class="d-flex justify-end mt-8 gap-3">
          <v-btn variant="text" size="large" color="grey-darken-1" @click="router.back()">Cancelar</v-btn>

          <v-btn color="success" size="large" type="submit" :loading="recebimentoStore.loading"
            class="px-8 font-weight-bold text-capitalize" elevation="2"
            :disabled="recebimento.itensPlanejamento.length === 0">
            Salvar Planejamento
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
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useFornecedorStore } from "@/stores/FornecedorStore";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { useRecebimentoStore } from "@/stores/RecebimentoStore";
import { useToastStore } from "@/stores/ToastStore";
import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type ItemPlanejamentoCreate from "@/Dtos/Item/ItemPlanejamentoCreate";

const router = useRouter();
const recebimentoStore = useRecebimentoStore();
const produtoStore = useProdutoStore();
const fornecedorStore = useFornecedorStore();
const toast = useToastStore();

// Controle de UI
const mostrandoFormItem = ref(true);
const formRef = ref<any>(null);
const requiredRule = (v: any) => !!v || "Obrigatório";

// Model do Formulário
const recebimento = reactive<IRecebimentoCreate>({
  fornecedorId: '',
  dataInicio: null, // Será preenchido como string YYYY-MM-DD pelo input
  itensPlanejamento: [],
});

// Model do Item Temporário
const formItem = ref<ItemPlanejamentoCreate>({
  produtoId: '',
  planejamentoRecebimentoId: undefined,
  cadenciaDiariaPlanejada: 0,
  quantidadeTotalPlanejada: 0
});

onMounted(async () => {
  try {
    await Promise.all([
      fornecedorStore.GetAll(),
      produtoStore.GetAll()
    ]);
  } catch (e) {
    toast.notify("Erro ao carregar listas de dados.", "error");
  }
});

// Filtra produtos vinculados ao fornecedor selecionado
const produtosFiltrados = computed(() => {
  if (!recebimento.fornecedorId) return [];

  // Tenta achar na lista do fornecedor (se existir a prop 'produtos')
  const fornecedor = fornecedorStore.fornecedores.find(f => f.id === recebimento.fornecedorId);

  // Se a entidade Fornecedor tiver lista de produtos, usa ela. Senão, mostra todos (fallback)
  // Ajuste conforme sua entidade Fornecedor real
  if (fornecedor && (fornecedor as any).produtos && (fornecedor as any).produtos.length > 0) {
    return (fornecedor as any).produtos;
  }

  return produtoStore.produtos;
});

function getNomeProduto(id: string): string {
  return produtoStore.produtos.find(p => p.id === id)?.nome || 'Produto';
}

function limparItensAoTrocarFornecedor() {
  if (recebimento.itensPlanejamento.length > 0) {
    recebimento.itensPlanejamento = [];
    toast.notify("Itens removidos pois o fornecedor mudou.", "info");
  }
  mostrandoFormItem.value = true;
}

function prepararNovoItem() {
  formItem.value = {
    produtoId: '',
    planejamentoRecebimentoId: undefined,
    cadenciaDiariaPlanejada: 0,
    quantidadeTotalPlanejada: 0
  };
  mostrandoFormItem.value = true;
}

function confirmarAdicaoItem() {
  if (!formItem.value.produtoId || !formItem.value.quantidadeTotalPlanejada) {
    toast.notify("Selecione o produto e informe a quantidade.", "warning");
    return;
  }

  // Verifica duplicidade
  const duplicado = recebimento.itensPlanejamento.some(i => i.produtoId === formItem.value.produtoId);
  if (duplicado) {
    toast.notify("Este produto já foi adicionado.", "warning");
    return;
  }

  // Adiciona cópia
  recebimento.itensPlanejamento.push({ ...formItem.value });

  prepararNovoItem(); // Limpa formItem
  mostrandoFormItem.value = false; // Fecha card
}

function removerItem(index: number) {
  recebimento.itensPlanejamento.splice(index, 1);
  if (recebimento.itensPlanejamento.length === 0) {
    mostrandoFormItem.value = true;
  }
}

async function salvar() {
  // Validação do Form Pai
  const { valid } = await formRef.value.validate();
  if (!valid) {
    toast.notify("Preencha o fornecedor e a data.", "warning");
    return;
  }

  if (recebimento.itensPlanejamento.length === 0) {
    toast.notify("Adicione pelo menos um produto ao contrato.", "warning");
    return;
  }

  try {
    // Garante conversão de tipos se necessário
    const payload = {
      ...recebimento,
      // O input date html retorna string "YYYY-MM-DD", o backend espera Date ou String ISO.
      // Geralmente passa direto, mas se precisar forçar Date: new Date(recebimento.dataInicio)
    };

    await recebimentoStore.AddRecebimento(payload);
    router.back();
  } catch (error) {
    console.error(error);
    // Erro já tratado na store
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.border-dashed {
  border-style: dashed !important;
  border-width: 1px;
}
</style>