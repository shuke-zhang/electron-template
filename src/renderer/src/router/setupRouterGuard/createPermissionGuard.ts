import type { Router } from 'vue-router';

import { getCacheToken } from '@/utils/cache';

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    const userStore = useUserStore();
    if (getCacheToken()) {
      if (!userStore.userName) {
        try {
          await userStore.getInfo();
          next({
            path: _to.path,
            replace: true,
          });
        }
        catch (_error) {
          removeCacheToken();
          next('/login');
        }
      }
      if (_to.path === '/login') {
        next('/');
      }
      else {
        console.log('有token，去的是其他页面放行');

        next();
      }
    }
    else {
      if (_to.path === '/login') {
        next();
      }
      else {
        next('/login');
      }
    }
  });
}
