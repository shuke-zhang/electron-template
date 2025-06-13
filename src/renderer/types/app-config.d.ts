declare interface AppConfig {
  /**
   * 皮重 = 钩子重量(默认一根) + 链条重量(默认两根) + 滑轮重量(默认一个)
   */
  lw: number;
  // /**
  //  * 端口号
  //  */
  // ports: import('@serialport/bindings-interface').PortInfo[];

  /**
   * 钩子重量
   */
  hookWeight?: number;

  /**
   * 链条重量
   */
  chainWeight?: number;

  /**
   * 滑轮重量
   */
  pulleyWeight?: number;

  /**
   * 生产线
   */
  productionLine?: string;
  /**
   *
   * @deprecated
   */
  type?: string;
}
