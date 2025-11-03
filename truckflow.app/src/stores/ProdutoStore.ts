import type IProduto from "@/Entities/IProduto"
import http from "@/http/http";
import ProdutoService from "@/services/ProdutoService";
import { defineStore } from "pinia";
import {provide, ref} from 'vue';

export const useProdutoStore = defineStore('Produto', () => {
    const produtos = ref<IProduto[]>([]);

    async function GetAll() {
        produtos.value = await ProdutoService.GetAll();
    }

    async function GetById(id: string) {
        return await ProdutoService.GetById(id);        
    }

     async function AddProduto(Produto: IProduto) {
        const produto = await ProdutoService.AddProduto(Produto);
        produtos.value.push(produto);
    }

     async function UpdateProduto(id: string, produtoAtualizado: IProduto) {
        const produto = await ProdutoService.UpdateProduto(id, produtoAtualizado);
        const index = produtos.value.findIndex(x => x.id === produtoAtualizado.id);

         if (index !== -1) {
            produtos.value[index] = produto;
         }
    }

    async function DeleteProduto(id: string) {
        await ProdutoService.DeleteProduto(id);
        const index = produtos.value.findIndex(x => x.id === id);
        
        if (index !== -1) {
            produtos.value.splice(index,1);
        }
    }

    return {
        produtos,
        GetAll,
        GetById,
        UpdateProduto,
        DeleteProduto,
        AddProduto
    }
})


