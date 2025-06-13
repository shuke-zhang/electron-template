import type { UserInfo } from '@/model/user';

// 获取用户详细信息
export function getInfo() {
  return request.get<ResponseResult<UserInfo>>({
    url: '/getInfo',
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
  return request.post<{ token: string }>({
    url: '/auth/login',
    data,
    withToken: false,
  });
}
