import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Layouts
import GuestLayout from '@/layouts/GuestLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

// Pages
import LandingPage from '@/pages/LandingPage.vue';
import Login from '@/pages/Auth/Login.vue';
import Register from '@/pages/Auth/Register.vue';
import ForgotPassword from '@/pages/Auth/ForgotPassword.vue';
import ResetPassword from '@/pages/Auth/ResetPassword.vue';
import VerifyEmail from '@/pages/Auth/VerifyEmail.vue';
import Profile from '@/pages/Auth/Profile.vue';
import Index from '@/pages/Dashboard/Index.vue';
import Home from '@/pages/home/index.vue';
import Signature from '@/pages/signature/index.vue';
import Upload from '@/pages/upload/index.vue';
import Complete from '@/pages/complete/index.vue';
import EmployeeIndex from '@/pages/Employees/EmployeeIndex.vue';
import TrackDocComponent from '@/pages/TrackDocument/TrackDocComponent.vue';
import SuperAdminDashboard from '@/pages/SuperAdmin/superadmindashboard.vue';
import CompanyOverview from '@/pages/SuperAdmin/Pages/CompanyOverview.vue';
// Store
import { useAuthStore } from '@/stores/modules/user';

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/:catchAll(.*)',
  //   redirect: '/',
  // },

  // 👤 Guest Layout (no auth)
  {
    path: '/',
    component: GuestLayout,
    children: [
      {
        path: '',
        name: 'landing',
        component: LandingPage,
        meta: { requiresAuth: false },
      },
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { requiresAuth: false },
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { requiresAuth: false },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: { requiresAuth: false },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: { requiresAuth: false },
      },
      {
        path: 'password-reset/:token',
        redirect: to => {
          return { 
            name: 'reset-password', 
            query: { 
              token: to.params.token, 
              email: to.query.email 
            } 
          };
        },
        meta: { requiresAuth: false },
      },
      {
        path: 'email/verify/:id/:hash',
        name: 'verification.verify',
        component: VerifyEmail,
        meta: { requiresAuth: false },
      },
      {
        path: 'email/verify',
        name: 'verification.notice',
        component: VerifyEmail,
        meta: { requiresAuth: true },
      },
    ],
  },

  // 🔒 Auth Layout (requires auth)
  {
    path: '/',
    component: AuthLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'home',
        component: Index,
      },
      {
        path: 'superadmindashboard',
        name: 'superadmindashboard',
        component: SuperAdminDashboard,
      },
      {
        path: '/company-overview',
        name: 'company-overview',
        component: CompanyOverview,
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
      },
      {
        path: 'employees',
        name: 'employees',
        component: EmployeeIndex,
      },
      {
        path: 'documents',
        name: 'documents',
        component: Home,
      },
      {
        path: 'upload',
        name: 'upload',
        component: Upload,
      },
      {
        path: 'signature',
        name: 'signature',
        component: Signature,
      },
      {
        path: 'complete',
        name: 'complete',
        component: Complete,
      },
      {
        path: 'track-document',
        name: 'track-document',
        component: TrackDocComponent,
      },
    ],
  },

  // 📄 Public page without layout or auth
  {
    path: '/view-document',
    name: 'ViewDocument',
    component: Signature,
    props: route => ({
      shared_document_id: route.query.shared_document_id,
      document_pdf_id: route.query.document_pdf_id,
      employee_id: route.query.employee_id,
      is_employee: route.query.is_employee,
    }),
  },

];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (auth.user === null) {
    await auth.getUser();
    
    // If user is authenticated but role is not fetched yet, fetch it
    if (auth.isAuthenticated && auth.role === null) {
      try {
        await auth.getUserRole();
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    }
  }


  if (auth.isAuthenticated && auth.role === 'super-admin' && 
      (to.name === 'login' || to.name === 'home' || to.name === 'dashboard')) {
    return next({ name: 'superadmindashboard' });
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return next({ name: 'home' });
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login' });
  }

  next();
});
