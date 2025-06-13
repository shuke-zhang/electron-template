import type { PigstyModel } from './pigsty';

/**
 * 生猪入场 数据模型
 */
export interface EnterModel {
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  remark?: string;
  id?: number;
  sellerId?: number;
  driverName?: string;
  driverPhone?: string;
  carNo?: string;
  carCertificate?: string;
  quarantineNumber?: number;
  slaughterNumber?: number;
  status?: string;
  pigSeller?: PigSeller;
  pigPigstyList?: PigstyModel[];
}

interface PigSeller {
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: any;
  remark?: any;
  id?: number;
  enterId?: number;
  sellerId?: number;
  userId?: number;
  type?: string;
  companyName?: any;
  businessLicense?: any;
  address?: string;
  leaderName?: string;
  leaderIdCard?: string;
  leaderPhone?: string;
  bankName?: string;
  bankAccount?: string;
}