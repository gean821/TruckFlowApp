<template>
  <v-card elevation="0" class="rounded-xl pa-4 filtros-card">
    <div class="d-flex flex-wrap align-center" style="gap: 8px">
      <v-chip-group v-model="rascunho.preset" mandatory selected-class="preset-ativo" class="flex-grow-1">
        <v-chip
          v-for="preset in PRESETS_PERIODO"
          :key="preset.valor"
          :value="preset.valor"
          variant="outlined"
          size="small"
          class="font-weight-medium"
        >
          {{ preset.rotulo }}
        </v-chip>
      </v-chip-group>

      <template v-if="rascunho.preset === 'personalizado'">
        <v-text-field
          v-model="rascunho.inicio"
          type="date"
          label="De"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 170px"
        />
        <v-text-field
          v-model="rascunho.fim"
          type="date"
          label="Até"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 170px"
        />
      </template>
    </div>

    <v-row dense class="mt-2">
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          v-model="rascunho.unidadeEntregaId"
          :items="unidades"
          item-title="nome"
          item-value="id"
          label="Unidade"
          prepend-inner-icon="mdi-factory"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="rascunho.localDescargaId = null"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          v-model="rascunho.localDescargaId"
          :items="docas"
          item-title="nome"
          item-value="id"
          label="Doca / local"
          prepend-inner-icon="mdi-garage-variant"
          density="compact"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          v-model="rascunho.fornecedorId"
          :items="fornecedores"
          item-title="nome"
          item-value="id"
          label="Fornecedor"
          prepend-inner-icon="mdi-domain"
          density="compact"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          v-model="rascunho.produtoId"
          :items="produtos"
          item-title="nome"
          item-value="id"
          label="Produto"
          prepend-inner-icon="mdi-package-variant-closed"
          density="compact"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <div class="d-flex align-center justify-space-between mt-3 flex-wrap" style="gap: 8px">
      <div class="text-caption text-grey-darken-1">
        <v-icon size="14" class="mr-1">mdi-calendar-range</v-icon>
        {{ descreverPeriodo(rascunho.inicio, rascunho.fim) }}
        <span v-if="quantidadeFiltros > 0"> • {{ quantidadeFiltros }} filtro{{ quantidadeFiltros > 1 ? "s" : "" }} ativo{{ quantidadeFiltros > 1 ? "s" : "" }}</span>
      </div>
      <div class="d-flex" style="gap: 8px">
        <v-btn v-if="quantidadeFiltros > 0" variant="text" size="small" prepend-icon="mdi-filter-remove-outline" @click="limpar">
          Limpar filtros
        </v-btn>
        <v-btn color="primary" size="small" prepend-icon="mdi-check" :disabled="!alterado" rounded="lg" @click="aplicar">
          Aplicar
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { PRESETS_PERIODO, type useFiltrosRelatorio } from "@/composables/useFiltrosRelatorio";
import { useFornecedoresQuery } from "@/queries/fornecedor.queries";
import { useLocalDescargaListQuery } from "@/queries/localDescarga.queries";
import { useProdutosQuery } from "@/queries/produto.queries";
import { useUnidadesEntregaQuery } from "@/queries/unidadeEntrega.queries";
import { descreverPeriodo } from "@/utils/relatorioFormat";

const props = defineProps<{ filtros: ReturnType<typeof useFiltrosRelatorio> }>();

const { rascunho, alterado, quantidadeFiltros, aplicar, limpar } = props.filtros;

const { data: unidadesData } = useUnidadesEntregaQuery();
const { data: fornecedoresData } = useFornecedoresQuery();
const { data: produtosData } = useProdutosQuery();
const parametrosDocas = computed(() => ({ unidadeEntregaId: rascunho.unidadeEntregaId ?? undefined }));
const { data: docasData } = useLocalDescargaListQuery(parametrosDocas);

const unidades = computed(() => unidadesData.value ?? []);
const fornecedores = computed(() => fornecedoresData.value ?? []);
const produtos = computed(() => produtosData.value ?? []);
const docas = computed(() => docasData.value ?? []);
</script>

<style scoped>
.filtros-card {
  background: #fff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.05);
}
:deep(.preset-ativo) {
  background: rgb(var(--v-theme-primary)) !important;
  color: #fff !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>
