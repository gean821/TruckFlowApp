<template>
<v-container fluid class="pa-6 bg-grey-lighten-4 h-100"> 
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Gestão de Grades</h1>
      <p class="text-body-1 text-grey">Gerencie a disponibilidade de recebimento de cargas da fábrica.</p>
    </div>

      <v-col cols="10" lg="12">
        <GradeView
          :items="gradeStore.grades" 
          :loading="gradeStore.loading"
          @delete="handleDelete"
          @edit="handleEdit"
        />
      </v-col>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useGradeStore } from '@/stores/GradeStore';
import GradeView from './GradeView.vue';

const gradeStore = useGradeStore();

onMounted(() => {
  gradeStore.GetAll();
});

async function handleDelete(id: string) {
  if (confirm("Tem certeza que deseja remover esta grade?")) {
    await gradeStore.DeleteGrade(id);
  }
}

function handleEdit(item: any) {
  alert("Funcionalidade de edição (pode abrir um modal ou preencher o form)");
  // Implementar lógica de popular o form
}
</script>