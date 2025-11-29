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
          @click="$emit('add-main')"
        >
          Novo Fornecedor
        </v-btn>
      </div>
    </div>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="filteredItems"
      item-value="id"
      show-expand
      hover
      density="comfortable"
      class="main-table"
    >
      <template #item.actions="{ item }">
        <div class="d-flex justify-center">
            <v-tooltip text="Editar Fornecedor" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon variant="text" density="comfortable" color="blue-darken-1" v-bind="props" @click.stop="$emit('edit-main', item)">
                        <v-icon>mdi-pencil-outline</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
            
            <v-tooltip text="Excluir Fornecedor" location="top">
                <template v-slot:activator="{ props }">
                    <v-btn icon variant="text" density="comfortable" color="red-darken-1" v-bind="props" @click.stop="$emit('delete-main', item.id)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </div>
      </template>

      <template #item.createdAt="{ value }">
        <span class="text-body-2 text-medium-emphasis">{{ formatarData(value) }}</span>
      </template>

      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="pa-0">
            
            <v-sheet color="grey-lighten-5" class="pa-4 border-b inner-shadow">
                <div class="d-flex align-center justify-space-between mb-3 px-2">
                    <div class="d-flex align-center text-primary font-weight-bold">
                        <v-icon size="small" class="mr-2">mdi-package-variant-closed</v-icon>
                        <span class="text-uppercase text-caption">Produtos Vinculados a {{ item.nome }}</span>
                    </div>
                    <v-btn 
                        size="small" 
                        color="success" 
                        variant="tonal" 
                        prepend-icon="mdi-plus" 
                        class="text-capitalize"
                        @click="$emit('add-sub', item)"
                    >
                        Adicionar Produto
                    </v-btn>
                </div>

                <v-data-table
                    v-if="getSubItems && subHeaders"
                    :headers="subHeaders"
                    :items="getSubItems(item)"
                    density="compact"
                    class="rounded-lg border bg-white elevation-0 sub-table"
                    hide-default-footer
                >
                    <template #item.actions="{ item: subItem }">
                        <div class="d-flex justify-end ga-1">
                            <v-btn size="x-small" icon variant="text" color="blue" @click="$emit('edit-sub', subItem)">
                                <v-icon size="18">mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn size="x-small" icon variant="text" color="red" @click="$emit('delete-sub', item.id, subItem.id)">
                                <v-icon size="18">mdi-close</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    
                     <template #item.createdAt="{ value }">
                        <span class="text-caption text-medium-emphasis">{{ formatarData(value) }}</span>
                    </template>

                    <template #no-data>
                        <div class="text-caption text-medium-emphasis py-2 text-center">
                            Nenhum produto vinculado ainda.
                        </div>
                    </template>
                </v-data-table>
            </v-sheet>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { VDataTable } from 'vuetify/components';
import { formatarData } from '@/utils/date-format';
import type IProduto from '@/Entities/IProduto';
import type IFornecedor from '@/Entities/IFornecedor';

export type VDataTableHeader = InstanceType<typeof VDataTable>['$props']['headers'];

const props = defineProps<{
  headers: VDataTableHeader;
  subHeaders?: VDataTableHeader;
  items: Array<any>;
  getSubItems?: (item: IFornecedor) => any[];
  title?: string;
  subtitle?: string;
  icon?: string;
}>();

const emit = defineEmits<{
  (e: 'add-main'): void;
  (e: 'edit-main',item: IFornecedor): void;
  (e: 'delete-main', id: string): void;
  (e: 'add-sub', parent: IFornecedor): void;
  (e: 'edit-sub', item: IProduto): void;
  (e: 'delete-sub', fornecedorId: any, produtoId: any): void;
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
.main-table :deep(thead th) {
    font-weight: 700 !important;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #424242;
    background-color: #f8f9fa !important;
    letter-spacing: 0.5px;
}

.sub-table :deep(thead th) {
    font-weight: 600 !important;
    font-size: 0.7rem;
    color: #616161;
    background-color: #ffffff !important;
    border-bottom: 1px solid #eeeeee;
}

.inner-shadow {
    box-shadow: inset 0px 4px 8px -4px rgba(0,0,0,0.1) !important;
}

.search-field :deep(.v-field__outline__start),
.search-field :deep(.v-field__outline__end) {
    border-color: #e0e0e0;
}
</style>