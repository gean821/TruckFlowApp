<template>
   <div class="section d-flex flex-column justify-center align-center pa-5 w-100">
      <h1 prepend-icon="mdi-plus"> Cadastrar Produto</h1>
      <v-card height="auto" 
         width="400"
         elevation="5"
         rounded="xl"
         color="#EDEAEA">
         <v-card-text class="d-flex flex-column pa-5">
            <v-row>
               <v-col cols="12" sm="12">
                  <v-text-field v-model="produto" 
                     label="Insira o nome do produto" 
                     variant="outlined"
                     prepend-inner-icon="mdi-rename"
                     class="w-100" />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12" sm="12">
                  <v-text-field v-model="localDescarga" 
                     label="Informe o local de descarga"
                     type="text"
                     variant="outlined"
                     prepend-inner-icon="mdi-rename" class="w-100" />
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
import {ref} from 'vue';

const produto = ref('');
const localDescarga = ref('');

async function cadastroProduto() {
   
   }
</script>