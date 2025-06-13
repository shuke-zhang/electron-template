<script setup lang="ts">
import type { OrderWeightModel } from '@renderer/model/order-weight';

import TattooTable from './tattooTable.vue';

import {
  Switch,
} from '@element-plus/icons-vue';
import { swapTattoo } from '@renderer/api/tattoo';

const lastTattoo = ref<OrderWeightModel>({});
const newTattoo = ref<OrderWeightModel>({});
const btnLoading = ref(false);

const lastPigstyNo = computed(() => `${lastTattoo.value.pigstyNo}-${lastTattoo.value.pigNo}`);

const newPigstyNo = computed(() => `${newTattoo.value.pigstyNo}-${newTattoo.value.pigNo}`);

const isLastTattoo = computed(() => !!(lastTattoo.value.pigstyNo && lastTattoo.value.pigNo));

const isNewTattoo = computed(() => !!(newTattoo.value.pigstyNo && newTattoo.value.pigNo));

function handleSwap() {
  return confirmWarning(`是否确认将刺青号
  <strong style="color:var(--el-color-primary)">【${lastPigstyNo.value}】</strong>
  与
  <strong style="color:var(--el-color-primary)"> 【${newPigstyNo.value}】</strong>
  进行
  <span style=\'color:red\'>交换</span>？`, '', {
    dangerouslyUseHTMLString: true,
  }).then(() => {
    btnLoading.value = true;
    swapTattoo({
      idOne: lastTattoo.value.id!,
      idTwo: newTattoo.value.id!,
    }).then(() => {
      messageSuccess('操作成功');
      lastTattoo.value = {};
      newTattoo.value = {};
    }).finally(() => {
      btnLoading.value = false;
    });
  });
}
</script>

<template>
  <el-card class="h-full border-box">
    <Breadcrumb :item-list="['刺青交换']" />
    <!-- <div class="flex justify-space-between">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>刺青调换</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button plain type="primary" :icon="Back" @click="handleBlack">
        返回
      </el-button>
    </div> -->

    <div class="tattoo-table-container ">
      <el-row :gutter="20">
        <el-col :span="12">
          <TattooTable v-model="lastTattoo"></TattooTable>
        </el-col>

        <el-col :span="12">
          <TattooTable v-model="newTattoo"></TattooTable>
        </el-col>
      </el-row>
    </div>

    <div class="swap-container">
      <div v-if="isLastTattoo" class="swap-container-item flex flex-direction-column">
        <div class="flex flex-1 justify-space-between">
          <text>刺青号</text>
          <text class="text-black-3">
            {{ lastPigstyNo }}
          </text>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>状态</text>

          <el-tag :type="`${lastTattoo.status}` === '0' ? 'success' : `${lastTattoo.status}` === '1' ? 'warning' : 'danger' ">
            {{ `${lastTattoo.status}` === '0' ? '合格' : `${lastTattoo.status}` === '1' ? '无公害处理' : '急宰' }}
          </el-tag>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>毛重</text>
          <text class="text-black-3">
            {{ `${lastTattoo.gw}Kg` }}
          </text>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>皮重</text>
          <text class="text-black-3">
            {{ `${lastTattoo.lw}Kg` }}
          </text>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>净重</text>
          <text class="text-black-3">
            {{ `${lastTattoo.nw}Kg` }}
          </text>
        </div>
      </div>
      <div v-else class="swap-container-item flex-center text-black-4">
        请先选择刺青号
      </div>

      <!-- <i-ep-refresh></i-ep-refresh> -->
      <div class="flex-center h-full">
        <el-button
          type="primary" plain :disabled="!isLastTattoo || !isNewTattoo" :loading="btnLoading"
          :icon="Switch"
          @click="handleSwap"
        >
          交换
        </el-button>
      </div>
      <!-- <i-ep-zhihuan></i-ep-zhihuan> -->

      <div v-if="isNewTattoo" class="swap-container-item flex flex-direction-column">
        <div class="flex flex-1 justify-space-between">
          <text>刺青号</text>
          <text class="text-black-3">
            {{ newPigstyNo }}
          </text>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>状态</text>

          <el-tag :type="`${newTattoo.status}` === '0' ? 'success' : `${newTattoo.status}` === '1' ? 'warning' : 'danger' ">
            {{ `${newTattoo.status}` === '0' ? '合格' : `${newTattoo.status}` === '1' ? '无公害处理' : '急宰' }}
          </el-tag>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>毛重</text>
          <text class="text-black-3">
            {{ `${newTattoo.gw}Kg` }}
          </text>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>皮重</text>
          <text class="text-black-3">
            {{ `${newTattoo.lw}Kg` }}
          </text>
        </div>

        <div class="flex flex-1 justify-space-between">
          <text>净重</text>
          <text class="text-black-3">
            {{ `${newTattoo.nw}Kg` }}
          </text>
        </div>
      </div>
      <div v-else class="swap-container-item flex-center text-black-4">
        请先选择刺青号
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.tattoo-table-container{
  margin-top: 20px;
  height: 60vh;
}

.swap-container{
  margin: 0 auto;
  box-sizing: border-box;
  width: 500px;
  height: 200px;
  display: flex;
  justify-content: space-between;

  .swap-container-item {
    width: 200px;
    box-sizing: border-box;
    height: 100%;
    border: 2px solid #67c23a50;
    padding: 10px 20px;
  }
}

.el-table .row-name{
  // background-color: #ecf5ff !important;
  background-color: #de991a !important;
}
</style>
