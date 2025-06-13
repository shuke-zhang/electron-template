import type { RouteRecordRaw } from 'vue-router';

// 动态路由
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: '系统设置',
    },
    component: () => import('@/views/setting/index.vue'),
  },

];
