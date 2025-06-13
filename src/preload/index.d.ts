import type { ElectronAPI } from '@electron-toolkit/preload';
import type { AutoDetectTypes } from '@serialport/bindings-cpp';
import type { PortInfo } from '@serialport/bindings-interface';
import type { SerialPortOpenOptions } from 'serialport';

declare global {
  type SerialPortConfig = SerialPortOpenOptions<AutoDetectTypes>;
  interface Window {
    electron: ElectronAPI
    serialport: {
      list: () => Promise<PortInfo[]>
      open: (json: string) => Promise<any>
      close: (path: string) => Promise<any>
      destroy: (path: string) => Promise<any>
      write: (path: string, data: string) => Promise<void>
      on: {
        (e: 'open', callback: (config: SerialPortConfig) => void): void
        (e: 'close', callback: (config: SerialPortConfig) => void): void
        (e: 'error', callback: (errorMsg: string, config: SerialPortConfig) => void): void
        (e: 'data', callback: (data: { row: Data, value: CurrentWeight }, config: SerialPortConfig) => void): void
      }
    }
    logger: {
      msg: (callback: () => void) => void
    }
  }
}
