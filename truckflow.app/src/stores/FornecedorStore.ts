import { ref } from 'vue'
import { defineStore } from 'pinia'
import FornecedorService from '@/services/FornecedorService';
import type IFornecedor from '@/Entities/IFornecedor';
import type IProduto from '@/Entities/IProduto';

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

  async function addProdutoToFornecedor(fornecedorId: string, produtoId: string) {
    try {
      const fornecedorAtualizado = await FornecedorService.addProdutoToFornecedor(fornecedorId, produtoId);

      if (fornecedorAtualizado) {

        const index = fornecedores.value.findIndex(f => f.id === fornecedorId);

        if (index !== -1) {
          fornecedores.value[index] = fornecedorAtualizado;
        } else {
          console.warn('Fornecedor não encontrado no estado local, recarregando lista...');
          await GetAll();
        }
      }
      return fornecedorAtualizado;
    } catch (error) {
      console.error("Erro ao adicionar produto ao fornecedor na store:", error);
    }
  }

  async function deleteProdutoFromFornecedor(fornecedorId: string, produtoId: string) {
    await FornecedorService.deleteProdutoFromFornecedor(fornecedorId, produtoId);

    const fornecedorIndex = fornecedores.value.findIndex(x => x.id === fornecedorId);

    if (fornecedorIndex !== -1) {
      const fornecedor = fornecedores.value[fornecedorIndex];
      const produtoIndex = fornecedor.produtos?.findIndex(p => p.id === produtoId);

      if (produtoIndex !== -1) {
        fornecedor.produtos?.splice(produtoIndex!, 1);
      }
    }
  }

  function updateProdutoInFornecedores(produtoAtualizado: IProduto) {
    fornecedores.value.forEach(fornecedor => {
      const produtoIndex = fornecedor.produtos?.findIndex(p => p.id === produtoAtualizado.id);

      if (produtoIndex !== -1) {
        fornecedor.produtos![produtoIndex!] = produtoAtualizado;
      }
    });
  }

  return {
    fornecedores,
    GetAll,
    GetById,
    AddFornecedor,
    UpdateFornecedor,
    DeleteFornecedor,
    addProdutoToFornecedor,
    deleteProdutoFromFornecedor,
    updateProdutoInFornecedores
  }
})


