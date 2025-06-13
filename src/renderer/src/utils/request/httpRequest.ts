import { HttpRequest, HttpRequestHeadersContentTypeEnum } from './core';

import { getCacheToken } from '../cache';
import { router } from '@/router';
import { ElMessageBox } from 'element-plus';
import Qs from 'qs';

export const request = new HttpRequest({
  // AxiosRequestConfig
  baseURL: APP_API_URL,
  timeout: 2000,
  headers: {
    'Content-Type': HttpRequestHeadersContentTypeEnum.JSON,
  },
  paramsSerializer(params) {
    return Qs.stringify(params, { arrayFormat: 'brackets' });
  },

  // HttpRequestOption
  withToken: true,
  joinTime: true,
  ignoreRepeatRequest: true,
  tokenKey: 'Authorization',
  authenticationScheme: 'Bearer',
}, {
  onError: (msg) => {
    messageError(msg);
  },
  getToken: () => getCacheToken(),
  onTokenExpired: async () => {
    const uerStore = useUserStore();
    await ElMessageBox.alert('登录状态已过期, 请重新登录!', '提示', {
      confirmButtonText: '登录',
      type: 'warning',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
      showClose: false,
    });
    await uerStore.logout();
    router.replace('/login');
  },
});

