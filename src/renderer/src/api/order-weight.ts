import type { OrderWeightAdd, OrderWeightModel } from '../model/order-weight';

/**
 * 生猪过磅列表
 */
export function listOrderWeight(params?: ListQuery<OrderWeightModel>) {
  return request.get<ResponseList<OrderWeightModel>>({
    url: '/system/orderWeight/list',
    params: {
      ...params,
      orderByColumn: 'createTime',
      isAsc: 'desc',
    },
  });
}
/**
 * 新增生猪过磅
 */
export function addOrderWeight(data: OrderWeightAdd) {
  return request.post({
    url: '/system/orderWeight',
    data,
  });
}
/**
 * 更新生猪过磅
 */
export function updateOrderWeight(data: OrderWeightModel) {
  return request.put({
    url: '/system/orderWeight',
    data,
  });
}
/**
 * 生猪过磅详情
 */
export function getOrderWeight(id: number) {
  return request.get<ResponseData<OrderWeightModel>>({
    url: `/system/orderWeight/${id}`,
  });
}
/**
 * 删除生猪过磅
 */
export function delOrderWeight(id: number) {
  return request.delete<ResponseData<OrderWeightModel>>({
    url: `/system/orderWeight/${id}`,
  });
}

/**
 * 新增无公害处理
 */
export function addPollution(data: {
  sellerId?: number | null;
  number: number ;
  pigstyNo?: string | null;
  pigNo?: string | null;
}) {
  return request.post({
    url: '/system/pollution',
    data,
  });
}

// 新增急宰
export function addSnapKilling(data: {
  sellerId: number;
  number: number;
  pigstyNo: string | null;
  pigNo: string | null;
}) {
  return request.post({
    url: '/system/snapKilling',
    data,
  });
}

// 作废
export function invalidOrder(id: number) {
  return request.delete({
    url: `/system/orderWeight/Invalid/${id}`,
  });
}
