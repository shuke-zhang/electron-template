import type { BuyerModel } from './buyer';
import type { OrderModel } from './order';
import type { SellerModel } from './seller';
import type { DateModelType } from 'element-plus';
/**
 * 生猪过磅 数据模型
 */
export interface OrderWeightModel {
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: any;
  remark?: any;
  id?: number;
  orderId?: number;
  sellerId?: number;
  buyerId?: number;
  pigstyNo?: number | string;
  pigNo?: number | string;
  productionLine?: string;
  type?: string;
  gw?: number;
  lw?: number;
  nw?: number;
  isPollution?: string;
  price?: number;
  property?: string;
  propertyPrice?: number;
  startDate?: any;
  endDate?: any;
  orderSeller?: SellerModel;
  orderBuyer?: BuyerModel;
  order?: OrderModel;
  orderInfo?: OrderModel;
  orderDate?: any;
  status?: any;
  searchValue?: string;
  __range?: [DateModelType, DateModelType];
  no?: string;
  /**
   * 宰猪模式id
   */
  typeId?: number;
}

export interface OrderWeightAdd {
  /**
   * 生产线
   */
  productionLine?: string;
  /**
   * 刺青号 101-001
   */
  no?: string;
  /**
   * 毛重
   */
  gw?: number;
  /**
   * 皮重
   */
  lw?: number;
  /**
   * 净重
   */
  nw?: number;
  /**
   * type
   */
  type?: string;
  /**
   * 0合格 1无公害 2急宰
   */
  status?: 0 | 1 | 2;
  /**
   * 宰猪模式
   */
  typeId?: number;
  remark?: string;
  /**
   * 钩子数量 默认 1
   */
  hookNum?: number;
  /**
   * 钩子重量 一个钩子1公斤
   */
  hookWeight?: number;

  /**
   * 链条数量
   */
  chainNum?: number;
  /**
   * 链条重量
   */
  chainWeight?: number;

  /**
   * 滑轮重量
   */
  pulleyWeight?: number;
}

export interface PollutionModel {
  sellerId?: number | null;
  number: number ;
  pigstyNo?: string | null;
  pigNo?: string | null;
  /**
   * 宰猪模式
   */
  typeId?: number;
  /**
   * 是否已过磅 0-未过磅 1-已过磅
   */
  _isWeight?: number;
  /**
   * 刺青号 100-1 格式
   */
  _pigstyNo?: string;
  /**
   * 毛重
   */
  gw: number;
  /**
   * 钩子数量 默认 1
   */
  hookNum?: number;
  /**
 * 钩子重量 一个钩子1公斤
 */
  hookWeight?: number;

  /**
 * 链条数量
 */
  chainNum?: number;
  /**
 * 链条重量
 */
  chainWeight?: number;

  /**
 * 滑轮重量
 */
  pulleyWeight?: number;

}
