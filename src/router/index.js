
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import index from '@/pages/index.vue';
import GetEmployes from '@/pages/getEmployes.vue';

const routes = [
  {
    path:"/",
    name:"home",
    component: index
  },
  {
    path:"/employes",
    name:"Employes",
    component: GetEmployes
  }
]

const router = createRouter({
history: createWebHistory(process.env.BASE_URL),
routes,
});

export default router
