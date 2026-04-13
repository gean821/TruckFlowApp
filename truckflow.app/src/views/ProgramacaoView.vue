<template>
  <v-container fluid class="pa-6 bg-grey-lighten-4 h-100">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-3">Gestão de Grades</h1>
      <p class="text-body-1 text-grey">Gerencie a disponibilidade de recebimento de cargas da fábrica.</p>
    </div>

    <v-row>
      <v-col cols="12">
        <GradeView  
          @delete="openDeleteDialog"
          @edit="handleEdit" 

        />
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
import GradeView from './GradeView.vue';
import ConfirmDeleteDialog from '@/components/modals/ConfirmDeleteDialog.vue';
import { useGrade } from '@/hooks/useGrade';
const {deleteGrade, isDeleting} = useGrade();
const showDeleteDialog = ref(false);
const itemToDeleteId = ref<string | null>(null);

function openDeleteDialog(id: string) {
  itemToDeleteId.value = id;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  if (!itemToDeleteId.value) {
    return;
  } 

  isDeleting.value = true; 
  try {
    await deleteGrade(itemToDeleteId.value);
    showDeleteDialog.value = false; 
  } catch (error) {
  } finally {
    isDeleting.value = false;
    itemToDeleteId.value = null;
  }
}

function handleEdit(item: any) {
  console.log("Editar", item);
}
</script>