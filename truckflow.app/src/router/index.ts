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
import DashboardView from '@/views/DashboardView.vue';
import { useAuthStore } from '@/stores/AuthStore';

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
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/visualizar',
      name: 'visualizar',
      component: VisualizarAgendamentoView,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/nova-grade',
      name: 'nova-grade',
      component: GradeCard,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/visualizar-grades',
      name: 'visualizar-grade',
      component: ProgramacaoView,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/bloqueios',
      name: 'bloqueios',
      component: BloqueioView,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: ProdutosView,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/locais',
      name: 'locais-descarga',
      component: LocalDescargaView,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/fornecedores',
      name: 'fornecedores',
      component: Fornecedor,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/recebimentos',
      name: '/recebimentos',
      component: RecebimentoView,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/novo-recebimento',
      name: '/novo-recebimento',
      component: RecebimentoForm,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/visualizar-recebimentos',
      name: 'visualizar-recebimentos',
      component: RecebimentoTable,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: Relatorio,
      meta: {
        requiresAuth: true,
        roles: ['Admin']
      }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (!to.meta?.requiresAuth) {
    return next();
  }


  if (!auth.isAuthenticated) {
    return next("/login");
  }

  const routeRoles = to.meta.roles as string[] | undefined;

  if (routeRoles && !routeRoles.includes(auth.user?.role!)) {
    return next("/login"); // ou /403
  }

  next();
});

export default router;
