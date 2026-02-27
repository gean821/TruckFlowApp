import type { GradeCreateDto, GradeResponseDto, GradeUpdateDto } from "@/entities/grade.types";
import http from "@/http/http";

export const GradeService = () => {
    const getById = async (id: string): Promise<GradeResponseDto> => {
        const { data } = await http.get(`/Grade/${id}`);
        return data;
    }

    const getAll = async (): Promise<GradeResponseDto[]> => {
        const { data } = await http.get('/Grade');
        return data;
    }

    const addGrade = async (Grade: GradeCreateDto): Promise<GradeResponseDto> => {
        const { data } = await http.post('/Grade', Grade);
        return data;
    }

    const updateGrade = async (
        id: string,
        GradeAtualizado: GradeUpdateDto): Promise<GradeResponseDto> => {
        const { data } = await http.patch(`/Grade/${id}`, GradeAtualizado);
        return data;
    }

    const deleteGrade = async (id: string): Promise<void> => {
        await http.delete(`/Grade/${id}`);
    }

    return {
        addGrade,
        getById,
        getAll,
        deleteGrade,
        updateGrade,
    }
}
