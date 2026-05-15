import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore';
import { RoleGroups, hasRole } from '@/shared/auth/roles';
import HomePage from '@/views/HomePage.vue';
import LoginView from '@/views/LoginView.vue';

const SaibaMais = () => import('@/views/SaibaMais.vue');
const ContatoView = () => import('@/views/ContatoView.vue');
const DashboardView = () => import('@/views/DashboardView.vue');
const VisualizarAgendamentoView = () => import('@/views/VisualizarAgendamentoView.vue');
const GradeCard = () => import('@/components/cards/GradeCard.vue');
const ProgramacaoView = () => import('@/views/ProgramacaoView.vue');
const ProdutosView = () => import('@/views/ProdutosView.vue');
const LocalDescargaView = () => import('@/views/LocalDescargaView.vue');
const FornecedorView = () => import('@/views/FornecedorView.vue');
const UnidadeEntregaView = () => import('@/views/UnidadeEntregaView.vue');
const RecebimentoView = () => import('@/views/RecebimentoView.vue');
const RecebimentoForm = () => import('@/components/Forms/RecebimentoForm.vue');
const RecebimentosOrfaosView = () => import('@/views/RecebimentosOrfaosView.vue');
const RelatorioView = () => import('@/views/Relatorio.vue');
const AuditoriaView = () => import('@/views/AuditoriaView.vue');
const ManageUserView = () => import('@/views/ManageUserView.vue');
const EmpresaView = () => import('@/views/EmpresaView.vue');
const MinhaContaView = () => import('@/views/MinhaContaView.vue');

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
      component: FornecedorView,
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
      name: 'recebimentos',
      component: RecebimentoView,
      meta: {
        requiresAuth: true,
        roles: RoleGroups.CanManageGrade
      }
    },
    {
      path: '/novo-recebimento',
      name: 'novo-recebimento',
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
      component: RelatorioView,
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
    return next('/login');
  }

  const routeRoles = to.meta.roles as string[] | undefined;

  if (routeRoles && !hasRole(auth.user?.role, routeRoles)) {
    return next('/login');
  }

  next();
});

export default router;