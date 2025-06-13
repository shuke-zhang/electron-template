/**
 * 生猪过磅 数据模型
 */
export interface SlaughterConfigModel {
  createBy: string;
  createTime?: any;
  updateBy: string;
  updateTime?: any;
  remark?: any;
  id: number;
  name: string;
  weight: number;
}