
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

const routes = [
  {
    path:"/",
    name:"home",
    component: index
  },
  {
    path:"/admin/files",
    name:"adminFiles",
    component: Admin
  },
  {
    path:"/employee/files",
    name:"EmployeeFile",
    component: Employee
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

export default router
