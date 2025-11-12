<template>
    <div class="d-flex flex-row justify-center align-center mt-3 pa-5">
        <h1 class="text-h5"> Locais de Descarga</h1>
    </div>
    
    <CrudTable 
        :headers="headers"
        :items=locais 
        @delete="deleteLocalDescarga"
        @abrir-dialog="abrirDialog" 
    />

    <CrudTableModal 
        label="Nome do local de descarga" 
        @salvar="salvarLocal" 
        :is-editing="isEditing"
        :value="formModel.nome"
        v-model="dialog" 
    />
</template>

<script setup lang="ts">
import CrudTable, { type VDataTableHeader } from "@/components/data-table/CrudTable.vue";
import { computed, onMounted, ref } from "vue";
import type ILocalDescarga from "@/Entities/ILocalDescarga";
import { useLocalDescargaStore } from "@/stores/LocalDescargaStore";
import CrudTableModal from "@/components/modals/CrudTable-modal.vue";

onMounted(() => {
    store.GetAll();
})

const store = useLocalDescargaStore();
const locais = computed(() => store.locaisDeDescarga);

const headers: VDataTableHeader = [
    { title: "IDENTIFICADOR", key: "id", align: "start"},
    { title: "NOME", key: "nome" },
    { title: "CRIADO EM", key: "createdAt" },
    { title: "AÇÕES", key: "actions", sortable: false, align: "center" },
];

const dialog = ref(false);
const isEditing = ref(false);

const formModel = ref<ILocalDescarga>({
    nome: '',
    id: undefined
});

function abrirDialog(local?: ILocalDescarga) {
    if (local && local.id) {
        isEditing.value = true;
        formModel.value = { ...local };
    }
    else {
        isEditing.value = false;
        formModel.value = {
            id: undefined,
            nome: '',
        };
    }

    dialog.value = true;
}

async function salvarLocal(nomeDigitado: string) {
    formModel.value.nome = nomeDigitado; 

    const local: ILocalDescarga = {
        nome: formModel.value.nome,
        id: formModel.value.id
    };

    if (isEditing.value && local.id) {
        await store.UpdateLocalDescarga(local.id, local);
    } 
    else {
        await store.AddLocalDescarga(local);
    }

    dialog.value = false;
}

async function deleteLocalDescarga(id: string) {
    alert("voce tem certeza que deseja excluir?");
    await store.DeleteLocalDescarga(id);

}
</script>

<style scoped>
.text-h5 {
    font-family: "Montserrat", sans-serif;
}

</style>
