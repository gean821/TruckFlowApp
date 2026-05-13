<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">
        Recebimentos órfãos
      </h1>
      <p class="text-body-1 text-grey">
        Reservas/recebimentos criados sem planejamento ativo vinculado.
        Selecione o item de planejamento correto para regularizar o saldo.
      </p>
    </div>

    <v-card elevation="0" class="border rounded-xl bg-white">
      <div class="pa-4 d-flex flex-wrap gap-3 align-center">
        <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          label="Buscar (produto, fornecedor, observação...)"
          prepend-inner-icon="mdi-magnify"
          hide-details
          bg-color="white"
          style="min-width: 280px; flex: 1 1 280px"
          clearable
        />
        <v-btn
          icon="mdi-refresh"
          variant="text"
          color="grey-darken-1"
          :loading="loading"
          @click="carregar()"
        />
      </div>

      <v-data-table-server
        :headers="headers"
        :items="data?.items ?? []"
        :items-length="data?.totalCount ?? 0"
        :loading="loading"
        :page="page"
        :items-per-page="pageSize"
        :items-per-page-options="[10, 20, 50]"
        item-value="id"
        density="comfortable"
        no-data-text="Nenhum recebimento órfão pendente."
        @update:page="page = $event"
        @update:items-per-page="pageSize = $event"
      >
        <template #item.dataRecebimento="{ item }">
          {{ formatDate(item.dataRecebimento) }}
        </template>
        <template #item.quantidade="{ item }">
          <strong
            >{{
              Number(item.quantidade).toLocaleString("pt-BR", {
                maximumFractionDigits: 2,
              })
            }}
            T</strong
          >
        </template>
        <template #item.acoes="{ item }">
          <v-btn
            size="small"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-link-variant"
            @click="abrirVincular(item)"
          >
            Vincular
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>

    <v-dialog v-model="dialogVincular" max-width="520" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-h6 font-weight-bold">
          Vincular órfão a um planejamento
        </v-card-title>
        <v-card-text>
          <div class="text-body-2 text-grey-darken-1 mb-3" v-if="selecionado">
            <div>
              <strong>Produto:</strong> {{ selecionado.produtoNome || "—" }}
            </div>
            <div>
              <strong>Fornecedor:</strong>
              {{ selecionado.fornecedorNome || "—" }}
            </div>
            <div>
              <strong>Quantidade:</strong>
              {{
                Number(selecionado.quantidade).toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                })
              }}
              T
            </div>
          </div>

          <v-autocomplete
            v-model="planejamentoEscolhido"
            :items="planejamentos"
            :item-title="formatPlanejamentoLabel"
            item-value="id"
            label="Planejamento"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-3"
            clearable
          />

          <v-autocomplete
            v-model="itemEscolhido"
            :items="itensFiltrados"
            :item-title="formatItemLabel"
            item-value="id"
            label="Item do planejamento"
            density="compact"
            variant="outlined"
            hide-details
            :disabled="!planejamentoEscolhido"
            clearable
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="fecharVincular" :disabled="salvando">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="salvando"
            :disabled="!itemEscolhido"
            @click="confirmarVincular"
          >
            Vincular
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import RecebimentoService from "@/services/RecebimentoService";
import type { IRecebimentoOrfao } from "@/Dtos/Recebimento/IRecebimentoOrfao";
import type IRecebimentoResponse from "@/Dtos/Recebimento/IRecebimentoResponse";
import type ItemPlanejamentoResponse from "@/Dtos/Item/ItemResponseDto";
import type { PaginatedResponse } from "@/entities/paginatedResponse";
import { useToastStore } from "@/stores/ToastStore";

const service = RecebimentoService();
const route = useRoute();
const router = useRouter();

const data = ref<PaginatedResponse<IRecebimentoOrfao> | null>(null);
const planejamentos = ref<IRecebimentoResponse[]>([]);
const loading = ref(false);

const search = ref(route.query.search?.toString() || "");
const searchDebounced = ref(search.value);
const page = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.pageSize) || 10);

const dialogVincular = ref(false);
const selecionado = ref<IRecebimentoOrfao | null>(null);
const planejamentoEscolhido = ref<string | null>(null);
const itemEscolhido = ref<string | null>(null);
const salvando = ref(false);
const toast = useToastStore();

const headers = [
  { title: "Data", key: "dataRecebimento" },
  { title: "Produto", key: "produtoNome" },
  { title: "Fornecedor", key: "fornecedorNome" },
  { title: "Quantidade", key: "quantidade", align: "end" as const },
  { title: "Observação", key: "observacao" },
  { title: "Ações", key: "acoes", sortable: false, align: "end" as const },
];

const itensFiltrados = computed<ItemPlanejamentoResponse[]>(() => {
  const p = planejamentos.value.find(
    (x) => x.id === planejamentoEscolhido.value,
  );
  return (p?.itens ?? []) as ItemPlanejamentoResponse[];
});

let searchTimeout: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchDebounced.value = (val ?? "").toString();
    page.value = 1;
  }, 350);
});

watch([searchDebounced, page, pageSize], () => {
  carregar();
  router.replace({
    query: {
      search: searchDebounced.value || undefined,
      page: page.value !== 1 ? page.value : undefined,
      pageSize: pageSize.value !== 10 ? pageSize.value : undefined,
    },
  });
});

async function carregar() {
  loading.value = true;
  try {
    const o = await service.getOrfaos({
      pageNumber: page.value,
      pageSize: pageSize.value,
      search: searchDebounced.value || undefined,
    });
    data.value = o;

    if (planejamentos.value.length === 0) {
      planejamentos.value = await service.getAll();
    }
  } catch (e: any) {
    toast.notify(e?.response?.data?.message, "error");
  } finally {
    loading.value = false;
  }
}

function abrirVincular(item: IRecebimentoOrfao) {
  selecionado.value = item;
  planejamentoEscolhido.value = null;
  itemEscolhido.value = null;
  dialogVincular.value = true;
}

function fecharVincular() {
  dialogVincular.value = false;
  selecionado.value = null;
}

async function confirmarVincular() {
  if (!selecionado.value || !itemEscolhido.value) return;
  salvando.value = true;
  try {
    await service.vincularOrfao(selecionado.value.id, {
      itemPlanejamentoId: itemEscolhido.value,
    });
    toast.notify("Órfão vinculado com sucesso.", "success");
    fecharVincular();
    await carregar();
  } catch (e: any) {
    toast.notify(
      "Falha ao vincular",
      e?.response?.data?.message ?? "Tente novamente.",
    );
  } finally {
    salvando.value = false;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

function formatPlanejamentoLabel(p: IRecebimentoResponse) {
  return `${p.fornecedorNome} — ${new Date(p.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(p.dataFim).toLocaleDateString("pt-BR")}`;
}

function formatItemLabel(i: ItemPlanejamentoResponse) {
  return `${i.produto} — saldo ${Number(
    Math.max(
      0,
      i.quantidadeTotalPlanejada -
        i.quantidadeTotalRecebida -
        (i.quantidadeReservada ?? 0),
    ),
  ).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} T`;
}

onMounted(carregar);
</script>
