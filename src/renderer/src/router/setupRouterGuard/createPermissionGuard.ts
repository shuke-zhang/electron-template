import type { Router } from 'vue-router';

import { getCacheToken } from '@/utils/cache';

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    const userStore = useUserStore();
    if (getCacheToken()) {
      console.log('有token');

      if (!userStore.userName) {
        try {
          console.log('没有用户信息');
          await userStore.getInfo();
          console.log('获取用户信息成功');
          next({
            path: _to.path,
            replace: true,
          });
        }
        catch (_error) {
          console.log('获取用户信息失败');
          removeCacheToken();
          console.log('移除token');
          next('/login');
        }
      }
      if (_to.path === '/login') {
        console.log('有token，并且去的是登录页放行');

        next('/');
      }
      else {
        console.log('有token，去的是其他页面放行');

        next();
      }
    }
    else {
      console.log('没有token');
      if (_to.path === '/login') {
        console.log('去登录页');
        next();
      }
      else {
        console.log('没有token且去的是其他页面');
        next('/login');
      }
    }
  });
}
