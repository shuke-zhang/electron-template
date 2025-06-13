import type { UserModel } from '@/model/user';

import router from '@renderer/router';
import { defineStore } from 'pinia';
import { getInfo as _getInfo, loginApi } from '@/api/login';
import _avater from '@/assets/images/avatar.png';
import { asyncRoutes } from '@/router/routes/asyncRoutes';
import { removeCacheToken, setCacheToken } from '@/utils/cache';

const SUPER_ADMIN = 'admin';

export const useUserStore = defineStore('user', () => {
  const userName = ref<UserModel | null>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);
  const avater = ref(_avater);

  return {
    userName,
    roles,
    permissions,
    avater,
    login,
    logout,
    getInfo,
    resetAllState,
    hasPermission,
    hasRole,
  };

  async function login(...args: Parameters<typeof loginApi>) {
    const res = await loginApi(...args);
    setCacheToken(res.data.accessToken);
  }
  function logout() {
    return new Promise<''>((resolve) => {
      resetAllState();
      removeCacheToken();
      removeAsyncRoute();
      resolve('');
    });
  }

  async function getInfo() {
    const res = await _getInfo();
    userName.value = { username: res.data.username };
    roles.value = res.data.roles;
  }

  function removeAsyncRoute() {
    for (let index = 0; index < asyncRoutes.length; index++) {
      const element = asyncRoutes[index];
      if (element.name) {
        if (router.hasRoute(element.name)) {
          router.removeRoute(element.name!);
        }
      }
    }
  }

  function resetAllState() {
    userName.value = null;
    roles.value = [];
    permissions.value = [];
    removeCacheToken();
  }

  function hasPermission(requiredPermission: string): boolean {
    return permissions.value.includes(requiredPermission);
  }

  function hasRole(requiredRole: string): boolean {
    if (roles.value.includes(SUPER_ADMIN))
      return true;
    return roles.value.includes(requiredRole);
  }
});
