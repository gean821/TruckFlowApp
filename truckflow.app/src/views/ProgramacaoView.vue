<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Gestão de Grades</h1>
      <p class="text-body-1 text-grey">Gerencie a disponibilidade de recebimento de cargas da fábrica.</p>
    </div>

    <v-row>
      <v-col cols="12">
        <GradeView :items="gradeStore.grades" :loading="gradeStore.loading" @delete="openDeleteDialog"
          @edit="handleEdit" />
      </v-col>
    </v-row>

    <ConfirmDeleteDialog 
      v-model="showDeleteDialog"
      :loading="isDeleting"
      message="Tem certeza que deseja excluir esta grade? Todos os agendamentos futuros não realizados serão cancelados automaticamente."
      @confirm="confirmDelete" />

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGradeStore } from '@/stores/GradeStore';
import GradeView from './GradeView.vue';
import ConfirmDeleteDialog from '@/components/modals/ConfirmDeleteDialog.vue';

const gradeStore = useGradeStore();

// Estado do Modal de Exclusão
const showDeleteDialog = ref(false);
const itemToDeleteId = ref<string | null>(null);
const isDeleting = ref(false); // Loading local do botão do modal

onMounted(() => {
  gradeStore.GetAll();
});

// 1. Chamado quando clica na lixeira na lista
function openDeleteDialog(id: string) {
  itemToDeleteId.value = id;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  if (!itemToDeleteId.value) return;

  isDeleting.value = true; 
  try {
    await gradeStore.DeleteGrade(itemToDeleteId.value);
    showDeleteDialog.value = false; 
  } catch (error) {
  } finally {
    isDeleting.value = false;
    itemToDeleteId.value = null;
  }
}

function handleEdit(item: any) {
  // Lógica de edição futura (Redirecionar ou abrir outro modal)
  console.log("Editar", item);
}
</script>