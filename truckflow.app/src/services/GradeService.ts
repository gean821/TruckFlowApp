import type { GradeCreateDto, GradeListQueryDto, GradeResponseDto, GradeUpdateDto } from "@/entities/grade.types";
import type { PaginatedResponse } from "@/entities/paginatedResponse";
import http from "@/http/http";

export const GradeService = () => {
    const getById = async (id: string): Promise<GradeResponseDto> => {
        const { data } = await http.get(`/Grade/${id}`);
        return data;
    }

    const getAll = async (query: GradeListQueryDto): Promise<PaginatedResponse<GradeResponseDto>> => {
        const { data } = await http.get('/Grade', {
            params: query
        });

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
