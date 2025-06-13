import fs from 'fs';
import { join } from 'path';

import { app } from 'electron';

function checkFileExistsSync(filePath: string) {
  return new Promise((resolve) => {
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      // console.log('文件存在');
      resolve(true);
    }
    catch (err) {
      // console.error('文件不存在');
      resolve(false);
    }
  });
}

console.log(app.getPath('userData'));

export async function getConfig<T extends Record<string, any>>(filePath: string): Promise<Partial<T> | null> {
  const _filePath = join(app.getPath('userData'), `${filePath}.json`);
  if (! await checkFileExistsSync(_filePath)) {
    return null;
  }
  try {
    // 同步读取文件内容
    const data = fs.readFileSync(_filePath, 'utf8');
    // 将文件内容解析为 JSON 对象
    const jsonData = JSON.parse(data);
    console.log('获取配置文件:', _filePath);
    console.log(jsonData);
    return jsonData;
  }
  catch (err) {
    console.error('读取文件或解析 JSON 时出错:', err);
    return null;
  }
}

export async function setConfig(filePath: string, data) {
  console.log(data);
  const _filePath = join(app.getPath('userData'), `${filePath}.json`);
  try {
    fs.writeFileSync(_filePath, data);
  }
  catch (err) {
    console.error('读取文件或解析 JSON 时出错:', err);
    throw err;
  }
}

export function random(min: number, max: number, decimalPlaces: number) {
  const randomDecimal = (Math.random() * (max - min) + min).toFixed(decimalPlaces);
  return parseFloat(randomDecimal);
}

