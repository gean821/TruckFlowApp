import CadastroProduto from '@/components/icons/CadastroProduto.vue';
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/gerenciar',
      name: 'cadastroProduto',
      component: CadastroProduto
    }
  ],
})

export default router;
