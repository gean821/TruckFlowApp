import { ref } from 'vue'
import { defineStore } from 'pinia'
import FornecedorService from '@/services/FornecedorService';
import type IFornecedor from '@/Entities/IFornecedor';

export const useFornecedorStore = defineStore('Fornecedor', () => {
  const fornecedores = ref<IFornecedor[]>([]);

  async function GetAll() {
    fornecedores.value = await FornecedorService.GetAll();
  }

  async function GetById(id: string) {
    await FornecedorService.GetById(id);
  }

  async function AddFornecedor(Fornecedor: IFornecedor) {
    const fornecedor = await FornecedorService.AddFornecedor(Fornecedor);
    fornecedores.value.push(fornecedor);
  }

  async function UpdateFornecedor(id: string, fornecedorAtualizado: IFornecedor) {
    const fornecedor = await FornecedorService.UpdateFornecedor(id, fornecedorAtualizado);
    const index = fornecedores.value.findIndex(x => x.id === fornecedorAtualizado.id);

    if (index !== -1) {
      fornecedores.value[index] = fornecedor;
    }
  }

  async function DeleteFornecedor(id: string) {
    await FornecedorService.DeleteFornecedor(id);
    const index = fornecedores.value.findIndex(x => x.id === id);
    
    if (index !== -1) {
      fornecedores.value.splice(index, 1);
    }
  }

  return {
    fornecedores,
    GetAll,
    GetById,
    AddFornecedor,
    UpdateFornecedor,
    DeleteFornecedor
  }
})


