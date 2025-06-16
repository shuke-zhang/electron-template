import type { Router } from 'vue-router';
import { getCacheToken, removeCacheToken } from '@/utils/cache';

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    const userStore = useUserStore();
    const token = getCacheToken();

    if (token) {
      if (!userStore.userName) {
        try {
          await userStore.getInfo();
          return next({ path: _to.path, replace: true });
        }
        catch {
          removeCacheToken();
          return next('/login');
        }
      }

      if (_to.path === '/login') {
        return next('/');
      }

      return next();
    }
    else {
      if (_to.path === '/login') {
        return next();
      }
      else {
        return next('/login');
      }
    }
  });
}
