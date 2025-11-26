<template>
  <v-card class="rounded-lg border" elevation="0">
    <div class="d-flex flex-wrap align-center justify-space-between pa-4 gap-4">
      
      <div class="d-flex align-center">
        <v-avatar color="primary" variant="tonal" rounded class="mr-3" v-if="icon">
          <v-icon>{{ icon }}</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-h6 font-weight-bold mb-0">{{ title }}</h2>
          <span class="text-caption text-medium-emphasis" v-if="subtitle">{{ subtitle }}</span>
        </div>
      </div>

      <div class="d-flex align-center ga-3 flex-wrap" style="min-width: 300px;">
        <v-text-field
          v-model="search"
          placeholder="Pesquisar..."
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          class="search-field"
          bg-color="grey-lighten-5"
          rounded="lg"
          style="min-width: 200px;"
        ></v-text-field>

        <v-btn 
          color="primary" 
          prepend-icon="mdi-plus" 
          height="40" 
          class="text-capitalize px-6"
          elevation="0"
          rounded="lg"
          @click="$emit('abrirDialog')"
        >
          Novo
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      item-value="id"
      hover
      density="comfortable"
      class="custom-table"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
      </template>

      <template v-slot:no-data>
        <div class="pa-10 text-center">
            <v-icon size="64" color="grey-lighten-2" class="mb-3">mdi-database-off</v-icon>
            <div class="text-body-1 text-medium-emphasis">Nenhum registro encontrado</div>
            <v-btn variant="text" color="primary" class="mt-2" @click="$emit('abrirDialog')">
                Cadastrar o primeiro
            </v-btn>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-center">
          
          <v-tooltip text="Editar" location="top">
            <template v-slot:activator="{ props }">
              <v-btn 
                icon 
                variant="text" 
                density="comfortable" 
                color="blue-darken-1" 
                v-bind="props"
                @click="$emit('abrirDialog', item)"
              >
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip text="Visualizar" location="top" v-if="showView">
            <template v-slot:activator="{ props }">
              <v-btn 
                icon 
                variant="text" 
                density="comfortable" 
                color="grey-darken-1" 
                v-bind="props"
                @click="$emit('viewItens', item)"
              >
                <v-icon>mdi-eye-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip text="Excluir" location="top">
            <template v-slot:activator="{ props }">
              <v-btn 
                icon 
                variant="text" 
                density="comfortable" 
                color="red-darken-1" 
                v-bind="props"
                @click="$emit('delete', item.id)"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </template>

      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { VDataTable } from 'vuetify/components';

// Tipagem correta para Headers
export type VDataTableHeader = InstanceType<typeof VDataTable>['$props']['headers']

const props = defineProps<{
    items: Array<any>;
    headers: VDataTableHeader;
    showView?: boolean;
    // Novas props para estilização
    title?: string;
    subtitle?: string;
    icon?: string;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'abrirDialog', item?: any): void;
    (e: 'delete', id: any): void;
    (e: 'viewItens', item: any): void;
}>();

const search = ref('');

const filteredItems = computed(() => {
    if (!search.value) return props.items;
    const termo = search.value.toLowerCase();
    return props.items.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(termo)
        )
    );
});
</script>

<style scoped>
/* Estilização fina da tabela */
.custom-table :deep(thead th) {
    font-weight: 600 !important;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #6c757d;
    background-color: #f8f9fa !important; /* Fundo cinza claro no header */
    letter-spacing: 0.5px;
}

.search-field :deep(.v-field__outline__start),
.search-field :deep(.v-field__outline__end) {
    border-color: #e0e0e0;
}
</style>