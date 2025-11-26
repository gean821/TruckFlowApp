import type IAgendamento from "@/Entities/IAgendamento";
import http from "@/http/http";
import AgendamentoService from "@/services/AgendamentoService";
import { defineStore } from "pinia";
import { provide, ref } from 'vue';

export const useAgendamentoStore = defineStore('Agendamento', () => {
    const agendamentos = ref<IAgendamento[]>([]);

    async function GetAll() {
        agendamentos.value = await AgendamentoService.GetAll();
    }

    async function GetById(id: string) {
        return await AgendamentoService.GetById(id);
    }

    async function AddAgendamento(Agendamento: IAgendamento) {
        const receb = await AgendamentoService.AddAgendamento(Agendamento);
        agendamentos.value.push(receb);
        return receb;
    }

    async function UpdateAgendamento(id: string, AgendamentoAtualizado: IAgendamento ) {
        const Agendamento = await AgendamentoService.UpdateAgendamento(id, AgendamentoAtualizado);
        const index = agendamentos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            agendamentos.value[index] = Agendamento;
        }
        
        return Agendamento;
    }

    async function DeleteAgendamento(id: string) {
        await AgendamentoService.DeleteAgendamento(id);
        const index = agendamentos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            agendamentos.value.splice(index, 1);
        }
    }

    return {
        agendamentos,
        GetAll,
        GetById,
        UpdateAgendamento,
        DeleteAgendamento,
        AddAgendamento
    }
})


