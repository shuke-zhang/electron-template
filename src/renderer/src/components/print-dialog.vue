<script setup lang="ts">
import { printableStatus, printerStatus } from './print-dialog.printer-status';

const emit = defineEmits(['refresh']);

const model = defineModel({
  type: Boolean,
});

// console.log();

async function handlePrint() {
  printSubmit();
}

async function printSubmit() {
  const html = document.querySelector('#print-content')!;
  const pc = document.querySelector('#print-container')!;

  const plist = await window.pprint?.list() || [];
  if (!plist.length) {
    messageError('没有可用的打印机');
    return;
  }

  const defaultPinter = plist.find(e => e.isDefault);
  if (!defaultPinter) {
    messageError('请将可用的打印机设置为默认');
    return;
  }

  // 确认有默认打印机 并且 不在指定状态内
  if (defaultPinter?.status && !printableStatus.includes(defaultPinter?.status)) {
    const desc = printerStatus.find(e => e.status === defaultPinter.status)?.desc || '打印机出错';
    messageError(desc);

    return;
  }

  if (html?.innerHTML && pc) {
    try {
      pc.innerHTML = html?.innerHTML;

      console.log('开始打印');
      await nextTick();
      const res = await window.pprint?.perform();
      console.log('打印结果', res);

      await sleep();
      model.value = false;
    }
    finally {
      // window.hideLoading();
    }
  }
  else {
    messageError('操作失败');
  }
}
</script>

<template>
  <Teleport
    v-if="model"
    to="body"
  >
    <div id="print-container"></div>
  </Teleport>

  <el-dialog
    v-model="model"
    :width="600"
    title="打印预览"
  >
    <div class="flex-center">
      <slot></slot>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="model = false">
          取消打印
        </el-button>
        <el-button type="primary" @click="handlePrint() ">
          确认打印
        </el-button>
      </div>
    </template>

    <!-- <el-card title="打印确认">

      <v-card-actions class="action">
        <v-spacer></v-spacer>

        <v-btn
          size="default"
          color="primary"
          variant="elevated"
          @click="handlePrint()"
        >
          确认打印
        </v-btn>
        <v-btn
          size="default"
          variant="outlined"
          @click="model = false"
        >
          取消打印
        </v-btn>
      </v-card-actions>
    </el-card> -->
  </el-dialog>
</template>

<style lang="scss">
@import url('./print-dialog.scss');
</style>
