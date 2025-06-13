import type { BuyerModel } from './buyer';
import type { OrderWeightModel } from './order-weight';
import type { SellerModel } from './seller';

/**
 * 订单 数据模型
 */
export interface OrderModel {
  orderBuyer?: BuyerModel;
  orderSeller?: SellerModel;
  bossName?: string;
  buyerId?: number;
  __buyerName?: string;
  createBy?: string;
  createTime?: string;
  id?: number;
  isCredit?: string;
  isTransferPay?: string;
  number?: number;
  orderDate?: string;
  orderNo?: string;
  pigNo?: number;
  pigstyNo?: number;
  price?: number;
  remark?: null;
  sellerId?: number;
  status?: string;
  updateBy?: string;
  updateTime?: string;
  orderWeightTime?: string;
  settleTime?: string;
  orderInfoList?: OrderItemModel[];
  slaughterMode?: number;
}

/**
 * 子订单
 */
export interface OrderItemModel {
  pigstyNo: number;
  number: number;
  price: number;
  __max: number;
  createBy?: any;
  createTime?: any;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  id?: number;
  orderId?: number;
  pigNo?: number;
  orderWeightList?: OrderWeightModel[];
}

