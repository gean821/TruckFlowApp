import { ref} from 'vue'
import { defineStore } from 'pinia'
import LocalDescargaService from '@/services/LocalDescargaService';
import type ILocalDescarga from '@/Entities/ILocalDescarga';

export const useLocalDescargaStore = defineStore('localDescarga', () => {
  const locaisDeDescarga = ref<ILocalDescarga[]>([]);

  async function GetAll() {
    locaisDeDescarga.value = await LocalDescargaService.GetAll();
  }

  async function GetById(id: string) {
    await LocalDescargaService.GetById(id);
  }

  async function AddLocalDescarga(localDescarga: ILocalDescarga) {
    const local = await LocalDescargaService.AddLocalDescarga(localDescarga);
    locaisDeDescarga.value.push(local);
  }

  async function UpdateLocalDescarga(id: string, localAtualizado: ILocalDescarga) {
    const local = await LocalDescargaService.UpdateLocalDescarga(id, localAtualizado);
    const index = locaisDeDescarga.value.findIndex(x => x.id !== localAtualizado.id);

    if (index !== -1) {
      locaisDeDescarga.value[index] = local;
    }
  }

  async function DeleteLocalDescarga(id: string) {
    await LocalDescargaService.DeleteLocalDescarga(id);
    locaisDeDescarga.value.filter(x => x.id != id);
  }

  return {
    locaisDeDescarga,
    GetAll,
    GetById,
    AddLocalDescarga,
    UpdateLocalDescarga,
    DeleteLocalDescarga 
  }
})


