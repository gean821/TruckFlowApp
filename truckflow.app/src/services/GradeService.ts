import type gradeCreateDto from "@/Dtos/grade/gradeCreateDto";
import type GradeResponseDto from "@/Dtos/grade/gradeResponseDto";
import type GradeUpdateDto from "@/Dtos/grade/gradeUpdateDto";
import http from "@/http/http";

export default class GradeService {
    static async GetById(id: string): Promise<GradeResponseDto> {
        const { data } = await http.get(`/Grade/${id}`);
        return data;
    }

    static async GetAll(): Promise<GradeResponseDto[]> {
        const { data } = await http.get('/Grade');
        return data;
    }

    static async AddGrade(Grade: gradeCreateDto): Promise<GradeResponseDto> {
        const { data } = await http.post('/Grade', Grade);
        return data;
    }

    static async UpdateGrade(id: string, GradeAtualizado: GradeUpdateDto): Promise<GradeResponseDto> {
        const { data } = await http.put(`/Grade/${id}`, GradeAtualizado);
        return data;
    }

    static async DeleteGrade(id: string): Promise<void> {
        await http.delete(`/Grade/${id}`);
    }
}
