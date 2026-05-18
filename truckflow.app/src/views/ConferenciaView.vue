<template>
  <v-container fluid class="pa-6">
    <div class="d-flex align-center gap-3 mb-4">
      <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" />
      <div>
        <div class="text-caption text-grey">Portaria</div>
        <h1 class="text-h6 font-weight-bold">Conferência da Nota Fiscal</h1>
      </div>
    </div>

    <v-card v-if="isLoading" variant="flat" class="pa-8 text-center">
      <v-progress-circular indeterminate color="primary" />
    </v-card>

    <v-alert v-else-if="isError" type="error" variant="tonal" rounded="xl">
      Não foi possível carregar a conferência. Tente recarregar a página.
    </v-alert>

    <template v-else-if="conferencia">
      <v-card variant="flat" class="pa-5 mb-4 border rounded-xl">
        <div class="d-flex flex-wrap align-center justify-space-between gap-3">
          <div>
            <div class="text-caption text-grey font-weight-medium">Fornecedor</div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ conferencia.fornecedorNome || '—' }}
            </div>
            <div class="text-caption text-grey mt-1">
              Chave: {{ conferencia.chaveAcesso || '—' }}
            </div>
          </div>

          <div class="d-flex gap-2">
            <v-chip color="success" variant="tonal" prepend-icon="mdi-check-circle">
              {{ conferencia.matchedCount }} vinculados
            </v-chip>
            <v-chip
              v-if="conferencia.pendentesCount > 0"
              color="warning"
              variant="tonal"
              prepend-icon="mdi-clock-outline"
            >
              {{ conferencia.pendentesCount }} pendentes
            </v-chip>
          </div>
        </div>
      </v-card>

      <v-card
        v-for="item in conferencia.itens"
        :key="item.id"
        variant="flat"
        :class="[
          'pa-5 mb-3 border rounded-xl',
          item.status === 'Matched' ? 'border-success' : 'border-warning bg-amber-lighten-5'
        ]"
      >
        <div class="d-flex justify-space-between align-start mb-2">
          <div class="flex-grow-1">
            <div class="text-caption text-grey font-weight-medium">Item da nota</div>
            <div class="text-subtitle-2 font-weight-bold">{{ item.descricao }}</div>
            <div class="text-caption text-grey mt-1">
              Código: {{ item.codigo }} · Qtd: {{ item.quantidade }} {{ item.unidade || '' }}
              <span v-if="item.ean"> · EAN: {{ item.ean }}</span>
            </div>
          </div>

          <v-chip
            v-if="item.status === 'Matched'"
            color="success"
            variant="tonal"
            size="small"
            prepend-icon="mdi-check-circle"
          >
            {{ originLabel(item.origemMatch) }}
          </v-chip>
          <v-chip v-else color="warning" variant="tonal" size="small" prepend-icon="mdi-alert-outline">
            Pendente
          </v-chip>
        </div>

        <v-divider class="my-3" />

        <div v-if="item.status === 'Matched'" class="text-body-2">
          <span class="text-grey">Vinculado a:</span>
          <span class="font-weight-bold ml-1">{{ item.produtoNome }}</span>
        </div>

        <div v-else>
          <div v-if="item.sugestoes && item.sugestoes.length > 0" class="mb-3">
            <div class="text-caption text-grey font-weight-medium mb-2">
              Sugestões do sistema
            </div>
            <div class="d-flex flex-wrap gap-2">
              <v-btn
                v-for="sug in item.sugestoes"
                :key="sug.id"
                color="primary"
                variant="outlined"
                size="small"
                :loading="isMatching && matchingItemId === item.id"
                @click="confirmarMatch(item.id, sug.id, sug.nome)"
              >
                {{ sug.nome }}
                <span class="text-caption text-grey ml-2">{{ Math.round(sug.score * 100) }}%</span>
              </v-btn>
            </div>
          </div>

          <div class="text-caption text-grey font-weight-medium mb-1">
            Ou buscar outro produto
          </div>
          <v-autocomplete
            :items="produtos || []"
            item-title="nome"
            item-value="id"
            label="Buscar produto no catálogo"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            :loading="loadingProdutos"
            @update:model-value="(produtoId) => produtoId && confirmarMatch(item.id, produtoId)"
          />
        </div>
      </v-card>

      <v-alert
        v-if="conferencia.itens.length === 0"
        type="info"
        variant="tonal"
        rounded="xl"
      >
        Esta nota fiscal não tem itens.
      </v-alert>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConferenciaQuery } from '@/queries/conferencia.queries';
import { useConferencia } from '@/hooks/useConferencia';
import { useProdutosQuery } from '@/queries/produto.queries';
import type { OrigemMatchProduto } from '@/Dtos/conferencia/conferenciaDto';

const route = useRoute();
const router = useRouter();

const agendamentoId = computed(() => route.params.agendamentoId as string);

const { data: conferencia, isLoading, isError } = useConferenciaQuery(agendamentoId);
const { data: produtos, isLoading: loadingProdutos } = useProdutosQuery();
const { matchItem, isMatching } = useConferencia();

const matchingItemId = ref<string | null>(null);

async function confirmarMatch(itemId: string, produtoId: string, _nome?: string) {
  matchingItemId.value = itemId;
  try {
    await matchItem(itemId, produtoId);
  } finally {
    matchingItemId.value = null;
  }
}

function originLabel(origem?: OrigemMatchProduto): string {
  switch (origem) {
    case 'EanAuto': return 'EAN auto';
    case 'ProdFornecAuto': return 'Mapping fornecedor';
    case 'HistoricoAuto': return 'Histórico';
    case 'AdminManual': return 'Confirmado';
    default: return 'Vinculado';
  }
}
</script>
