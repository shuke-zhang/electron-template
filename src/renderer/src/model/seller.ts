import type { PigstyModel } from './pigsty';

/**
 * 生猪入场 数据模型
 */

export interface SellerModel {
  address: string;
  bankAccount: string;
  bankName: string;
  businessLicense: null;
  companyName: null;
  createBy: string;
  createTime: string;
  id: number;
  leaderIdCard: string;
  leaderName: string;
  leaderPhone: string;
  /**
   * 猪圈
   */
  pigstyList: PigstyModel[];
  remark: null;
  type: string;
  updateBy: string;
  updateTime: null;
  userId: number;
}