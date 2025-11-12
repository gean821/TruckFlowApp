import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LocalDescargaView from '@/views/LocalDescargaView.vue';
import Fornecedor from '@/views/FornecedorView.vue';
import ProdutosView from '@/views/ProdutosView.vue';
import RecebimentoView from '@/views/RecebimentoView.vue';
import RecebimentoForm from '@/components/Forms/RecebimentoForm.vue';
import RecebimentoTable from '@/components/data-table/RecebimentoTable.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: ProdutosView
    },
    {
      path: '/locais',
      name: 'locais-descarga',
      component: LocalDescargaView
    },
    {
      path: '/fornecedores',
      name: 'fornecedores',
      component: Fornecedor
    },
    {
      path: '/recebimentos',
      name: '/recebimentos',
      component: RecebimentoView
    },
    {
      path: '/novo-recebimento',
      name: '/novo-recebimento',
      component: RecebimentoForm
    },
    {
      path: '/visualizar-recebimentos',
      name: 'visualizar-recebimentos',
      component: RecebimentoTable
    },
  ],
})

export default router;
