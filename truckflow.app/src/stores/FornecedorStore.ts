import { defineStore } from 'pinia';
import { ref } from 'vue';
import { FornecedorService } from '@/services/FornecedorService';
import type { FornecedorResponse, FornecedorCreateDto, FornecedorUpdateDto } from '@/entities/fornecedor.types';

export const useFornecedorStore = defineStore('fornecedor', () => {
  const service = FornecedorService();
  const fornecedores = ref<FornecedorResponse[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try { fornecedores.value = await service.getAll(); }
    finally { loading.value = false; }
  }

  async function create(payload: FornecedorCreateDto) {
    const novo = await service.create(payload);
    fornecedores.value.push(novo);
    return novo;
  }

  async function update(id: string, payload: FornecedorUpdateDto) {
    const atualizado = await service.update(id, payload);
    const index = fornecedores.value.findIndex(f => f.id === id);
    if (index !== -1) fornecedores.value[index] = atualizado;
    return atualizado;
  }

  async function remove(id: string) {
    await service.remove(id);
    fornecedores.value = fornecedores.value.filter(f => f.id !== id);
  }

  async function linkProduto(fornecedorId: string, produtoId: string) {
    const atualizado = await service.addProduto(fornecedorId, produtoId);
    const index = fornecedores.value.findIndex(f => f.id === fornecedorId);
    if (index !== -1) fornecedores.value[index] = atualizado;
  }

  async function unlinkProduto(fornecedorId: string, produtoId: string) {
    const atualizado = await service.removeProduto(fornecedorId, produtoId);
    const index = fornecedores.value.findIndex(f => f.id === fornecedorId);
    if (index !== -1) fornecedores.value[index] = atualizado;
  }

  return { fornecedores, loading, fetchAll, create, update, remove, linkProduto, unlinkProduto };
});