export default interface gradeListQueryDto {
    pageNumber?: number
    pageSize?: number
    produtoId?: string
    fornecedorId?: string
    localDescargaId?: string
    dataInicio?: string
    dataFim?: string
    search?: string
}