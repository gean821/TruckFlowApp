import { createRouter, createWebHistory } from 'vue-router'
import LocalDescargaView from '@/views/LocalDescargaView.vue';
import Fornecedor from '@/views/FornecedorView.vue';
import ProdutosView from '@/views/ProdutosView.vue';
import RecebimentoView from '@/views/RecebimentoView.vue';
import RecebimentosOrfaosView from '@/views/RecebimentosOrfaosView.vue';
import RecebimentoForm from '@/components/Forms/RecebimentoForm.vue';
import VisualizarAgendamentoView from '@/views/VisualizarAgendamentoView.vue';
import Relatorio from '@/views/Relatorio.vue';
import GradeCard from '@/components/cards/GradeCard.vue';
import ProgramacaoView from '@/views/ProgramacaoView.vue';
import HomePage from '@/views/HomePage.vue';
import LoginView from '@/views/LoginView.vue';
import ContatoView from '@/views/ContatoView.vue';
import DashboardView from '@/views/DashboardView.vue';
import { useAuthStore } from '@/stores/AuthStore';
import UnidadeEntregaView from '@/views/UnidadeEntregaView.vue';
import SaibaMais from '@/views/SaibaMais.vue';
import AuditoriaView from '@/views/AuditoriaView.vue';
import ManageUserView from '@/views/ManageUserView.vue';
import EmpresaView from '@/views/EmpresaView.vue';
import MinhaContaView from '@/views/MinhaContaView.vue';
import { RoleGroups, hasRole } from '@/shared/auth/roles';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
      meta: { layout: 'public' }
    },
    {
      path: '/more',
      name: 'more',
      component: SaibaMais,
      meta: { layout: 'public' }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'public' }
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContatoView,
      meta: { layout: 'public' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanViewSchedule
      }
    },
    {
      path: '/visualizar',
      name: 'visualizar',
      component: VisualizarAgendamentoView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanViewSchedule
      }
    },
    {
      path: '/nova-grade',
      name: 'nova-grade',
      component: GradeCard,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageGrade
      }
    },
    {
      path: '/visualizar-grades',
      name: 'visualizar-grade',
      component: ProgramacaoView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageGrade
      }
    },
    // {
    //   path: '/bloqueios',
    //   name: 'bloqueios',
    //   component: BloqueioView,
    //   meta: {
    //     requiresAuth: true,
    //     roles: ['Admin']
    //   }
    // },
    {
      path: '/produtos',
      name: 'produtos',
      component: ProdutosView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageMasterData
      }
    },
    {
      path: '/locais',
      name: 'locais-descarga',
      component: LocalDescargaView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageMasterData
      }
    },
    {
      path: '/fornecedores',
      name: 'fornecedores',
      component: Fornecedor,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageMasterData
      }
    },
    {
      path: '/unidades-entregas',
      name: 'unidades-entrega',
      component: UnidadeEntregaView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageMasterData
      }
    },
    {
      path: '/recebimentos',
      name: '/recebimentos',
      component: RecebimentoView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageGrade
      }
    },
    {
      path: '/novo-recebimento',
      name: '/novo-recebimento',
      component: RecebimentoForm,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageGrade
      }
    },
    {
      path: '/visualizar-recebimentos',
      name: 'visualizar-recebimentos',
      component: RecebimentoView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageGrade
      }
    },
    {
      path: '/recebimentos-orfaos',
      name: 'recebimentos-orfaos',
      component: RecebimentosOrfaosView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageGrade
      }
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: Relatorio,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageMasterData
      }
    },
    {
      path: '/auditoria',
      name: 'auditoria',
      component: AuditoriaView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanViewAuditLogs
      }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: ManageUserView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageUsers
      }
    },
    {
      path: '/empresa',
      name: 'empresa',
      component: EmpresaView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageMasterData
      }
    },
    {
      path: '/account-config',
      name: 'account-config',
      component: MinhaContaView,
      meta: {
        requiresAuth: true,
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

  if (routeRoles && !hasRole(auth.user?.role, routeRoles)) {
    return next("/login");
  }

  next();
});

export default router;
