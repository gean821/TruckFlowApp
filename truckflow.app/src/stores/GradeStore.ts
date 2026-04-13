// import { ref } from 'vue';
// import { useToastStore } from '@/stores/ToastStore'; // Importe a Store de Toast
// import { defineStore } from 'pinia';
// import type { GradeCreateDto, GradeResponseDto, GradeUpdateDto } from '@/entities/grade.types';
// import { GradeService } from '@/services/GradeService';

// export const useGradeStore = defineStore('Grade', () => {
//     const grades = ref<GradeResponseDto[]>([]);
//     const loading = ref(false);
//     const error = ref<string | null>(null);
//     const toast = useToastStore();
//     const service = GradeService();
//     async function GetAll() {
//         loading.value = true;
//         try {
//             grades.value = await service.getAll();
//         } catch (err) {
//             error.value = "Erro ao buscar grades";
//             console.error(err);
//             toast.notify("Erro ao carregar lista de grades.", "error");
//         } finally {
//             loading.value = false;
//         }
//     }

//     async function GetById(id: string) {
//         return await service.getById(id);
//     }

//     async function AddGrade(grade: GradeCreateDto) {
//         loading.value = true;
//         try {
//             const gradeAdicionado = await service.addGrade(grade);
//             grades.value.push(gradeAdicionado);
//             toast.notify("Grade criada com sucesso!", "success");
//             return gradeAdicionado;
//         } catch (err) {
//             error.value = 'Erro ao criar Grade';
//             toast.notify("Falha ao criar grade. Verifique os dados.", "error");
//             throw err;
//         } finally {
//             loading.value = false;
//         }
//     }

//     async function UpdateGrade(
//         id: string,
//         gradeAtualizado: GradeUpdateDto) {
//         loading.value = true;
//         try {
//             const grade = await service.updateGrade(id, gradeAtualizado);
//             const index = grades.value.findIndex(x => x.id === id);
//             if (index !== -1) {
//                 grades.value[index] = grade;
//             }
//             toast.notify("Grade atualizada com sucesso.", "success");
//             return grade;
//         } catch (err) {
//             toast.notify("Erro ao atualizar grade.", "error");
//             throw err;
//         } finally {
//             loading.value = false;
//         }
//     }

//     async function DeleteGrade(id: string) {
//         loading.value = true;
//         try {
//             await service.deleteGrade(id);
//             grades.value = grades.value.filter(x => x.id !== id);
//             toast.notify("Grade removida.", "info");
//         } catch (err) {
//             console.error(err);
//             toast.notify("Não foi possível excluir esta grade.", "error");
//             throw err;
//         } finally {
//             loading.value = false;
//         }
//     }

//     return {
//         grades,
//         error,
//         loading,
//         GetAll,
//         GetById,
//         UpdateGrade,
//         DeleteGrade,
//         AddGrade
//     }
// })