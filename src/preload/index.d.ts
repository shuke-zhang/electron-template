import { ElectronAPI } from '@electron-toolkit/preload';
import { AutoDetectTypes } from '@serialport/bindings-cpp';
import { PortInfo } from '@serialport/bindings-interface';
import { SerialPortOpenOptions } from 'serialport';

declare global {
  type SerialPortConfig = SerialPortOpenOptions<AutoDetectTypes>;
  interface Window {
    electron: ElectronAPI;
    serialport: {
      list: () => Promise<PortInfo[]>;
      open: (json: string) => Promise<any>;
      close: (path: string) => Promise<any>;
      destroy: (path: string) => Promise<any>;
      write: (path: string, data: string) => Promise<void>;
      on(e: 'open', callback: (config: SerialPortConfig) => void);
      on(e: 'close', callback: (config: SerialPortConfig) => void);
      on(e: 'error', callback: (errorMsg: string, config: SerialPortConfig) => void);
      on(e: 'data', callback: (data: {
        row: data;
        value: currentWeight;
      }, config: SerialPortConfig) => void);
    };
    logger: {
      msg: (callback: Function) => void;
    };
  }
}
