<template>
  <v-data-table
    :headers="headers"
    :items="filteredItems"
    item-value="id"
    class="elevation-2 pa-3 w-100"
    show-expand
  >
    <template #top>
      <div class="d-flex justify-center align-center pa-5">
        <v-text-field
          v-model="search"
          label="Pesquisar..."
          variant="outlined"
          density="comfortable"
          clearable
          prepend-inner-icon="mdi-magnify"
        />
      </div>

      <div class="d-flex justify-end pa-5">
        <v-btn color="green" prepend-icon="mdi-plus" @click="$emit('add-main')">
          Novo
        </v-btn>
      </div>
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex justify-center ga-2">
        <v-icon size="28" color="blue" class="icon" @click="$emit('edit-main',item)">
          mdi-pencil
        </v-icon>
        <v-icon size="28" color="red" class="icon" @click="$emit('delete-main', item.id)">
          mdi-delete
        </v-icon>
      </div>
    </template>

    <template #item.createdAt="{ value }">
      {{ formatarData(value) }}
    </template>

    <template #expanded-row="{ item }">
      <v-data-table
        v-if="getSubItems && subHeaders"
        :headers="subHeaders"
        :items="getSubItems(item)"
        density="compact"
        class="mx-8 my-2 elevation-2"
        hide-default-footer
      >
        <!-- Ações dos subitens -->
        <template #item.actions="{ item: subItem }">
          <div class="d-flex justify-center ga-2">
            <v-icon size="24" color="blue" class="icon" @click="$emit('edit-sub', subItem)">
              mdi-pencil
            </v-icon>
            <v-icon size="24" color="red" class="icon" @click="$emit('delete-sub', item.id, subItem.id)">
              mdi-delete
            </v-icon>
          </div>
        </template>

        <template #top>
          <div class="d-flex justify-end pa-2">
            <v-btn
              color="green"
              size="small"
              prepend-icon="mdi-plus"
              @click="$emit('add-sub', item)"
            >
              Adicionar Produto
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </template>
  </v-data-table>
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
}>();

const emit = defineEmits<{
  (e: 'add-main'): void;
  (e: 'add-sub', parent: IProduto): void;
  (e: 'edit-main',item: IFornecedor): void;
  (e: 'edit-sub', item: IProduto): void;
  (e: 'delete-main', id: string): void;
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
.icon {
  transition: box-shadow 0.3s ease-out, transform 0.3s ease-out;
  cursor: pointer;
}

.icon:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transform: scale(1.3);
}
</style>
