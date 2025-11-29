<template>
  <v-content fluid class="pa-5">

  <CrudTable 
    :headers=headers
    :items=produtos
    icon="mdi-package"
    title="Produtos Do Sistema"
    subtitle="Gerencie os produtos do sistema"
    @abrir-dialog="abrirDialog"
    @delete="removerProduto"
  />

   <v-dialog v-model="dialog"
     max-width="500">
    <v-card
      rounded="lg"
      :title="`${isEditing ? 'Insira os dados' : 'Insira as informações'} `"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="formModel.nome" label="Nome do produto"
              variant="outlined"
            >
            </v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select v-model="formModel.localDescargaId"
              :items="locais" 
              label="Local de descarga"
              item-title="nome"
              item-value="id"
              persistent-hint
              width="400"
              variant="outlined"
              density="comfortable"
            >
            </v-select>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancelar"
          variant="elevated"
          @click="dialog = false"
          color="red"
          class="pa-2"
          elevation="3"
          rounded="lg"
          density="default"
        >
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Salvar" 
          @click="salvar()"
          color="blue"
          class="pa-2"
          variant="elevated"
          elevation="3"
          rounded="lg"
          density="default"
        > 
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-content >
</template>

<script setup lang="ts">
import CrudTable from '@/components/data-table/CrudTable.vue';
import type IProduto from '@/Entities/IProduto';
import { useLocalDescargaStore } from '@/stores/LocalDescargaStore';
import { useProdutoStore } from '@/stores/ProdutoStore';
import { computed, onMounted, ref } from 'vue';

onMounted(() => {
  store.GetAll(),
  localDescargaStore.GetAll();
});

const store = useProdutoStore();
const produtos = computed(() =>  store.produtos)

const localDescargaStore = useLocalDescargaStore();
const locais = computed(() => localDescargaStore.locaisDeDescarga);

const dialog = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const search = ref('');


const headers = [
  { title: 'IDENTIFICADOR'.toUpperCase(), key: 'id', align: 'start' as const},
  { title: 'Nome'.toUpperCase(), key: 'nome' as const },
  { title: 'Local de Descarga'.toUpperCase(), key: 'localDescarga' as const},
  { title: 'Data de Criação'.toUpperCase(), key: 'createdAt', align: 'start' as const },
  { title: 'Ações'.toUpperCase(), key: 'actions', sortable: false, align: 'center' as const },
  { class: 'header'}
];

const formModel = ref<IProduto> ({
  nome: '',
  localDescargaId: '',
  id: undefined
});

function abrirDialog(item?: IProduto) {
  
  if (item) {
    isEditing.value = true;
    formModel.value = { ...item }; 
  }
  else {
    isEditing.value = false;
     formModel.value = {
      id: undefined,
      nome: '',
      localDescargaId: ''
    };
  }

  dialog.value = true;
}

async function removerProduto(id: string) {
  await store.DeleteProduto(id)
}

async function salvar() {

  const produto: IProduto = {
    nome: formModel.value.nome,
    localDescargaId: formModel.value.localDescargaId,
    id: formModel.value.id
  };

  if (isEditing.value && produto.id) {
    await store.UpdateProduto(produto.id, produto);
  }
  else 
  {
    await store.AddProduto(produto);
  }
  
  dialog.value = false;
}

const formatarData = (dataString: string): string => {
    if (!dataString) {
      return '';
    }

    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}
</script>

<style scoped>

#h1 {
   font-family: "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
  }

.tabela-produtos thead th {
  background-color: #2196F3 !important; 
}

.icon {
  transition: box-shadow 0.3s ease-out, transform 0.3s ease-out;
}

.icon:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transform: scale(1.3);
}
</style>