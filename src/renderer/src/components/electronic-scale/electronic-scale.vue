<script setup lang="ts">
import type { SerialPortType } from '@renderer/store/serialport';

import ContextMenu from '@imengyu/vue3-context-menu';
// import { random } from 'lodash-es';
import IEpRefresh from '~icons/ep/refresh';
import IEpSetting from '~icons/ep/setting';

const serialPortStore = useSerialPortStore();
const { scaleList, activeScale } = storeToRefs(serialPortStore);
const router = useRouter();
function getStatus(path?: string) {
  if (!path)
    return undefined;
  return serialPortStore.getScaleMapValue(path);
}

function onContextMenu(e: MouseEvent, item: SerialPortType) {
  // prevent the browser's default menu
  e.preventDefault();
  // show your menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: '刷新一下',
        icon: h(IEpRefresh),
        onClick: async () => {
          item.__loading = true;
          try {
            await serialPortStore.openSerialport(item.path);
          }
          catch (error: any) {
            confirmWarning(`串口[${item.path}]打开失败,请检查硬件设置或检查磅秤配置`, '提示', {
              confirmButtonText: '磅秤配置',
            }).then(() => {
              router.push('/scale');
            });
          }
          finally {
            item.__loading = false;
          }
        },
      },
      {
        label: '磅秤设置',
        icon: h(IEpSetting),
        onClick: () => {
          router.push('/scale');
        },
      },
    ],
  });
}
/**
 * 模拟电表  电表需要 发指令才可以收到消息
 */
// async function write() {
// const port = scaleList.value.find(e => e.id == activeScale.value)?.path;
// if (port) {
//   const msg = 'FE FE FE FE 68 48 86 00 00 16 09 68 11 04 33 36 34 35 A4 16';
//   window.serialport.write(port, msg);
//   await sleep(random(1200, 3000));
//   write();
// }
//   serialPortStore.__test__();
//   await sleep(random(1200, 3000));
//   write();
// }
// write();
const open = ref(false);

watch(open, () => {
  if (open.value) {
    serialPortStore.openAllSerialport();
  }
  else {
    serialPortStore.destroyAllPort();
  }
});
</script>

<template>
  <el-card class="electronic-scale" style="position: relative">
    <div class="flex items-center justify-center">
      <template v-if="scaleList.length">
        <div
          v-for="item in scaleList"
          :key="item.id"
          v-loading="item.__loading"
          class="electronic-scale-item flex items-center"
          :class="{ active: activeScale === item.id }"
          @contextmenu="onContextMenu($event, item)"
          @click="serialPortStore.setActiveScale(item.id)"
        >
          <div class="weight-value">
            <strong>{{ getStatus(item.path)?.value || '0.0' }}</strong>
            <span>kg</span>
          </div>
          <el-divider direction="vertical" />
          <div class="flex items-center electronic-scale-item-name">
            <p>
              {{ item.name }}
            </p>
            <!-- <el-tag v-if="getStatus(item.path)?.status === 'success'" type="success" size="small">
              成功
            </el-tag> -->
            <el-tag v-if="getStatus(item.path)?.status === 'fail'" type="danger" size="small">
              打开失败
            </el-tag>
            <el-tag
              v-else-if="!getStatus(item.path)?.status"
              effect="plain"
              type="warning"
              size="small"
            >
              未打开
            </el-tag>
          </div>
        </div>

        <!-- <el-switch v-model="open" style="position: absolute; top: 10px;right: 10px;"></el-switch> -->
      </template>

      <el-empty
        v-else
        :image-size="50"
        :style="{
          '--el-empty-padding': '0 0',
          '--el-empty-description-margin-top': '10px',
        }"
      >
        <template #description>
          <p class="inline-flex items-center">
            暂无磅秤数据，请先完成<router-link to="/scale" class="text-primary inline-flex items-center">
              磅秤配置
            </router-link>
          </p>
        </template>
      </el-empty>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.electronic-scale-item {
  padding: 15px 40px 15px 24px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;

  & + .electronic-scale-item {
    margin-left: 10px;
  }

  &.active::after {
    content: '当前选择';
    background-color: var(--el-color-primary);
    color: white;
    padding: 1px 4px;
    border-bottom-left-radius: 4px;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    font-size: 12px;
  }

  &.active {
    $primary-color: #409eff;

    border-color: var(--el-color-primary);
    background-color: rgba($primary-color, 0.1);

    strong {
      color: var(--el-color-primary);
    }

    &.active::after {
      opacity: 1;
    }
  }

  &:hover {
    cursor: pointer;
  }

  p {
    margin: 0;
    font-size: 12px;
    margin-right: 10px;
  }

  strong {
    font-size: 1.8em;
    display: inline-block;
    width: 3em;
    text-align: right;
    margin-right: 10px;
  }
}
</style>
