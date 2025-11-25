<template>
  <v-container height="auto" width="auto" class="pa-6 mt-5 d-flex flex-column justify-center">
    <v-card class="pa-6" elevation="5">
      <v-card-title class="text-h6">Programação de Agendamentos</v-card-title>
      <v-divider class="my-4"></v-divider>

      <v-row>
        <v-col cols="12" md="6">
          <v-select v-model="form.fornecedor" :items="mock.fornecedores" label="Fornecedor" dense outlined />
        </v-col>

        <v-col cols="12" md="6">
          <v-select v-model="form.produto" :items="mock.produtos" label="Produto" dense outlined />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-select v-model="form.dataInicio" :items="mock.datas" label="Data Início" dense outlined />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="form.dataFim" :items="mock.datas" label="Data Fim" dense outlined />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="form.horaInicial" label="Hora Inicial" type="time" dense outlined />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field v-model="form.horaFinal" label="Hora Final" type="time" dense outlined />
        </v-col>

        <v-col cols="12" md="4">
          <v-select v-model="form.intervalo" :items="mock.intervalos" label="Intervalo entre as grades" dense
            outlined />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn color="green" @click="cadastrar">Agendar</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const mock = {
  fornecedores: ['Cocari', 'Coamo', 'Integrada', 'C Vale'],
  produtos: ['Soja', 'Milho', 'Trigo', 'Farelo'],
  datas: [
    '2025-11-20',
    '2025-11-21',
    '2025-11-22',
    '2025-11-23',
  ],
  intervalos: ['10 min', '20 min', '30 min', '40 min', '1 hora', '2 horas'],
}

const form = reactive({
  fornecedor: null,
  produto: null,
  dataInicio: null,
  dataFim: null,
  horaInicial: null,
  horaFinal: null,
  intervalo: null,
})

function cadastrar() {
  console.log('Dados enviados:', JSON.parse(JSON.stringify(form)))
  alert('Cadastro mockado realizado!')
}
</script>

<style scoped>
.text-h6 {
  font-family: "Montserrat", sans-serif;
}
</style>
