import type GradeListQueryDto from "@/Dtos/grade/gradeListQueryDto";
import type PagedResponseDto from "@/Dtos/Shared/pagedResponseDto";
import type GradeResponseDto from "@/Dtos/grade/gradeResponseDto";
import type gradeCreateDto from "@/Dtos/grade/gradeCreateDto";
import type GradeUpdateDto from "@/Dtos/grade/gradeUpdateDto";
import GradeService from "@/services/GradeService";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "@/stores/ToastStore";

export const useGradeStore = defineStore('Grade', () => {
    const grades = ref<GradeResponseDto[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    
    const pageNumber = ref(1);
    const pageSize = ref(10);
    const totalCount = ref(0);
    const totalPages = ref(0);

    const toast = useToastStore();

    async function GetAll(query: GradeListQueryDto = {}) {
        loading.value = true;
        try {
            const response = await GradeService.GetAll({
                pageNumber: query.pageNumber ?? pageNumber.value,
                pageSize: query.pageSize ?? pageSize.value,
                produtoId: query.produtoId,
                fornecedorId: query.fornecedorId,
                localDescargaId: query.localDescargaId,
                dataInicio: query.dataInicio,
                dataFim: query.dataFim,
                search: query.search
            });

            grades.value = response.items;
            pageNumber.value = response.pageNumber;
            pageSize.value = response.pageSize;
            totalCount.value = response.totalCount;
            totalPages.value = response.totalPages;
        } catch (err) {
            error.value = "Erro ao buscar grades";
            console.error(err);
            toast.notify("Erro ao carregar lista de grades.", "error");
        } finally {
            loading.value = false;
        }
    }

    async function GetById(id: string) {
        return await GradeService.GetById(id);
    }

    async function AddGrade(grade: gradeCreateDto) {
        loading.value = true;
        try {
            const gradeAdicionado = await GradeService.AddGrade(grade);
            toast.notify("Grade criada com sucesso!", "success");
            return gradeAdicionado;
        } catch (err) {
            error.value = "Erro ao criar Grade";
            toast.notify("Falha ao criar grade. Verifique os dados.", "error");
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function UpdateGrade(id: string, gradeAtualizado: GradeUpdateDto) {
        loading.value = true;
        try {
            const grade = await GradeService.UpdateGrade(id, gradeAtualizado);
            const index = grades.value.findIndex(x => x.id === id);
            if (index !== -1) grades.value[index] = grade;
            toast.notify("Grade atualizada com sucesso.", "success");
            return grade;
        } catch (err) {
            toast.notify("Erro ao atualizar grade.", "error");
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function DeleteGrade(id: string) {
        loading.value = true;
        try {
            await GradeService.DeleteGrade(id);
            grades.value = grades.value.filter(x => x.id !== id);
            toast.notify("Grade removida.", "info");
        } catch (err) {
            console.error(err);
            toast.notify("Não foi possível excluir esta grade.", "error");
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        grades,
        loading,
        error,
        pageNumber,
        pageSize,
        totalCount,
        totalPages,
        GetAll,
        GetById,
        AddGrade,
        UpdateGrade,
        DeleteGrade
    };
});
