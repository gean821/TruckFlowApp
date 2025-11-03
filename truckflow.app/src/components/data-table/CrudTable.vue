<template>
    <v-data-table 
        :headers="headers"
        :items="filteredItems"
        class="elevation-2 pa-3 w-100"
        item-value="id"
    >
        <template #top>
            <div class="d-flex justify-center align-center pa-5 ">
                <v-text-field v-model="search" label="Pesquisar..." variant="outlined" density="comfortable" clearable
                    prepend-inner-icon="mdi-magnify" />
            </div>

            <div class="d-flex justify-end pa-5">
                <v-btn color="green" prepend-icon="mdi-plus" @click="$emit('abrirDialog')">
                    Novo
                </v-btn>
            </div>
        </template>

        <template #item.actions="{ item }">
            <div class="d-flex justify-center ga-2">
                <v-icon size="28" color="blue" class="icon" @click="$emit('abrirDialog', item)">
                    mdi-pencil
                </v-icon>
                <v-icon size="28" color="red" class="icon" @click="$emit('delete', item.id)">
                    mdi-delete
                </v-icon>
            </div>
        </template>

        <template v-slot:item.createdAt="{ value }">
            {{ formatarData(value) }}
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { VDataTable } from 'vuetify/components';
export type VDataTableHeader = InstanceType<typeof VDataTable>['$props']['headers']
import { formatarData } from '@/utils/date-format';

const props = defineProps<{
    items: Array<any>;
    headers: VDataTableHeader
}>();

const emit = defineEmits<{
    (e: 'abrirDialog', item?: any): void;
    (e: 'delete', item: any): void;
}>();

const search = ref('');

const filteredItems = computed(() => {
    if (!search.value) {
        return props.items;
    }

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
