import { AutoDetectTypes } from '@serialport/bindings-cpp';
import { ByteLengthParser } from '@serialport/parser-byte-length';
import { BrowserWindow, ipcMain } from 'electron';
import { SerialPort, SerialPortOpenOptions } from 'serialport';
import { getPrintersAsync, print } from './printer';

function addSpaceEveryTwoChars(str: string) {
  let result = '';
  for (let i = 0; i < str.length; i += 2) {
    result += `${str.slice(i, i + 2)} `;
  }
  return result.trim(); // 去除最后多余的空格
}
export const portMap: Map<string, SerialPort> = new Map();
export function initSerialPort(mainWindow: BrowserWindow) {
  ipcMain.handle('serialport:list', async () => {
    return await SerialPort.list();
  });

  ipcMain.handle('serialport:open', async (_e, json: string) => {
    return new Promise((resolve, reject) => {
      try {
        const config = JSON.parse(json) as SerialPortOpenOptions<AutoDetectTypes>;
        const path = config.path;
        let port: SerialPort;
        mainWindow.webContents.send('log', {
          type: 'serialport:open@start',
          data: {
            portMap,
            path,
          },
        });
        if (!portMap.get(path)) {
          port = new SerialPort({
            ...config,
            autoOpen: false,
          });
          portMap.set(path, port);
          console.log('port 1');

          const parser = port.pipe(new ByteLengthParser({ length: 12 }));

          function handleData2(data: any) {
            mainWindow.webContents.send('log', {
              data,
            });
            if (!data) {
              return;
            }

            const hexData = data.toString('hex') as string;
            const currentWeight = getValue(hexData);

            mainWindow.webContents.send('log', {
              hexData,
              currentWeight,
            });

            mainWindow.webContents.send('serialport:data', {
              row: data,
              value: currentWeight,
            }, config);
          }
          // const throttleHandleData = throttle(handleData2, 1000);
          parser.on('data', handleData2);
          // 监听串口的错误事件
          port.on('error', (err) => {
            console.error('Error:', err.message);
            mainWindow.webContents.send('log', {
              type: 'Error',
              data: err.message,
            });
            mainWindow.webContents.send('serialport:error', err.message, config);
          });

          // 监听串口的打开事件
          port.on('open', (e) => {
            if (e) {
              console.log('open.error', e);
              reject(e);
            }
            else {
              console.log(`@Serial ${config.path} port is open`);
              mainWindow.webContents.send('serialport:open', config);
              resolve('');
            }
          });
          // 监听串口的关闭事件
          console.log(['close']);
          port.on('close', () => {
            console.log('@Serial port is close');
            mainWindow.webContents.send('serialport:close', config);
          });
        }
        else {
          port = portMap.get(path)!;
          console.log('port 2', Date.now());
        }
        console.log(['port.isOpen'], port.isOpen);
        if (port.isOpen) {
          mainWindow.webContents.send('serialport:open', config);
          resolve('');
        }
        else {
          port.open((e) => {
            if (e) {
              mainWindow.webContents.send('log', {
                type: 'open',
                data: {
                  e,
                },
              });
              reject(e);
            }
            else {
              resolve('');
            }
          });
        }
      }
      catch (error) {
        mainWindow.webContents.send('log', {
          type: 'serialport:open@error',
          data: error,
        });
        reject(error);
      }
    });
  });

  ipcMain.handle('serialport:close', async (_e, path: string) => {
    const port = portMap.get(path);
    if (port) {
      port.close();
    }
  });
  ipcMain.handle('serialport:destroy', async (_e, path: string) => {
    const port = portMap.get(path);
    if (port) {
      port.close();
      port.destroy();
      portMap.delete(path);
    }
  });
  ipcMain.handle('serialport:write', async (_e, path: string, data: string) => {
    const bufferData = Buffer.from(data.replaceAll(' ', ''), 'hex');
    const port = portMap.get(path);
    if (port) {
      port.write(bufferData);
    }
  });

  ipcMain.handle('print', async () => {
    return print(mainWindow,);
  });

  // 打印机
  ipcMain.handle('print:list', async () => {
    return getPrintersAsync(mainWindow);
  });
}

function getValue(input: string) {
  const inputStr = input.toUpperCase().replace(/ /g, '');
  const startFlag = '022B';
  const i = inputStr.indexOf(startFlag);
  if (i != -1) {
    const value = inputStr.slice(i + 4, i + 4 + 12);
    if (value.length < 12) {
      // 30 35 39 31 02 2B 30 30 30  情况下：
      // 把 30 35 39 31 添加到 02 2B 30 30 30 后面
      // 得到 02 2B 30 30 30 30 35 39 31
      // 即可
      const end = inputStr.slice(0, i);
      const start = inputStr.slice(i, inputStr.length);
      return getValue(start + end);
    }
    if (value.length === 12) {
      const d_data = addSpaceEveryTwoChars(value).split(' ');
      const result = d_data.map(e => parseInt(e, 16) - parseInt('30', 16)).join('');
      const valuer = Number(result);
      if (isNaN(valuer)) {
        return null;
      }
      return valuer / 10;
    }
    return null;
  }
  return null;
}
