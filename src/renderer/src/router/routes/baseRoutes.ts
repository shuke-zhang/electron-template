import type { RouteRecordRaw } from 'vue-router';

export const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: {
      title: '首页',
      // layout: false,
    },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/login',
    meta: {
      title: '登录',
      layout: false,
    },
    component: () => import('@/views/auth/login.vue'),
  },
  {
    path: '/change-password',
    meta: {
      title: '修改密码',
    },
    component: () => import('@/views/auth/change-password.vue'),
  },
  {
    path: '/redirect/:path(.*)',
    meta: {
      title: 'redirect',
    },
    component: () => import('@/views/redirect.vue'),
  },
  {
    path: '/:path(.*)',
    meta: {
      title: '404 not-find',
    },
    component: () => import('@/views/error/404.vue'),
  }, {
    path: '/tattoo',
    name: 'tattoo',
    meta: {
      title: '刺青调换',
    },
    component: () => import('@/views/tattoo/index.vue'),
  },
];
