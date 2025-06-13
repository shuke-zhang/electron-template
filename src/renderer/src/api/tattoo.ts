/**
 * 新增生猪过磅
 */
export function swapTattoo(params: {
  idOne: number;
  idTwo: number;
}) {
  return request.get({
    url: '/system/orderWeight/exchange',
    params,
  });
}
