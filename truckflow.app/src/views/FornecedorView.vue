<template>
    <v-container fluid class="pa-6">
        <ExpandableTable 
        title="Gestão de fornecedores"
        subtitle="Gerencie parceiros e seus produtos vinculados"
        icon="mdi-domain"
        :headers="fornecedorHeaders"
        :sub-headers=produtosHeaders
        :items=fornecedores
        :get-sub-items="(fornecedor) => fornecedor.produtos ?? []"
        @add-main="abrirDialogFornecedor"
        @edit-main="(fornecedor) => abrirDialogFornecedor(fornecedor)"
        @delete-main="deleteFornecedor"
        @add-sub="(fornecedor) => abrirDialogNovoProduto(fornecedor)"
        @vincular-sub="abrirDialogVincularProduto"
        @edit-sub="(produto) => abrirDialogEditarProduto(produto)"
        @delete-sub="(fornecedorId, produtoId) => deleteProduto(fornecedorId, produtoId)"
        />

        <FornecedorModal 
        :is-editing=isEditingFornecedor
        :fornecedor=formModelFornecedor
        v-model="dialogFornecedor"
        @salvar=handleFornecedorSave
        />

        <ProdutoModal 
        :is-editing=isEditingProduto
        v-model=dialogProduto    
        @salvar="saveProduto"
        :locais=locais
        :produto=formModelProduto
        />

        <ProdutoSelectModal 
            :model-value="dialogVincular"
            @update:model-value="dialogVincular = $event"
            :produtos=produtos
            @vincular="vincularProduto"     
        />
    </v-container>

</template>

<script setup lang="ts">
import type { VDataTableHeader } from '@/components/data-table/CrudTable.vue';
import ExpandableTable from '@/components/data-table/ExpandableTable.vue';
import type IFornecedor from '@/entities/IFornecedor';
import type IProduto from '@/entities/IProduto';
import { useFornecedorStore } from '@/stores/FornecedorStore';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { computed, onMounted, ref } from 'vue';
import FornecedorModal from '@/components/modals/FornecedorModal.vue';
import '../entities/IProduto'
import ProdutoModal from '@/components/modals/ProdutoModal.vue';
import { useLocalDescargaStore } from '@/stores/LocalDescargaStore';
import ProdutoSelectModal from '@/components/modals/ProdutoSelectModal.vue';

const dialogFornecedor = ref(false);
const dialogProduto = ref(false);
const isEditingFornecedor = ref(false);
const isEditingProduto = ref(false);
const dialogVincular = ref(false);


const fornecedorHeaders: VDataTableHeader = [
    { title: "IDENTIFICADOR", key: "id", align: "start" },
    { title: "NOME DA EMPRESA", key: "nome" },
    { title: "CNPJ", key: "cnpj" },
    { title: "CRIADO EM", key: "createdAt" },
    { title: "AÇÕES", key: "actions", sortable: false, align: "center" },
];

const produtosHeaders : VDataTableHeader = [
  { title: 'Nome'.toUpperCase(), key: 'nome' as const },
  { title: 'Local de Descarga'.toUpperCase(), key: 'localDescarga' as const},
  { title: 'Data de Criação'.toUpperCase(), key: 'createdAt', align: 'start' as const },
  { title: 'Ações'.toUpperCase(), key: 'actions', sortable: false, align: 'center' as const },
];

onMounted(() => {
    fornecedorStore.GetAll();
    produtoStore.GetAll();
    localStore.GetAll();
    console.log("locais disponíveis:", locais.value);
})

const fornecedorStore = useFornecedorStore();
const fornecedores = computed(() => fornecedorStore.fornecedores)

const produtoStore = useProdutoStore();
const produtos = computed(() => produtoStore.produtos)

const localStore = useLocalDescargaStore();
const locais = computed(() => localStore.locaisDeDescarga)

const formModelFornecedor = ref<IFornecedor>({
    id: undefined,
    nome: '',
    cnpj: '',
    produtos: []
});

const formModelProduto = ref<IProduto>({
    id: undefined,
    localDescargaId: '',
    nome: ''      
});

function abrirDialogFornecedor(fornecedor?: IFornecedor) {
    
    if (fornecedor && fornecedor.id) {
        isEditingFornecedor.value = true;
        formModelFornecedor.value = { ...fornecedor};
    }
    else {
        isEditingFornecedor.value = false;
        formModelFornecedor.value = {
            id: undefined,
            nome: '',
            cnpj: '',
            produtos: []
        };
    }
    
    dialogFornecedor.value = true;
}

async function saveFornecedor() {
    const fornecedor: IFornecedor = {
        id: formModelFornecedor.value.id,
        nome: formModelFornecedor.value.nome,
        cnpj: formModelFornecedor.value.cnpj,
        produtos: formModelFornecedor.value.produtos
    }

    await fornecedorStore.AddFornecedor(fornecedor);
    dialogFornecedor.value = false;
}

async function handleFornecedorSave(fornecedor : IFornecedor) {
    formModelFornecedor.value = fornecedor;

    if (isEditingFornecedor.value) {
        await editFornecedor();
    } else {
        await saveFornecedor();
    }

    dialogFornecedor.value = false;
}


async function editFornecedor() {
    if (!formModelFornecedor.value.id) {
        return;
    } 

    const fornecedor: IFornecedor = {
        id: formModelFornecedor.value.id,
        nome: formModelFornecedor.value.nome,
        cnpj: formModelFornecedor.value.cnpj,
        produtos: formModelFornecedor.value.produtos
    };

    await fornecedorStore.UpdateFornecedor(fornecedor.id!, fornecedor);
}

async function deleteFornecedor(id: string) {
    await fornecedorStore.DeleteFornecedor(id);
}

function abrirDialogNovoProduto(fornecedor: IFornecedor) {
    isEditingProduto.value = false;

    formModelFornecedor.value = { ...fornecedor };
    
    formModelProduto.value = {
        id: '',
        nome: '',
        localDescargaId: undefined

    };

    isEditingProduto.value = false;

    formModelProduto.value = {
        id: undefined,
        nome: '',
        localDescargaId: undefined
    };

    dialogProduto.value = true;
}

function abrirDialogEditarProduto(produto: IProduto) {
    isEditingProduto.value = true;
    formModelProduto.value = {...produto};
    dialogProduto.value = true;
}

async function saveProduto(produto: IProduto) {
  if (isEditingProduto.value && produto.id) {
    const produtoAtualizado = await produtoStore.UpdateProduto(produto.id, produto);
    
    if (produtoAtualizado) {
        fornecedorStore.updateProdutoInFornecedores(produtoAtualizado);
    }
     
  } 
  else {
    const novoProduto = await produtoStore.AddProduto(produto);

    //  vincula ao fornecedor atual
    if (formModelFornecedor.value.id && novoProduto.id) {
      await fornecedorStore.addProdutoToFornecedor(formModelFornecedor.value.id, novoProduto.id!);
    }
  }

  dialogProduto.value = false;
}

async function deleteProduto(fornecedorId: string, produtoId: string) {
    await fornecedorStore.deleteProdutoFromFornecedor(fornecedorId, produtoId);
}

async function abrirDialogVincularProduto(fornecedor: IFornecedor) {
    formModelFornecedor.value = { ...fornecedor };
    dialogVincular.value = true;
}

async function vincularProduto(produtoId: string) {
    if (!produtoId || !formModelFornecedor.value?.id) {
        return;
    }

    await fornecedorStore.addProdutoToFornecedor(formModelFornecedor.value.id, produtoId!);

}

</script>

<style scoped>
.text-h5 {
    font-family: "Montserrat", sans-serif;
}
</style>