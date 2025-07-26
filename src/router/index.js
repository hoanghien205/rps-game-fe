/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../pages/Landing.vue';
import HomePage from '../pages/HomePage.vue';
import Game from '../pages/Game.vue';

const routes = [
  { path: '/', component: Landing },
  { path: '/home', component: HomePage },
  { path: '/game/:id', component: Game },
  { path: '/history', component: { template: '<div>Play History (TBD)</div>' } },
  { path: '/info', component: { template: '<div>Game Info (TBD)</div>' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
