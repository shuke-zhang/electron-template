import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

const api = {
};

const serialport = {
  list: () => ipcRenderer.invoke('serialport:list'),

  open: async (json: string) => {
    console.log('---------------------------------');
    console.log('win =>> open');
    try {
      await ipcRenderer.invoke('serialport:open', json);
    }
    catch (error) {
      console.log('[preload] error');
      throw error;
    }
  },
  write: async (path: string, data: string) => {
    console.log('---------------------------------');
    console.log('win =>> write', path, data);
    try {
      await ipcRenderer.invoke('serialport:write', path, data);
    }
    catch (error) {
      console.log('[preload] error');
      throw error;
    }
  },
  close: async (path: string) => {
    console.log('win =>> close');
    if (!path) {
      console.warn('path 能为空');
      return;
    }
    await ipcRenderer.invoke('serialport:close', path);
  },
  destroy: async (path: string) => {
    console.log('win =>> destroy');
    if (!path) {
      console.warn('path 能为空');
      return;
    }
    await ipcRenderer.invoke('serialport:destroy', path);
  },
  on(event: string, callback: (...value: any) => void) {
    ipcRenderer.on(`serialport:${event}`, (_event, ...value) => callback(...value));
  },

};

export const logger = {
  msg: (callback: Function) => {
    ipcRenderer.on('log', (_event, ...value) => {
      callback(...value);
    });
  },
};

/**
 * 区别 系统默认的 print
 */
const pprint = {
  perform: async () => await ipcRenderer.invoke('print'),
  list: async () => await ipcRenderer.invoke('print:list') as Promise<Electron.PrinterInfo[]>,
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('serialport', serialport);
    contextBridge.exposeInMainWorld('logger', logger);
    contextBridge.exposeInMainWorld('pprint', pprint);
  }
  catch (error) {
    console.error(error);
  }
}
else {
  (window as any).electron = electronAPI;
  (window as any).api = api;
  (window as any).serialport = serialport;
  (window as any).logger = logger;
  (window as any).pprint = pprint;
}

export type PPrint = typeof pprint;

