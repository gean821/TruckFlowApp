import type CreateAgendamentoAdminDto from "@/Dtos/agendamento/agendamentoAdminCreate.dto";
import type AgendamentoAdminResponse from "@/Dtos/agendamento/agendamentoAdminResponse.dto";
import type AgendamentoAdminUpdateDto from "@/Dtos/agendamento/agendamentoAdminUpdate.dto";
import type IAgendamentoFilterDto from "@/Dtos/agendamento/agendamentoFilterDto";
import AgendamentoService from "@/services/AgendamentoService";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useAgendamentoStore = defineStore('Agendamento', () => {
    const agendamentosFiltrados = ref<IAgendamentoFilterDto[]>([]);
    const agendamentos = ref<AgendamentoAdminResponse[]>([]);
    const loading = ref(false);

    async function GetById(id: string) {
        return await AgendamentoService.GetById(id);
    }

    async function getByFilters(filters: IAgendamentoFilterDto) {
        loading.value = true;

        try {
            const result = await AgendamentoService.getByFilters(filters);
            agendamentos.value = result.map(x => ({ ...x }));
        } finally {
            loading.value = false;
        }
    }

    async function AddAgendamento(agendamento: CreateAgendamentoAdminDto) {
        const agendamentoAdicionado = await AgendamentoService.AddAgendamento(agendamento);
        agendamentos.value.push(agendamentoAdicionado);
        return agendamentoAdicionado;
    }

    async function realizarCheckIn(id: string) {
        await AgendamentoService.checkIn(id);
        atualizarStatusLocal(id, 'EmAndamento');
    }

    async function realizarCheckOut(id: string) {
        await AgendamentoService.checkOut(id);
        atualizarStatusLocal(id, 'Finalizado');
    }

    async function cancelarAgendamento(id: string) {
        await AgendamentoService.cancelar(id);
        atualizarStatusLocal(id, 'Cancelado');
    }


    function atualizarStatusLocal(id: string, novoStatus: string) {
        const index = agendamentos.value.findIndex(a => a.id === id);
        if (index !== -1) {
            agendamentos.value[index].status = novoStatus;
        }
    }

    async function UpdateAgendamento(id: string, agendamentoAtualizado: AgendamentoAdminUpdateDto) {
        const agendamento = await AgendamentoService.UpdateAgendamento(id, agendamentoAtualizado);
        const index = agendamentos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            agendamentos.value[index] = agendamento;
        }

        return agendamento;
    }

    async function DeleteAgendamento(id: string) {
        await AgendamentoService.DeleteAgendamento(id);
        const index = agendamentos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            agendamentos.value.splice(index, 1);
        }
    }

    return {
        agendamentosFiltrados,
        agendamentos,
        loading,
        GetById,
        getByFilters,
        UpdateAgendamento,
        atualizarStatusLocal,
        cancelarAgendamento,
        realizarCheckIn,
        realizarCheckOut,
        DeleteAgendamento,
        AddAgendamento
    }
})


