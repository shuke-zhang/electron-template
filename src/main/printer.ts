import type { BrowserWindow } from 'electron';

export function print(mainWindow: BrowserWindow) {
  return new Promise((resolve, reject) => {
    try {
      const { webContents } = mainWindow;
      webContents.setZoomFactor(1.0); // 恢复默认缩放因子
      webContents.print({
      // 使用静默打印时会出现缩放很小的情况
        silent: false,
        pageSize: {
          width: 121000,
          height: 88900,
        },
        margins: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        color: false,
        printBackground: false,
      }, (success, error) => {
        console.log('success', success);
        console.log('error', error);
        if (success) {
          resolve(JSON.stringify({
            success,
            error: error ? error : false,
          }));
        }
        else {
          reject(error);
        }
      });
    }
    catch (error) {
      reject(error);
    }
  });
}

export async function getPrintersAsync(mainWindow: BrowserWindow) {
  // 主线程获取打印机列表
  const list = await mainWindow.webContents.getPrintersAsync();
  return list;
}
