import type gradeCreateDto from "@/Dtos/grade/gradeCreateDto";
import type GradeResponseDto from "@/Dtos/grade/gradeResponseDto";
import type GradeUpdateDto from "@/Dtos/grade/gradeUpdateDto";
import type IGrade from "@/entities/IGrade";
import http from "@/http/http";
import GradeService from "@/services/GradeService";
import { defineStore } from "pinia";
import { provide, ref } from 'vue';

export const useGradeStore = defineStore('Grade', () => {
    const grades = ref<GradeResponseDto[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function GetAll() {
        loading.value = true;

        try {
            grades.value = await GradeService.GetAll();
        } catch (err) {
            error.value = "Erro ao buscar grades";
            console.error(err);
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
            grades.value.push(gradeAdicionado);
            return gradeAdicionado;

        } catch (err) {
            error.value = 'Erro ao criar Grade';
            throw err;

        } finally {
            loading.value = false;
        }
    }

    async function UpdateGrade(id: string, gradeAtualizado: GradeUpdateDto) {
        const grade = await GradeService.UpdateGrade(id, gradeAtualizado);
        const index = grades.value.findIndex(x => x.id === id);

        if (index !== -1) {
            grades.value[index] = grade;
        }

        return grade;
    }

    async function DeleteGrade(id: string) {
        loading.value = true;

        try {
            await GradeService.DeleteGrade(id);
            grades.value = grades.value.filter(x => x.id !== id);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        grades,
        error,
        loading,
        GetAll,
        GetById,
        UpdateGrade,
        DeleteGrade,
        AddGrade
    }
})


