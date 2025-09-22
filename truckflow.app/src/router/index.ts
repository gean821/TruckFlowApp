import CadastroProduto from '@/components/CadastroProduto.vue';
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Cadastro from '@/components/Cadastros.vue';
import Produtos from '@/components/Produtos.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cadastrar',
      name: 'cadastros',
      component: Cadastro
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: Produtos
    }
  ],
})

export default router;
