/**
 * 猪圈
 */
export interface PigstyModel {
  createBy?: any;
  createTime?: any;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  id: number;
  sellerId: number;
  pigstyId: number;
  startTime: string;
  endTime: string;
  number: number;
  enterId?: number;
}