import type { UserInfo } from '@/model/user';

// 获取用户详细信息
export function getInfo() {
  return request.get<ResponseData<UserInfo>>({
    url: '/user/info',
  });
}

/**
 * 登录
 */
export function loginApi(data:
{
  password?: string
  username?: string
}) {
  return request.post<ResponseData<{
    accessToken: string
    id: number
    realName: string
    password: string
  }>>({
    url: '/auth/login',
    data,
    withToken: false,
    showErrorMsg: false,
  });
}
