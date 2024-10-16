
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import index from '@/pages/index.vue';
import Login from '@/pages/Login.vue';
import Employee from '@/pages/Employee/Employee.vue';
import Admin from '@/pages/Admin/Admin.vue';
import VueCookies from 'vue-cookies';

const routes = [
  {
    path:"/",
    name:"home",
    component: index
  },
  {
    path:"/admin/files",
    name:"adminFiles",
    component: Admin,
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path:"/employee/files",
    name:"EmployeeFile",
    component: Employee,
    meta: { requiresAuth: true, role: 'EMPLOYEE' }
  },
  {
    path:"/login",
    name:"Login",
    component: Login
  }
]

const router = createRouter({
history: createWebHistory(process.env.BASE_URL),
routes,
});

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth) {
    if (userRole === to.meta.role) {
      next();
    } else {
      VueCookies.remove('jwtToken');
      localStorage.removeItem('userRole');
      next('/'); 
    }
  } else {
    next();
  }
});

export default router
