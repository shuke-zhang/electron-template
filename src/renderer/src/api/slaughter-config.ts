import type { SlaughterConfigModel } from '../model/slaughter-config';

/**
 * 生猪过磅列表
 */
export function listSlaughterConfig(params?: ListQuery<SlaughterConfigModel>) {
  return request.get<ResponseList<SlaughterConfigModel>>({
    url: '/system/slaughterConfig/list',
    params,
  });
}
/**
 * 新增生猪过磅
 */
export function addSlaughterConfig(data: SlaughterConfigModel) {
  return request.post({
    url: '/system/slaughterConfig',
    data,
  });
}
/**
 * 更新生猪过磅
 */
export function updateSlaughterConfig(data: SlaughterConfigModel) {
  return request.put({
    url: '/system/slaughterConfig',
    data,
  });
}
/**
 * 生猪过磅详情
 */
export function getSlaughterConfig(id: number) {
  return request.get<ResponseData<SlaughterConfigModel>>({
    url: `/system/slaughterConfig/${id}`,
  });
}
/**
 * 删除生猪过磅
 */
export function delSlaughterConfig(id: number) {
  return request.delete<ResponseData<SlaughterConfigModel>>({
    url: `/system/slaughterConfig/${id}`,
  });
}
