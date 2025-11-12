<template>
    <div class="d-flex justify-center align-center pa-5 ">
        <v-text-field
            v-model="search"
            label="Pesquisar..."
            variant="outlined"
            density="comfortable"
            clearable
            prepend-inner-icon="mdi-magnify" 
        />
    </div>
</template>
<script setup lang="ts">
import {ref,computed} from 'vue'

const props = defineProps<{
    items: Array<any>
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
