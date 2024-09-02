import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Quiz from '../views/Quiz.vue';
import Summary from '../views/Summary.vue';
import Error from '../views/Error.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/quiz', name: 'Quiz', component: Quiz },
  { path: '/summary', name: 'Summary', component: Summary },
  { path: '/error', name: 'Error', component: Error },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
