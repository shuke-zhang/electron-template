import { ipcMain } from 'electron';

import { getConfig, setConfig } from './utils';

export function initConfig() {
  ipcMain.handle('get-app-config', async () => {
    return getConfig('app-config');
  });

  ipcMain.handle('set-app-config', async (_e, config) => {
    return setConfig('app-config', config);
  });
}
