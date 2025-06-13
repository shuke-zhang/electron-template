import type { UserInfo } from '@/model/user';

import { encryptPassword } from '@renderer/utils/helpers/crypt';

// 获取验证码

// 登录方法

// 获取用户详细信息
export function getInfo() {
  return request.get<ResponseResult<UserInfo>>({
    url: '/getInfo',
  });
}

// 登录方法
export function loginPhone(username: string, password: string) {
  return request.post<ResponseResult<{ token: string }>>(
    {
      url: '/login/phone',
      data: {
        username,
        password: encryptPassword(password),
      },
      withToken: false,
    },
  );
}

// 用户密码重置
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request.put({
    url: '/system/user/profile/updatePwd',
    params: data,
  });
}
