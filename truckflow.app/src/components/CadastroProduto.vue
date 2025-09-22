<template>
   <div class="section d-flex flex-column justify-center align-center pa-8 w-100 mt-5 ga-8">
      <h1 prepend-icon="mdi-plus" id="h1-id"> Insira as informações para o cadastro</h1>
      <v-card height="300" 
         width="450"
         elevation="5"
         rounded="xl"
         color="#EDEAEA">
         <v-card-text class="d-flex flex-column mt-5 pa-5">
            <v-row>
               <v-col cols="12" sm="12">
                  <v-text-field v-model="produto" 
                     label="Nome do produto" 
                     variant="outlined"
                     prepend-inner-icon="mdi-rename"
                     class="w-100" />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12" sm="12">
                  <v-select class="d-flex flex-column"
                        density="comfortable"
                        v-model="localDescarga"
                        :items="teste" item-value="id"
                            item-title="Nome"
                            hint="Selecione o Local de descarga" label="Local de Descarga"
                           persistent-hint
                           rounded="xl">
                    </v-select>
                  </v-col>
            </v-row>
         </v-card-text>
      </v-card>

      <div class="buttons d-flex flex-row pa-5 mt-10 ga-5">
         <v-btn 
            variant="outlined"
            elevation="5"
            width="150"
            color="#059797"
            to="gerenciar"
         >
            Voltar
         </v-btn>

          <v-btn 
            variant="outlined"
            elevation="5"
            width="150"
            color="#187900"
         >
            Cadastrar
         </v-btn>
      </div>
   </div>
</template>

<script setup lang="ts">
import type ILocalDescarga from '@/Entities/ILocalDescarga';
import { useLocalDescargaStore } from '@/stores/LocalDescargaStore';
import {computed, onMounted, ref} from 'vue';

const produto = ref('');
const localDescarga = ref('');
const localDescargaStore = useLocalDescargaStore();
const teste = ref([]);
const locais = computed(() => localDescargaStore.GetAll());

onMounted (()=> 
   localDescargaStore.GetAll()
)

async function cadastroProduto() {
   
   }
</script>


<style scoped>

#h1-id {
   font-family: "Montserrat", sans-serif;
   font-optical-sizing: auto;
   font-weight: 15px;
   font-style: normal;
}
</style>