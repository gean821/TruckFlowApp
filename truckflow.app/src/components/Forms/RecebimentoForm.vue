<template>
  <v-container class="pa-4 d-flex justify-center bg-grey-lighten-4 h-100">
    <v-card class="w-100 rounded-xl" max-width="960" elevation="2">
      <div class="pa-6 border-b d-flex align-center">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          color="grey-darken-2"
          @click="router.back()"
          class="mr-2"
        />
        <div>
          <h1 class="text-h6 font-weight-bold text-grey-darken-3">
            Novo Planejamento Semanal
          </h1>
          <div class="text-caption text-grey">
            Defina fornecedor, vigência e metas diárias por produto
          </div>
        </div>
      </div>

      <v-form ref="formRef" @submit.prevent="salvar" class="pa-6">
        <div class="text-overline text-grey-darken-1 mb-2 font-weight-bold">
          DADOS GERAIS
        </div>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.fornecedorId"
              :items="fornecedorStore.fornecedores"
              item-title="nome"
              item-value="id"
              label="Fornecedor"
              placeholder="Selecione..."
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :rules="[required]"
              prepend-inner-icon="mdi-domain"
              @update:model-value="limparItensAoTrocarFornecedor"
            />
          </v-col>

          <v-col cols="6" md="3">
            <v-text-field
              v-model="form.dataInicio"
              type="date"
              label="Início da Vigência"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :min="hoje"
              :rules="[required]"
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              v-model="form.dataFim"
              type="date"
              label="Fim da Vigência"
              variant="outlined"
              density="comfortable"
              color="primary"
              hide-details="auto"
              :min="form.dataInicio || hoje"
              :rules="[required]"
            />
          </v-col>
        </v-row>

        <v-alert
          v-if="rangeInvalido"
          type="warning"
          variant="tonal"
          density="compact"
          class="mt-3"
          icon="mdi-alert-outline"
        >
          A data fim deve ser igual ou posterior à data início.
        </v-alert>

        <v-divider class="my-6" />

        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-overline text-grey-darken-1 font-weight-bold">
            ITENS DO CONTRATO
          </div>
          <v-btn
            prepend-icon="mdi-plus"
            variant="text"
            color="primary"
            class="text-capitalize font-weight-bold"
            :disabled="!form.fornecedorId || rangeInvalido"
            @click="prepararNovoItem"
          >
            Adicionar Produto
          </v-btn>
        </div>

        <v-expand-transition>
          <v-card
            v-if="mostrandoFormItem || form.itensPlanejamento.length === 0"
            variant="tonal"
            color="primary"
            class="pa-4 mb-4 border-dashed"
          >
            <div
              class="text-subtitle-2 font-weight-bold mb-3 text-primary d-flex align-center"
            >
              <v-icon size="small" class="mr-2"
                >mdi-package-variant-plus</v-icon
              >
              Novo Item
            </div>

            <div
              v-if="!form.fornecedorId"
              class="text-center py-2 text-grey-darken-1 text-caption"
            >
              Selecione um fornecedor acima para liberar os produtos.
            </div>

            <v-row dense v-else>
              <v-col cols="12" md="5">
                <v-autocomplete
                  v-model="itemForm.produtoId"
                  :items="produtosDisponiveis"
                  item-title="nome"
                  item-value="id"
                  label="Produto"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details="auto"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  v-model.number="itemForm.cadenciaDiariaPlanejada"
                  label="Meta Diária"
                  type="number"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details="auto"
                  suffix="T/dia"
                  min="0"
                />
              </v-col>
              <v-col cols="6" md="4">
                <v-text-field
                  v-model.number="itemForm.toleranciaExtra"
                  label="Tolerância (opcional)"
                  type="number"
                  variant="outlined"
                  density="compact"
                  bg-color="white"
                  hide-details="auto"
                  suffix="T"
                  min="0"
                  hint="Padrão 30 T"
                  persistent-hint
                />
              </v-col>
            </v-row>

            <div class="mt-4" v-if="form.fornecedorId">
              <label class="text-caption font-weight-bold text-grey-darken-1"
                >DIAS DE OPERAÇÃO</label
              >
              <v-btn-toggle
                v-model="itemForm.diasSelecionados"
                multiple
                variant="outlined"
                divided
                color="primary"
                class="d-flex flex-wrap w-100 mt-1 rounded-lg"
              >
                <v-btn
                  v-for="dia in diasOpcoes"
                  :key="dia.value"
                  :value="dia.value"
                  :disabled="!diasSelecionaveis.has(dia.value)"
                  class="flex-grow-1 text-caption font-weight-bold"
                  :class="{ 'text-error': dia.value === '0' }"
                >
                  {{ dia.label }}
                </v-btn>
              </v-btn-toggle>
              <div class="text-caption text-grey mt-1">
                Apenas dias dentro da vigência e a partir de hoje ficam
                habilitados.
              </div>
            </div>

            <v-alert
              v-if="itemPreview.total > 0"
              class="mt-4"
              type="info"
              variant="tonal"
              density="compact"
              icon="mdi-calculator-variant"
            >
              <strong>{{ itemPreview.total }} T</strong> planejados —
              {{ itemPreview.diasAtivos }} dia{{
                itemPreview.diasAtivos > 1 ? "s" : ""
              }}
              × {{ itemForm.cadenciaDiariaPlanejada || 0 }} T/dia
              <span class="text-grey-darken-1"
                >· tolerância {{ itemForm.toleranciaExtra ?? 30 }} T/dia</span
              >
            </v-alert>

            <div class="d-flex justify-end mt-4 gap-2">
              <v-btn
                v-if="form.itensPlanejamento.length > 0"
                variant="text"
                size="small"
                color="grey-darken-2"
                @click="mostrandoFormItem = false"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                size="small"
                variant="flat"
                :disabled="!itemPronto"
                @click="confirmarAdicaoItem"
              >
                Confirmar Item
              </v-btn>
            </div>
          </v-card>
        </v-expand-transition>

        <div
          v-if="form.itensPlanejamento.length > 0"
          class="d-flex flex-column gap-3"
        >
          <v-slide-y-transition group>
            <v-card
              v-for="(item, index) in form.itensPlanejamento"
              :key="index"
              elevation="0"
              class="border pa-3 d-flex align-center bg-grey-lighten-5"
            >
              <v-avatar
                color="blue-grey-lighten-4"
                size="40"
                class="mr-3 text-blue-grey-darken-3 font-weight-bold"
                variant="flat"
              >
                {{ index + 1 }}
              </v-avatar>

              <div class="flex-grow-1">
                <div
                  class="text-subtitle-2 font-weight-bold text-grey-darken-3"
                >
                  {{ getNomeProduto(item.produtoId) }}
                </div>
                <div class="text-caption text-grey-darken-1 mt-1">
                  <v-icon size="small" class="mr-1">mdi-calendar-week</v-icon>
                  <strong>{{ totalPorItem(item) }} T</strong> total
                  <span class="mx-2 text-grey-lighten-1">|</span>
                  <v-icon size="small" class="mr-1">mdi-speedometer</v-icon>
                  {{ item.cadenciaDiariaPlanejada }} T/dia ×
                  {{ contarDias(item.diasSemana) }} dia{{
                    contarDias(item.diasSemana) > 1 ? "s" : ""
                  }}
                  <span class="mx-2 text-grey-lighten-1">|</span>
                  <v-icon size="small" class="mr-1">mdi-plus-thick</v-icon>
                  tol. {{ item.toleranciaExtra ?? 30 }} T/dia
                </div>
                <div class="text-caption mt-1">
                  <v-chip
                    v-for="d in parseDias(item.diasSemana)"
                    :key="d.value"
                    size="x-small"
                    class="mr-1"
                    :color="
                      d.value === '0' || d.value === '6'
                        ? 'orange-lighten-4'
                        : 'blue-lighten-5'
                    "
                    variant="flat"
                  >
                    {{ d.label }}
                  </v-chip>
                </div>
              </div>

              <v-tooltip text="Remover item" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-delete-outline"
                    size="small"
                    variant="text"
                    color="error"
                    @click="removerItem(index)"
                  />
                </template>
              </v-tooltip>
            </v-card>
          </v-slide-y-transition>

          <v-alert
            type="success"
            variant="tonal"
            density="compact"
            icon="mdi-sigma"
          >
            <strong>Total planejado: {{ totalGeral }} T</strong>
            em {{ form.itensPlanejamento.length }} item(ns) · vigência
            {{ diasVigencia }} dia{{ diasVigencia > 1 ? "s" : "" }}
          </v-alert>
        </div>

        <div class="d-flex justify-end mt-8 gap-3">
          <v-btn
            variant="text"
            size="large"
            color="grey-darken-1"
            @click="router.back()"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            size="large"
            type="submit"
            :loading="isCreating"
            class="px-8 font-weight-bold text-capitalize"
            elevation="2"
            :disabled="form.itensPlanejamento.length === 0 || rangeInvalido"
          >
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
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { format, parseISO } from "date-fns";
import { useFornecedorStore } from "@/stores/FornecedorStore";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { useToastStore } from "@/stores/ToastStore";
import { usePlanejamento } from "@/hooks/usePlanejamento";
import type IRecebimentoCreate from "@/Dtos/Recebimento/IRecebimentoCreate";
import type ItemPlanejamentoCreate from "@/Dtos/Item/ItemPlanejamentoCreate";

const router = useRouter();
const produtoStore = useProdutoStore();
const fornecedorStore = useFornecedorStore();
const toast = useToastStore();
const { createPlanejamento, isCreating } = usePlanejamento();

const formRef = ref<any>(null);
const required = (v: any) => !!v || "Obrigatório";
const mostrandoFormItem = ref(true);

const hoje = format(new Date(), "yyyy-MM-dd");
const defaultFim = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 6);
  return format(d, "yyyy-MM-dd");
})();

const diasOpcoes = [
  { value: "1", label: "Seg" },
  { value: "2", label: "Ter" },
  { value: "3", label: "Qua" },
  { value: "4", label: "Qui" },
  { value: "5", label: "Sex" },
  { value: "6", label: "Sáb" },
  { value: "0", label: "Dom" },
];

const form = reactive<{
  fornecedorId: string;
  dataInicio: string;
  dataFim: string;
  itensPlanejamento: ItemPlanejamentoCreate[];
}>({
  fornecedorId: "",
  dataInicio: hoje,
  dataFim: defaultFim,
  itensPlanejamento: [],
});

const itemForm = ref({
  produtoId: "",
  cadenciaDiariaPlanejada: 0,
  toleranciaExtra: 30 as number | undefined,
  diasSelecionados: [] as string[],
});

onMounted(async () => {
  try {
    await Promise.all([
      fornecedorStore.fetchAll(),
      produtoStore.getAll()]);
  } catch {
    toast.notify("Erro ao carregar dados iniciais.", "error");
  }
});

const rangeInvalido = computed(() => {
  if (!form.dataInicio || !form.dataFim) return true;
  return parseISO(form.dataFim) < parseISO(form.dataInicio);
});

const diasVigencia = computed(() => {
  if (rangeInvalido.value) return 0;
  const ini = parseISO(form.dataInicio);
  const fim = parseISO(form.dataFim);
  return Math.floor((fim.getTime() - ini.getTime()) / 86400000) + 1;
});

const diasSelecionaveis = computed(() => {
  const set = new Set<string>();
  if (rangeInvalido.value) return set;

  const ini = parseISO(form.dataInicio);
  const fim = parseISO(form.dataFim);
  const hojeDate = parseISO(hoje);

  for (let d = new Date(ini); d <= fim; d.setDate(d.getDate() + 1)) {
    if (d < hojeDate) continue;
    set.add(String(d.getDay()));
  }
  return set;
});

watch(diasSelecionaveis, (novo) => {
  itemForm.value.diasSelecionados = itemForm.value.diasSelecionados.filter(
    (d) => novo.has(d),
  );
});

const produtosDisponiveis = computed(() => {
  if (!form.fornecedorId) return [];
  const fornecedor = fornecedorStore.fornecedores.find(
    (f) => f.id === form.fornecedorId,
  );
  const produtosDoForn = (fornecedor as any)?.produtos;
  if (produtosDoForn && produtosDoForn.length > 0) return produtosDoForn;
  return produtoStore.produtos;
});

const produtosJaSelecionados = computed(
  () => new Set(form.itensPlanejamento.map((i) => i.produtoId)),
);

const produtosFiltrados = computed(() =>
  produtosDisponiveis.value.filter(
    (p: any) => !produtosJaSelecionados.value.has(p.id),
  ),
);
void produtosFiltrados;

const itemPreview = computed(() => {
  const dias = itemForm.value.diasSelecionados;
  if (!dias.length || rangeInvalido.value) {
    return { total: 0, diasAtivos: 0 };
  }

  const ini = parseISO(form.dataInicio);
  const fim = parseISO(form.dataFim);
  const set = new Set(dias);

  let diasAtivos = 0;
  for (let d = new Date(ini); d <= fim; d.setDate(d.getDate() + 1)) {
    if (set.has(String(d.getDay()))) diasAtivos++;
  }

  const cadencia = Number(itemForm.value.cadenciaDiariaPlanejada) || 0;
  return { total: diasAtivos * cadencia, diasAtivos };
});

const itemPronto = computed(
  () =>
    !!itemForm.value.produtoId &&
    (Number(itemForm.value.cadenciaDiariaPlanejada) || 0) > 0 &&
    itemForm.value.diasSelecionados.length > 0 &&
    itemPreview.value.total > 0,
);

const totalGeral = computed(() =>
  form.itensPlanejamento.reduce((acc, item) => acc + totalPorItem(item), 0),
);

function totalPorItem(item: ItemPlanejamentoCreate): number {
  return (
    contarDias(item.diasSemana) * (Number(item.cadenciaDiariaPlanejada) || 0)
  );
}

function contarDias(diasSemana: string): number {
  if (!diasSemana) return 0;
  const set = new Set(
    diasSemana
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean),
  );
  if (rangeInvalido.value) return 0;

  const ini = parseISO(form.dataInicio);
  const fim = parseISO(form.dataFim);
  let total = 0;
  for (let d = new Date(ini); d <= fim; d.setDate(d.getDate() + 1)) {
    if (set.has(String(d.getDay()))) total++;
  }
  return total;
}

function parseDias(diasSemana: string) {
  if (!diasSemana) return [];
  const keys = diasSemana
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  return diasOpcoes.filter((o) => keys.includes(o.value));
}

function getNomeProduto(id: string): string {
  return produtoStore.produtos.find((p) => p.id === id)?.nome || "Produto";
}

function limparItensAoTrocarFornecedor() {
  if (form.itensPlanejamento.length > 0) {
    form.itensPlanejamento = [];
    toast.notify("Itens removidos pois o fornecedor mudou.", "info");
  }
  mostrandoFormItem.value = true;
}

function prepararNovoItem() {
  itemForm.value = {
    produtoId: "",
    cadenciaDiariaPlanejada: 0,
    toleranciaExtra: 30,
    diasSelecionados: [],
  };
  mostrandoFormItem.value = true;
}

function confirmarAdicaoItem() {
  if (!itemPronto.value) {
    toast.notify(
      "Preencha produto, meta diária e selecione ao menos um dia.",
      "warning",
    );
    return;
  }

  if (
    form.itensPlanejamento.some((i) => i.produtoId === itemForm.value.produtoId)
  ) {
    toast.notify("Este produto já foi adicionado.", "warning");
    return;
  }

  const diasNormalizados = [...itemForm.value.diasSelecionados]
    .map((d) => parseInt(d))
    .sort((a, b) => a - b)
    .join(",");

  form.itensPlanejamento.push({
    produtoId: itemForm.value.produtoId,
    cadenciaDiariaPlanejada: Number(itemForm.value.cadenciaDiariaPlanejada),
    diasSemana: diasNormalizados,
    toleranciaExtra: itemForm.value.toleranciaExtra ?? undefined,
  });

  prepararNovoItem();
  mostrandoFormItem.value = false;
}

function removerItem(index: number) {
  form.itensPlanejamento.splice(index, 1);
  if (form.itensPlanejamento.length === 0) {
    mostrandoFormItem.value = true;
  }
}

async function salvar() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    toast.notify("Preencha fornecedor e vigência.", "warning");
    return;
  }

  if (form.itensPlanejamento.length === 0) {
    toast.notify("Adicione pelo menos um produto.", "warning");
    return;
  }

  try {
    const payload: IRecebimentoCreate = {
      fornecedorId: form.fornecedorId,
      dataInicio: form.dataInicio,
      dataFim: form.dataFim,
      itensPlanejamento: form.itensPlanejamento,
    };
    await createPlanejamento(payload);
    router.back();
  } catch (error) {
    console.error(error);
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
