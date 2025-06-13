import type { App } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';
import { baseRoutes } from './routes/baseRoutes';

import { setupRouterGuard } from './setupRouterGuard';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: baseRoutes,
});

export function setupRouter(app: App) {
  app.use(router);
}

setupRouterGuard(router);

export default router;
