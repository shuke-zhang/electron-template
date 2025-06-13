import type { UserModel } from '@/model/user';

import { getInfo as _getInfo, loginPhone } from '@/api/login';
import _avater from '@/assets/images/avatar.png';
import { asyncRoutes } from '@/router/routes/asyncRoutes';
import { removeCacheToken, setCacheToken } from '@/utils/cache';
import router from '@renderer/router';
import { defineStore } from 'pinia';

const ALL_PERMISSION = '*:*:*';
const SUPER_ADMIN = 'admin';
export const SYSTEM_ORDER_WEIGHT_SETTING = 'system:orderWeight:setting';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserModel | null>(null);
  const roles = ref<string[]>([]);
  const permissions = ref<string[]>([]);
  const userAvater = computed(() => user.value?.avatar);
  const avater = ref(_avater);
  const hasSettingPermission = computed(() => {
    return hasPermission(SYSTEM_ORDER_WEIGHT_SETTING);
  });

  watchEffect(() => {
    if (userAvater.value) {
      const image = new Image();
      image.src = APP_API_URL + userAvater.value;
      image.onload = () => {
        console.log('onload');
        avater.value = image.src;
      };
      image.onerror = () => {
      };
    }
  });

  return {
    user,
    roles,
    permissions,
    avater,
    hasSettingPermission,
    login,
    logout,
    getInfo,
    resetAllState,
    hasPermission,
    hasRole,
  };

  async function login(...args: Parameters<typeof loginPhone>) {
    const res = await loginPhone(...args);
    setCacheToken(res.token);
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
    user.value = res.user;
    roles.value = res.roles;
    permissions.value = res.permissions;
    handleAsyncRoute();
  }

  function handleAsyncRoute() {
    if (hasSettingPermission.value) {
      for (let index = 0; index < asyncRoutes.length; index++) {
        const element = asyncRoutes[index];
        if (!router.hasRoute(element.name!)) {
          router.addRoute(element);
        }
      }
    }
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
    user.value = null;
    roles.value = [];
    permissions.value = [];
    removeCacheToken();
  }

  function hasPermission(requiredPermission: string): boolean {
    if (permissions.value.includes(ALL_PERMISSION)) return true;
    return permissions.value.includes(requiredPermission);
  }

  function hasRole(requiredRole: string): boolean {
    if (roles.value.includes(SUPER_ADMIN)) return true;
    return roles.value.includes(requiredRole);
  }
});
