import { createRouter, createWebHistory } from 'vue-router'
import LocalDescargaView from '@/views/LocalDescargaView.vue';
import Fornecedor from '@/views/FornecedorView.vue';
import ProdutosView from '@/views/ProdutosView.vue';
import RecebimentoView from '@/views/RecebimentoView.vue';
import RecebimentoForm from '@/components/Forms/RecebimentoForm.vue';
import RecebimentoTable from '@/components/data-table/RecebimentoTable.vue';
import BloqueioView from '@/views/BloqueioView.vue';
import VisualizarAgendamentoView from '@/views/VisualizarAgendamentoView.vue';
import Relatorio from '@/views/Relatorio.vue';
import GradeCard from '@/components/cards/GradeCard.vue';
import ProgramacaoView from '@/views/ProgramacaoView.vue';
import HomePage from '@/views/HomePage.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomePage,
      meta: { layout: 'public' } 
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'public' } 
    },
     {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { layout: 'public' } 
    },
    {
      path: '/visualizar',
      name: 'visualizar',
      component: VisualizarAgendamentoView,
      meta: { layout: 'admin' }
    },
    {
      path: '/nova-grade',
      name: 'nova-grade',
      component: GradeCard,
      meta: { layout: 'admin' }
    },
    {
      path: '/visualizar-grades',
      name: 'visualizar-grade',
      component: ProgramacaoView,
      meta: { layout: 'admin' }
    },
    {
      path: '/bloqueios',
      name: 'bloqueios',
      component: BloqueioView,
      meta: { layout: 'admin' }
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: ProdutosView,
      meta: { layout: 'admin' }
    },
    {
      path: '/locais',
      name: 'locais-descarga',
      component: LocalDescargaView,
      meta: { layout: 'admin' }
    },
    {
      path: '/fornecedores',
      name: 'fornecedores',
      component: Fornecedor,
      meta: { layout: 'admin' }
    },
    {
      path: '/recebimentos',
      name: '/recebimentos',
      component: RecebimentoView,
      meta: { layout: 'admin' }
    },
    {
      path: '/novo-recebimento',
      name: '/novo-recebimento',
      component: RecebimentoForm,
      meta: { layout: 'admin' }
    },
    {
      path: '/visualizar-recebimentos',
      name: 'visualizar-recebimentos',
      component: RecebimentoTable,
      meta: { layout: 'admin' }
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: Relatorio,
      meta: { layout: 'admin' }
    },
  ],
})

export default router;
