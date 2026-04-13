import { ProdutoService } from "@/services/ProdutoService";
import { defineStore } from "pinia";
import { ref } from 'vue';
import type { ProdutoCreateDto, ProdutoResponse, ProdutoUpdateDto } from "@/entities/produto.types";

export const useProdutoStore = defineStore('Produto', () => {
    const produtos = ref<ProdutoResponse[]>([]);
    const produtoService = ProdutoService();
    const loading = ref(false);

    async function getAll() {
        loading.value = true;
        try {
            produtos.value = await produtoService.getAll();
        } finally {
            loading.value = false;
        }
    }

    async function getById(id: string) {
        return await produtoService.getById(id);
    }

    async function addProduto(Produto: ProdutoCreateDto) {
        const produto = await produtoService.addProduto(Produto);
        produtos.value.push(produto);
        return produto;
    }

    async function update(
        id: string,
        payload: ProdutoUpdateDto): Promise<ProdutoResponse> {
        const atualizada = await produtoService.updateProduto(id, payload);

        const index = produtos.value.findIndex(u => u.id === id);
        if (index !== -1) {
            produtos.value[index] = atualizada;
        }

        return atualizada;
    }

    async function deleteProduto(id: string) {
        await produtoService.remove(id);
        const index = produtos.value.findIndex(x => x.id === id);

        if (index !== -1) {
            produtos.value.splice(index, 1);
        }
    }

    return {
        loading,
        produtos,
        getAll,
        getById,
        update,
        deleteProduto,
        addProduto
    }
})


