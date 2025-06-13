import type { HttpRequestConfig } from '@shuke~/request';

import type { AxiosRequestConfig, Canceler } from 'axios';
import type { UserCustomConfig } from './types';
import router from '@renderer/router';
import { getSystemErrorMessage, HttpRequest, RequestMethodsEnum } from '@shuke~/request';
// import { RequestMethodsEnum } from '@shuke~/request/dist/shared.js';
import axios from 'axios';
import { getCacheToken } from '../cache';

const cancelMap = new Map<string, Canceler>();

const request = new HttpRequest<UserCustomConfig>(
  {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 20 * 1000,
    withToken: true,
    joinTime: true,
    ignoreRepeatRequest: false,
  },
  {
    // 请求拦截器
    request(config) {
      /**
       * token
       */
      const token = getCacheToken();
      if (config?.withToken && token) {
        config.headers![config.tokenKey || 'Authorization'] = `${config?.tokenKeyScheme || 'Bearer'} ${token}`;
      }
      /**
       * 忽略重复请求。第一个请求未完成时进行第二个请求，第一个会被被取消
       */
      if (config.ignoreRepeatRequest) {
        const key = generateKey({ ...config });
        const cancelToken = new axios.CancelToken(c => cancelInterceptor(key, c, cancelMap)); // 创建一个取消 token
        config.cancelToken = cancelToken;
      }
      /**
       * 添加时间戳到 get 请求
       */
      if (config.method?.toUpperCase() === RequestMethodsEnum.GET) {
        config.params = { _t: `${Date.now()}`, ...config.params };
      }

      return config;
    },
    // 请求拦截器错误
    requestError(e) {
      // 处理请求错误
      console.log(e, 'requestError');
    },
    // 响应拦截器
    async response(_response) {
      cancelMap.delete(generateKey(_response.config));
      const config = _response.config as HttpRequestConfig<UserCustomConfig>;
      console.log('今天是个好日子');

      // 返回原生响应
      if (config.getResponse) {
        return _response;
      }
      const responseData = _response.data as ResponseResult<object>;

      if (responseData.code === 0) {
        // 请求成功
        return responseData as any;
      }

      if (responseData.code === 401) {
        // 返回登录页
        router.replace('/redirect/');
      }
      console.log('接口失败111');

      const msg = responseData.msg || getSystemErrorMessage(responseData.code);
      console.log('接口失败', config?.showErrorMsg, responseData.code !== 401 && config?.showErrorMsg);

      return handleError(msg, responseData.code !== 401 && config?.showErrorMsg);
    },
    responseError(error: any) {
      if (error) {
        const err = error?.errMsg || error?.msg || error?.message || '';
        return handleError(err);
      }
    },

  },
);

export {
  request,
};

/**
 * @description 生成 key 用于取消请求
 * @param config
 * @returns string
 */
export function generateKey(config: AxiosRequestConfig) {
  const { url, method, params = {}, data = {} } = config;
  return `${url}-${method}-${JSON.stringify(method === 'get' ? params : data)}`;
}

/**
 * @description 取消请求
 * @param key 生成的 key
 * @param canceler 取消函数
 * @param cancelMap 取消请求的 map
 */
export function cancelInterceptor(key: string, canceler: Canceler, cancelMap = new Map<string, Canceler>()) {
  if (cancelMap.has(key)) {
    cancelMap.get(key)?.('cancel repeat request');
  }
  cancelMap.set(key, canceler);
}

/**
 * 取消所有进行中的请求
 */
export function removeAllPending() {
  for (const cancel of cancelMap.values()) {
    if (typeof cancel === 'function') {
      cancel('cancel all requests');
    }
  }
  cancelMap.clear();
}

function handleError(msg: string, showErrorMsg = true) {
  console.log('handleError', msg, showErrorMsg);
  if (showErrorMsg) {
    showMessageError(msg);
    throw new Error(msg);
  }

  // 静默失败时，不抛错
  return undefined;
}
