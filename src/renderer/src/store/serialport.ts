import type { AutoDetectTypes } from '@serialport/bindings-cpp';
import type { PortInfo } from '@serialport/bindings-interface';
import type { SerialPortOpenOptions } from 'serialport';

import { merge, random } from 'lodash-es';
import { defineStore } from 'pinia';
import { v4 as uuidV4 } from 'uuid';

export interface SerialPortType {
  name?: string
  path?: string
  baudRate?: number
  parity?: SerialPortOpenOptions<AutoDetectTypes>['parity']
  dataBits?: number
  stopBits?: number
  id?: string
  __loading: boolean
}

export interface SerialPortData {
  status: 'fail' | 'success'
  value: any
  rawData: any
}

let _isAddListener = false;
export const useSerialPortStore = defineStore('serialport', () => {
  // 自动连接串口
  const autoOpen = false;
  const scaleMap = reactive(new Map<string, SerialPortData>());
  console.log('_isAddListener', _isAddListener);
  if (!_isAddListener) {
    _isAddListener = true;
    console.log('window.serialport.on');
    window.serialport.on('open', (config) => {
      console.log('window.serialport.on 1', config);
      setScaleMapValue(config.path, {
        status: 'success',
        value: '0.0',
        rawData: '',
      });
      console.log('window.serialport.on 2', scaleMap);
    });

    window.serialport.on('close', (config) => {
      deleteScaleMapValue(config.path);
      console.log('window.close', config);
    });

    window.serialport.on('error', (e, config) => {
      console.log('window.error', e, config);
      setScaleMapValue(config.path, {
        status: 'fail',
        value: '0.0',
        rawData: '',
      });
      console.log('error destroy');
      window.serialport.destroy(config.path!);
    });
    window.serialport.on('data', (data, config) => {
      setScaleMapValue(config.path, merge({}, getScaleMapValue(config.path), {
        rawData: data.row,
        value: data.value,
      }));
    });
  }

  const ports = ref<PortInfo[]>([]);

  const scaleRaw = useLocalStorage<SerialPortType[]>('ports-list', [

  ]);

  const scaleList = computed(() => scaleRaw.value);

  const activeScale = ref<string>('');

  // watch(() => scaleList.value, (a, b) => {
  //   /**
  //    * 设置称
  //    */
  //   if (scaleList.value?.length) {
  //     if (!activeScale.value) {
  //       setActiveScale(scaleList.value[0].id!);
  //     }
  //     /**
  //      * 尝试打开串口
  //      */
  //     if (JSON.stringify(a) !== JSON.stringify(b)) {
  //       scaleList.value.forEach((e) => {
  //         openSerialport(e.path!);
  //       });
  //     }
  //   }
  // }, {
  //   immediate: true,
  //   deep: true,
  // });

  const currentValue = computed(() => {
    const path = scaleList.value.find(e => e.id === activeScale.value)?.path;
    if (path) {
      const n = Number(getScaleMapValue(path)?.value);
      return (isNaN(n) ? 0 : n);
    }
    return 0;
  });

  getSerialPorts();

  return {
    ports,
    scaleList,
    activeScale,
    scaleMap,
    currentValue,
    autoOpen,
    delScale,
    addScale,
    updateScale,
    setScaleMapValue,
    getScaleMapValue,
    openSerialport,
    setActiveScale,
    openAllSerialport,
    destroyAllPort,
    __test__,
  };

  function __test__() {
    const config = scaleList.value?.[0];
    if (config.path) {
      setScaleMapValue(config.path, merge({}, getScaleMapValue(config.path), {
        rawData: '',
        value: (random(60, 200) + Math.random()).toFixed(2),
      }));
    }
  }

  // 设置 Map 的值的函数
  function setScaleMapValue(key: string, data: SerialPortData) {
    console.log('setScaleMapValue');
    console.log(data);
    scaleMap.set(key, merge(
      data,
    ));
  }
  function deleteScaleMapValue(key: string) {
    scaleMap.delete(key);
  }

  // 获取 Map 的值的函数
  function getScaleMapValue(key: string): SerialPortData | undefined {
    return scaleMap.get(key);
  }

  async function openSerialport(path?: string) {
    try {
      const s = getScaleMapValue(`${path}`)?.status;
      console.log('path 1', path);
      if (s === 'success') {
        console.warn(`${path} 已经打开`);
        return;
      }
      const it = scaleList.value.find(e => e.path == path);
      console.log('path 2', it);
      if (it) {
        await window.serialport.open(JSON.stringify(it));
      }
    }
    catch (error) {
      const it = scaleList.value.find(e => e.path == path);
      if (it?.path) {
        setScaleMapValue(it.path, {
          status: 'fail',
          value: '0.0',
          rawData: '',
        });
      }

      throw error;
    }
  }

  async function openAllSerialport() {
    for (const { path } of scaleList.value) {
      console.log('openAllSerialport', path);
      await openSerialport(path);
    }
  }

  function getSerialPorts() {
    window.serialport
      .list()
      .then((res) => {
        ports.value = res;
      });
  }

  function delScale(ids: (string | undefined)[]) {
    const data = ids.map(id => scaleRaw.value.find(e => e.id == id));
    scaleRaw.value = scaleRaw.value.filter(({ id }) => !ids.includes(id));
    for (let index = 0; index < data.length; index++) {
      if (data[index]!.path) {
        window.serialport.destroy(data[index]!.path!);
      }
    }
  }

  function addScale(data: Partial<SerialPortType>) {
    scaleRaw.value.push({
      ...data,
      id: uuidV4(),
    } as SerialPortType);
  }

  function updateScale(data: Partial<SerialPortType>) {
    const index = scaleRaw.value.findIndex((e) => {
      return e.id === data.id;
    });
    if (index != -1) {
      scaleRaw.value[index] = {
        ...data,
      } as SerialPortType;
    }
  }

  function destroyAllPort() {
    for (const { path } of scaleList.value) {
      if (path) {
        console.log('@destroyAllPort', path);
        window.serialport.destroy(path);
      }
    }
  }

  function setActiveScale(id?: string) {
    if (scaleList.value.every(e => e.id != id) || !id) {
      messageError(`串口路径[${id}]不存在`);
      return;
    }
    activeScale.value = id;
  }
});
