import type { Router } from 'vue-router';

import { getCacheToken } from '@/utils/cache';

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    const userStore = useUserStore();
    const appStore = useAppStore();
    if (getCacheToken()) {
      if (!userStore.user) {
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
      if (_to.path !== '/setting') {
        if (!appStore.appConfig?.lw || !appStore.appConfig?.productionLine) {
          const t = userStore.hasSettingPermission ? '请先完成系统设置' : '请联系管理员完成系统设置';
          confirmWarning(t, '提示', userStore.hasSettingPermission
            ? {
                cancelButtonText: '退出登录',
                confirmButtonText: '去设置',
              }
            : {
                confirmButtonText: '退出登录',
                showCancelButton: false,
              }).then(() => {
            if (!userStore.hasSettingPermission) {
              throw new Error('no SettingPermission');
            }
            else {
              router.push('/setting');
            }
          }).catch(() => {
            return userStore.logout()
              .then(() => {
                router.replace('/login');
              });
          });
        }
      }
      if (_to.path === '/login') {
        next('/');
      }
      else {
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
